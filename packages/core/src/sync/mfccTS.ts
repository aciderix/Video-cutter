/**
 * Pure-TypeScript MFCC + DTW alignment engine for mobile and browser
 * environments. Mirrors the Rust `audio_sync` module so the alignment
 * results are interchangeable: same 13-coefficient MFCC at 25 ms / 10 ms
 * hop, same cosine-distance DTW with a Sakoe-Chiba band.
 *
 * Standalone — no external FFT or signal-processing deps. The
 * radix-2 Cooley-Tukey FFT below is fine for the 512-sample frames the
 * pipeline uses; if a future MFCC config needs non-power-of-2 sizes,
 * swap in a Bluestein implementation.
 */

const TARGET_SAMPLE_RATE = 16_000;
const FRAME_LENGTH_MS = 25.0;
const HOP_LENGTH_MS = 10.0;
const N_MELS = 26;
export const N_COEFFS = 13;
const MEL_LOW_HZ = 80.0;
const MEL_HIGH_HZ = 8_000.0;

export interface MfccSequence {
  /** row-major: frames × N_COEFFS */
  frames: Float32Array;
  /** L2 norm of each frame, cached so cosine distance skips one sqrt per pair. */
  norms: Float32Array;
  nFrames: number;
  hopSeconds: number;
}

export function computeMfcc(samples: Float32Array, sampleRate: number): MfccSequence {
  if (samples.length === 0) {
    return {
      frames: new Float32Array(0),
      norms: new Float32Array(0),
      nFrames: 0,
      hopSeconds: HOP_LENGTH_MS / 1000,
    };
  }
  const resampled =
    sampleRate === TARGET_SAMPLE_RATE
      ? samples
      : resampleLinear(samples, sampleRate, TARGET_SAMPLE_RATE);
  const preemph = preemphasis(resampled, 0.97);

  const frameLen = Math.round((TARGET_SAMPLE_RATE * FRAME_LENGTH_MS) / 1000);
  const hopLen = Math.round((TARGET_SAMPLE_RATE * HOP_LENGTH_MS) / 1000);
  const nFft = nextPow2(frameLen);

  if (preemph.length < frameLen) {
    return {
      frames: new Float32Array(0),
      norms: new Float32Array(0),
      nFrames: 0,
      hopSeconds: HOP_LENGTH_MS / 1000,
    };
  }

  const nFrames = 1 + Math.floor((preemph.length - frameLen) / hopLen);
  const hamming = hammingWindow(frameLen);
  const melFilters = buildMelFilterbank(nFft, TARGET_SAMPLE_RATE, N_MELS);
  const dct = buildDctMatrix(N_MELS, N_COEFFS);

  const out = new Float32Array(nFrames * N_COEFFS);
  const norms = new Float32Array(nFrames);
  // Two parallel arrays for real/imaginary FFT input/output.
  const re = new Float32Array(nFft);
  const im = new Float32Array(nFft);
  const power = new Float32Array(nFft / 2 + 1);
  const mel = new Float32Array(N_MELS);

  for (let f = 0; f < nFrames; f++) {
    const start = f * hopLen;
    re.fill(0);
    im.fill(0);
    for (let i = 0; i < frameLen; i++) {
      re[i] = preemph[start + i]! * hamming[i]!;
    }
    fftInPlace(re, im);
    for (let k = 0; k < power.length; k++) {
      const rr = re[k]!;
      const ii = im[k]!;
      power[k] = (rr * rr + ii * ii) / nFft;
    }
    applyMelFilters(power, melFilters, mel);
    for (let m = 0; m < mel.length; m++) {
      mel[m] = Math.log(Math.max(mel[m]!, 1e-10));
    }
    let frameNormSq = 0;
    for (let c = 0; c < N_COEFFS; c++) {
      const rowOffset = c * N_MELS;
      let s = 0;
      for (let m = 0; m < N_MELS; m++) {
        s += dct[rowOffset + m]! * mel[m]!;
      }
      out[f * N_COEFFS + c] = s;
      frameNormSq += s * s;
    }
    norms[f] = Math.sqrt(frameNormSq);
  }

  return { frames: out, norms, nFrames, hopSeconds: HOP_LENGTH_MS / 1000 };
}

// --- DSP helpers --------------------------------------------------------

function preemphasis(samples: Float32Array, alpha: number): Float32Array {
  if (samples.length === 0) return new Float32Array(0);
  const out = new Float32Array(samples.length);
  out[0] = samples[0]!;
  for (let i = 1; i < samples.length; i++) {
    out[i] = samples[i]! - alpha * samples[i - 1]!;
  }
  return out;
}

function hammingWindow(n: number): Float32Array {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    w[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1));
  }
  return w;
}

function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/**
 * In-place radix-2 Cooley-Tukey FFT. `re` and `im` must have the same
 * length, a power of two. Bit-reversal + butterflies, no recursion to
 * keep the JS engine happy and reuse the input arrays.
 */
function fftInPlace(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  // Bit reversal
  let j = 0;
  for (let i = 1; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      let tmp = re[i]!;
      re[i] = re[j]!;
      re[j] = tmp;
      tmp = im[i]!;
      im[i] = im[j]!;
      im[j] = tmp;
    }
  }
  // Butterflies
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1;
    const angleStep = (-2 * Math.PI) / len;
    const wpRe = Math.cos(angleStep);
    const wpIm = Math.sin(angleStep);
    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      for (let k = 0; k < half; k++) {
        const ix = i + k;
        const iy = ix + half;
        const tRe = wRe * re[iy]! - wIm * im[iy]!;
        const tIm = wRe * im[iy]! + wIm * re[iy]!;
        re[iy] = re[ix]! - tRe;
        im[iy] = im[ix]! - tIm;
        re[ix] = re[ix]! + tRe;
        im[ix] = im[ix]! + tIm;
        const nextRe = wRe * wpRe - wIm * wpIm;
        wIm = wRe * wpIm + wIm * wpRe;
        wRe = nextRe;
      }
    }
  }
}

function buildMelFilterbank(nFft: number, sampleRate: number, nMels: number): Float32Array {
  const nBins = nFft / 2 + 1;
  const melLow = hzToMel(MEL_LOW_HZ);
  const melHigh = hzToMel(Math.min(MEL_HIGH_HZ, sampleRate / 2));
  const melPoints = new Float32Array(nMels + 2);
  for (let i = 0; i < nMels + 2; i++) {
    melPoints[i] = melLow + ((melHigh - melLow) * i) / (nMels + 1);
  }
  const binPoints = new Int32Array(nMels + 2);
  for (let i = 0; i < nMels + 2; i++) {
    binPoints[i] = Math.floor(((nFft + 1) * melToHz(melPoints[i]!)) / sampleRate);
  }

  const filters = new Float32Array(nMels * nBins);
  for (let m = 1; m <= nMels; m++) {
    const fMinus = binPoints[m - 1]!;
    const fM = binPoints[m]!;
    const fPlus = binPoints[m + 1]!;
    for (let k = fMinus; k < fM; k++) {
      const denom = Math.max(fM - fMinus, 1);
      filters[(m - 1) * nBins + k] = (k - fMinus) / denom;
    }
    for (let k = fM; k < fPlus; k++) {
      const denom = Math.max(fPlus - fM, 1);
      filters[(m - 1) * nBins + k] = (fPlus - k) / denom;
    }
  }
  return filters;
}

function applyMelFilters(power: Float32Array, filters: Float32Array, out: Float32Array): void {
  const nBins = power.length;
  for (let m = 0; m < out.length; m++) {
    let s = 0;
    const rowOffset = m * nBins;
    for (let k = 0; k < nBins; k++) {
      s += filters[rowOffset + k]! * power[k]!;
    }
    out[m] = s;
  }
}

function hzToMel(hz: number): number {
  return 2595 * Math.log10(1 + hz / 700);
}

function melToHz(mel: number): number {
  return 700 * (Math.pow(10, mel / 2595) - 1);
}

function buildDctMatrix(nMels: number, nCoeffs: number): Float32Array {
  const mat = new Float32Array(nCoeffs * nMels);
  const scaleFirst = Math.sqrt(1 / nMels);
  const scaleOther = Math.sqrt(2 / nMels);
  for (let k = 0; k < nCoeffs; k++) {
    const scale = k === 0 ? scaleFirst : scaleOther;
    for (let n = 0; n < nMels; n++) {
      mat[k * nMels + n] = scale * Math.cos((Math.PI / nMels) * (n + 0.5) * k);
    }
  }
  return mat;
}

function resampleLinear(samples: Float32Array, srcRate: number, dstRate: number): Float32Array {
  if (srcRate === dstRate || samples.length === 0) return samples;
  const ratio = srcRate / dstRate;
  const outLen = Math.floor(samples.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const srcPos = i * ratio;
    const idx = Math.floor(srcPos);
    const frac = srcPos - idx;
    const a = samples[idx]!;
    const b = idx + 1 < samples.length ? samples[idx + 1]! : a;
    out[i] = a + (b - a) * frac;
  }
  return out;
}
