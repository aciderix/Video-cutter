//! Audio synchronisation between a reference clip (e.g. camera audio)
//! and one or more candidate clips (clean microphone takes). Outputs
//! AlignedSegment ranges so the editor can place each candidate at the
//! right time on the master timeline.

pub mod align;
pub mod cmd;
pub mod decode;
pub mod dtw;
pub mod mfcc;

#[allow(unused_imports)]
pub use align::{align_segmented, align_whole, AlignedSegment, AlignmentReport};
pub use decode::decode_to_mono;
#[allow(unused_imports)]
pub use mfcc::{compute_mfcc, MfccSequence};
