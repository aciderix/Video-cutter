use crate::error::{AppError, AppResult};
use std::fs::File;
use std::path::Path;
use symphonia::core::audio::{AudioBufferRef, Signal};
use symphonia::core::codecs::{DecoderOptions, CODEC_TYPE_NULL};
use symphonia::core::errors::Error as SymphErr;
use symphonia::core::formats::FormatOptions;
use symphonia::core::io::MediaSourceStream;
use symphonia::core::meta::MetadataOptions;
use symphonia::core::probe::Hint;

/// Decode the first audio stream and produce `bins` peak values in [0, 1].
/// Each bin is the max absolute amplitude across the samples that fall into it.
///
/// `expected_duration_s` is the source duration the caller already knows from
/// ffprobe (`analyze_media`). When > 0 we use it as the time axis denominator
/// and bin every sample we decode without guessing — the bin spread stays
/// uniform regardless of file length. When 0 (caller didn't know), we still
/// fall back to a two-pass strategy: collect samples into a Vec, then bin.
pub fn extract_peaks(path: &str, bins: usize, expected_duration_s: f64) -> AppResult<Vec<f32>> {
    let p = Path::new(path);
    let file = File::open(p).map_err(AppError::FfmpegRun)?;
    let mss = MediaSourceStream::new(Box::new(file), Default::default());

    let mut hint = Hint::new();
    if let Some(ext) = p.extension().and_then(|s| s.to_str()) {
        hint.with_extension(ext);
    }

    let probed = symphonia::default::get_probe()
        .format(
            &hint,
            mss,
            &FormatOptions::default(),
            &MetadataOptions::default(),
        )
        .map_err(|e| AppError::Decode(format!("probe: {e}")))?;

    let mut format = probed.format;
    let track = format
        .tracks()
        .iter()
        .find(|t| t.codec_params.codec != CODEC_TYPE_NULL)
        .ok_or_else(|| AppError::Decode("no audio track".into()))?;
    let track_id = track.id;
    let sample_rate = track.codec_params.sample_rate.unwrap_or(48_000) as u64;

    let mut decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &DecoderOptions::default())
        .map_err(|e| AppError::Decode(format!("decoder: {e}")))?;

    let known_total_frames: u64 = if expected_duration_s > 0.0 {
        (expected_duration_s * sample_rate as f64).round() as u64
    } else {
        track.codec_params.n_frames.unwrap_or(0)
    };

    let mut peaks = vec![0.0f32; bins];

    if known_total_frames > 0 {
        // Single pass: we know the total, bin directly.
        let mut sample_index: u64 = 0;
        loop {
            let packet = match format.next_packet() {
                Ok(p) => p,
                Err(SymphErr::IoError(e)) if e.kind() == std::io::ErrorKind::UnexpectedEof => break,
                Err(SymphErr::ResetRequired) => break,
                Err(e) => return Err(AppError::Decode(format!("packet: {e}"))),
            };
            if packet.track_id() != track_id {
                continue;
            }
            let decoded = match decoder.decode(&packet) {
                Ok(d) => d,
                Err(SymphErr::DecodeError(_)) => continue,
                Err(e) => return Err(AppError::Decode(format!("decode: {e}"))),
            };
            accumulate_peaks(
                &decoded,
                &mut peaks,
                &mut sample_index,
                known_total_frames,
                bins,
            );
        }
    } else {
        // Two-pass: collect peaks-per-coarse-bucket, then redistribute.
        // We collect into a Vec<f32> with one entry per ~10 ms chunk; this
        // keeps memory bounded to ~360 KB/hour at 48 kHz instead of 691 MB.
        let bucket_size = (sample_rate / 100).max(1) as usize; // 10 ms
        let mut buckets: Vec<f32> = Vec::new();
        let mut current_bucket_peak: f32 = 0.0;
        let mut current_bucket_count: usize = 0;

        let mut push_sample = |v: f32, buckets: &mut Vec<f32>, peak: &mut f32, count: &mut usize| {
            let a = v.abs();
            if a > *peak {
                *peak = a;
            }
            *count += 1;
            if *count >= bucket_size {
                buckets.push(*peak);
                *peak = 0.0;
                *count = 0;
            }
        };

        loop {
            let packet = match format.next_packet() {
                Ok(p) => p,
                Err(SymphErr::IoError(e)) if e.kind() == std::io::ErrorKind::UnexpectedEof => break,
                Err(SymphErr::ResetRequired) => break,
                Err(e) => return Err(AppError::Decode(format!("packet: {e}"))),
            };
            if packet.track_id() != track_id {
                continue;
            }
            let decoded = match decoder.decode(&packet) {
                Ok(d) => d,
                Err(SymphErr::DecodeError(_)) => continue,
                Err(e) => return Err(AppError::Decode(format!("decode: {e}"))),
            };
            stream_samples(&decoded, |v| {
                push_sample(v, &mut buckets, &mut current_bucket_peak, &mut current_bucket_count);
            });
        }
        if current_bucket_count > 0 {
            buckets.push(current_bucket_peak);
        }

        // Down-sample the bucket array to `bins`.
        if !buckets.is_empty() {
            let per_bin = buckets.len() as f64 / bins as f64;
            for b in 0..bins {
                let start = (b as f64 * per_bin).floor() as usize;
                let end = ((b + 1) as f64 * per_bin).floor() as usize;
                let end = end.min(buckets.len()).max(start + 1);
                let mut peak = 0.0f32;
                for &v in &buckets[start..end] {
                    if v > peak {
                        peak = v;
                    }
                }
                peaks[b] = peak;
            }
        }
    }

    Ok(peaks)
}

fn stream_samples<F: FnMut(f32)>(buffer: &AudioBufferRef<'_>, mut f: F) {
    macro_rules! drain {
        ($buf:expr, $conv:expr) => {{
            let chan = $buf.chan(0);
            for s in chan {
                f($conv(s));
            }
        }};
    }
    match buffer {
        AudioBufferRef::F32(b) => drain!(b, |v: &f32| *v),
        AudioBufferRef::U8(b) => drain!(b, |v: &u8| (*v as f32 - 128.0) / 128.0),
        AudioBufferRef::S16(b) => drain!(b, |v: &i16| *v as f32 / 32768.0),
        AudioBufferRef::S24(b) => {
            drain!(b, |v: &symphonia::core::sample::i24| v.inner() as f32 / 8_388_608.0)
        }
        AudioBufferRef::S32(b) => drain!(b, |v: &i32| *v as f32 / 2_147_483_648.0),
        AudioBufferRef::F64(b) => drain!(b, |v: &f64| *v as f32),
        AudioBufferRef::U16(b) => drain!(b, |v: &u16| (*v as f32 - 32768.0) / 32768.0),
        AudioBufferRef::U24(b) => {
            drain!(b, |v: &symphonia::core::sample::u24| (v.inner() as f32 - 8_388_608.0)
                / 8_388_608.0)
        }
        AudioBufferRef::U32(b) => {
            drain!(b, |v: &u32| (*v as f32 - 2_147_483_648.0) / 2_147_483_648.0)
        }
        AudioBufferRef::S8(b) => drain!(b, |v: &i8| *v as f32 / 128.0),
    }
}

fn accumulate_peaks(
    buffer: &AudioBufferRef<'_>,
    peaks: &mut [f32],
    sample_index: &mut u64,
    estimated_total: u64,
    bins: usize,
) {
    match buffer {
        AudioBufferRef::F32(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| v.abs()),
        AudioBufferRef::U8(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| ((*v as f32 - 128.0) / 128.0).abs()),
        AudioBufferRef::S16(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| (*v as f32 / 32768.0).abs()),
        AudioBufferRef::S24(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| (v.inner() as f32 / 8_388_608.0).abs()),
        AudioBufferRef::S32(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| (*v as f32 / 2_147_483_648.0).abs()),
        AudioBufferRef::F64(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| v.abs() as f32),
        AudioBufferRef::U16(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| ((*v as f32 - 32768.0) / 32768.0).abs()),
        AudioBufferRef::U24(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| ((v.inner() as f32 - 8_388_608.0) / 8_388_608.0).abs()),
        AudioBufferRef::U32(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| ((*v as f32 - 2_147_483_648.0) / 2_147_483_648.0).abs()),
        AudioBufferRef::S8(b) => accumulate_planar(b.chan(0), peaks, sample_index, estimated_total, bins, |v| (*v as f32 / 128.0).abs()),
    }
}

fn accumulate_planar<T, F>(
    channel: &[T],
    peaks: &mut [f32],
    sample_index: &mut u64,
    estimated_total: u64,
    bins: usize,
    to_abs: F,
) where
    F: Fn(&T) -> f32,
{
    for sample in channel {
        let bin = ((*sample_index * bins as u64) / estimated_total.max(1)) as usize;
        let bin = bin.min(bins - 1);
        let v = to_abs(sample);
        if v > peaks[bin] {
            peaks[bin] = v;
        }
        *sample_index += 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn fixture() -> Option<PathBuf> {
        let p = PathBuf::from("/tmp/test.wav");
        p.exists().then_some(p)
    }

    #[test]
    fn extracts_peaks_from_test_wav_known_duration() {
        let Some(path) = fixture() else {
            eprintln!("skipping: /tmp/test.wav missing");
            return;
        };
        let peaks = extract_peaks(path.to_str().unwrap(), 100, 3.5).unwrap();
        assert_eq!(peaks.len(), 100);
        let max = peaks.iter().cloned().fold(0.0f32, f32::max);
        assert!(max > 0.1, "expected loud peaks, got max {max}");
        let silent_max = peaks[40..55].iter().cloned().fold(0.0f32, f32::max);
        assert!(
            silent_max < max * 0.1,
            "expected silent middle <10% of loud, got silent={silent_max} loud={max}"
        );
    }

    #[test]
    fn extracts_peaks_from_test_wav_unknown_duration() {
        // Two-pass fallback path: spread should look the same.
        let Some(path) = fixture() else {
            eprintln!("skipping: /tmp/test.wav missing");
            return;
        };
        let peaks = extract_peaks(path.to_str().unwrap(), 100, 0.0).unwrap();
        let max = peaks.iter().cloned().fold(0.0f32, f32::max);
        assert!(max > 0.1, "two-pass max {max}");
        let silent_max = peaks[40..55].iter().cloned().fold(0.0f32, f32::max);
        assert!(silent_max < max * 0.1, "two-pass silent {silent_max} vs {max}");
    }
}
