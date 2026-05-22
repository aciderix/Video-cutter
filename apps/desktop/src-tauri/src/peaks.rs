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
pub fn extract_peaks(path: &str, bins: usize) -> AppResult<Vec<f32>> {
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
    let total_frames = track.codec_params.n_frames.unwrap_or(0);

    let mut decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &DecoderOptions::default())
        .map_err(|e| AppError::Decode(format!("decoder: {e}")))?;

    let estimated_total = if total_frames > 0 {
        total_frames
    } else {
        sample_rate * 600
    };
    let mut peaks = vec![0.0f32; bins];
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
        accumulate_peaks(&decoded, &mut peaks, &mut sample_index, estimated_total, bins);
    }

    if sample_index > 0 && sample_index != estimated_total {
        let actual_bins =
            ((sample_index.saturating_sub(1)) * bins as u64 / sample_index.max(1)) as usize + 1;
        let used = actual_bins.min(bins);
        if used < bins {
            for v in &mut peaks[used..] {
                *v = 0.0;
            }
        }
    }

    Ok(peaks)
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
    fn extracts_peaks_from_test_wav() {
        let Some(path) = fixture() else {
            eprintln!("skipping: /tmp/test.wav missing");
            return;
        };
        let peaks = extract_peaks(path.to_str().unwrap(), 100).unwrap();
        assert_eq!(peaks.len(), 100);
        let max = peaks.iter().cloned().fold(0.0f32, f32::max);
        assert!(max > 0.1, "expected loud peaks, got max {max}");
        let silent_max = peaks[40..55].iter().cloned().fold(0.0f32, f32::max);
        assert!(
            silent_max < max * 0.1,
            "expected silent middle to be <10% of loud, got silent={silent_max} loud={max}"
        );
    }
}
