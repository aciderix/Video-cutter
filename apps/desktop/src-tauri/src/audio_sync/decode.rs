//! Decode an audio file (or the audio track of a video) into a mono
//! f32 buffer that the MFCC pipeline can consume. Reuses Symphonia so
//! we don't pull a second decoder dep. Returns the native sample rate
//! — `compute_mfcc` will resample internally.

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

/// Decode the first audio track and return mono samples + sample rate.
/// Optional `start_s` / `end_s` clip the decoded range — useful when we
/// just need the middle of a long file for alignment.
pub fn decode_to_mono(
    path: &str,
    start_s: Option<f32>,
    end_s: Option<f32>,
) -> AppResult<(Vec<f32>, u32)> {
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
    let sample_rate = track.codec_params.sample_rate.unwrap_or(48_000);
    let start_sample = start_s.map(|s| (s * sample_rate as f32) as usize).unwrap_or(0);
    let end_sample = end_s.map(|s| (s * sample_rate as f32) as usize);

    let mut decoder = symphonia::default::get_codecs()
        .make(&track.codec_params, &DecoderOptions::default())
        .map_err(|e| AppError::Decode(format!("decoder: {e}")))?;

    let mut samples: Vec<f32> = Vec::new();
    let mut current_index = 0usize;

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
        append_mono(&decoded, &mut samples, &mut current_index, start_sample, end_sample);
        if let Some(end) = end_sample {
            if current_index >= end {
                break;
            }
        }
    }

    Ok((samples, sample_rate))
}

fn append_mono(
    buffer: &AudioBufferRef<'_>,
    out: &mut Vec<f32>,
    current_index: &mut usize,
    start_sample: usize,
    end_sample: Option<usize>,
) {
    let frames = buffer.frames();
    let take_start_in_buf = if *current_index + frames <= start_sample {
        *current_index += frames;
        return;
    } else if *current_index < start_sample {
        let skip = start_sample - *current_index;
        *current_index = start_sample;
        skip
    } else {
        0
    };

    let take_end_in_buf = match end_sample {
        Some(end) if *current_index + frames > end => end - *current_index,
        _ => frames,
    };

    let n_channels = buffer.spec().channels.count();
    macro_rules! drain {
        ($buf:expr, $conv:expr) => {{
            for i in take_start_in_buf..take_end_in_buf {
                let mut sum = 0.0f32;
                for c in 0..n_channels {
                    sum += $conv($buf.chan(c)[i]);
                }
                out.push(sum / n_channels as f32);
            }
        }};
    }
    match buffer {
        AudioBufferRef::F32(b) => drain!(b, |v: f32| v),
        AudioBufferRef::U8(b) => drain!(b, |v: u8| (v as f32 - 128.0) / 128.0),
        AudioBufferRef::S16(b) => drain!(b, |v: i16| v as f32 / 32768.0),
        AudioBufferRef::S24(b) => drain!(b, |v: symphonia::core::sample::i24| v.inner() as f32 / 8_388_608.0),
        AudioBufferRef::S32(b) => drain!(b, |v: i32| v as f32 / 2_147_483_648.0),
        AudioBufferRef::F64(b) => drain!(b, |v: f64| v as f32),
        AudioBufferRef::U16(b) => drain!(b, |v: u16| (v as f32 - 32768.0) / 32768.0),
        AudioBufferRef::U24(b) => drain!(b, |v: symphonia::core::sample::u24| (v.inner() as f32 - 8_388_608.0) / 8_388_608.0),
        AudioBufferRef::U32(b) => drain!(b, |v: u32| (v as f32 - 2_147_483_648.0) / 2_147_483_648.0),
        AudioBufferRef::S8(b) => drain!(b, |v: i8| v as f32 / 128.0),
    }

    *current_index += take_end_in_buf;
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
    fn decodes_full_test_wav() {
        let Some(path) = fixture() else {
            eprintln!("skipping: /tmp/test.wav missing");
            return;
        };
        let (samples, sr) = decode_to_mono(path.to_str().unwrap(), None, None).unwrap();
        assert_eq!(sr, 16_000);
        // 3.5 s × 16 kHz = 56 000 samples.
        assert!(
            samples.len() >= 55_000 && samples.len() <= 57_000,
            "decoded {} samples, expected ~56000",
            samples.len()
        );
    }

    #[test]
    fn decodes_clip_range() {
        let Some(path) = fixture() else {
            eprintln!("skipping: /tmp/test.wav missing");
            return;
        };
        let (samples, sr) = decode_to_mono(path.to_str().unwrap(), Some(0.5), Some(1.0)).unwrap();
        assert_eq!(sr, 16_000);
        eprintln!("decoded {} samples for 0.5..1.0 range", samples.len());
        // Symphonia packets are bigger than the requested window so the
        // last partial packet ends a little after the target — allow a
        // packet's worth of slack (4096 frames).
        assert!(
            samples.len() >= 4_000 && samples.len() <= 13_000,
            "decoded {} samples, expected ≈ 8000 ± a packet",
            samples.len()
        );
    }
}
