"""Procedurally synthesise the documentary score and sound effects (original, royalty-free).

The score follows the scene ranges in src/data/timeline.json:
  1 intro (calm pad) · 2 risks (tension pulse) · 3–4 explanation (light arpeggio)
  5 example (tension) · 6 benefits (lift) · 7 conclusion (resolve) · references (tail)

Usage:  python scripts/generate_audio.py
Output: public/audio/music/score.wav, public/audio/sfx/*.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(11)


def t_axis(d):
    return np.arange(int(d * SR)) / SR


def lp(x, hz, order=2):
    b, a = signal.butter(order, hz / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, hz, order=2):
    b, a = signal.butter(order, hz / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def env_exp(n, decay):
    return np.exp(-np.arange(n) / SR / decay)


def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def place(buf, clip, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    j = min(i + len(clip), len(buf))
    buf[i:j] += clip[: j - i] * gain


def stereo(m, width=0.3, ms=12):
    d = int(ms / 1000 * SR)
    r = np.concatenate([np.zeros(d), m])[: len(m)]
    return np.stack([m, (1 - width) * m + width * r], axis=1)


def write(path, x):
    path.parent.mkdir(parents=True, exist_ok=True)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    sf.write(path, x.astype(np.float32), SR, subtype="PCM_16")


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


# ---------------------------------------------------------------- SFX

def sfx_hum(d=8.0):
    """Transformer hum: 100 Hz magnetostriction + harmonics, gently modulated."""
    t = t_axis(d)
    x = sum(a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f, a in ((100, 1), (200, 0.5), (300, 0.25), (400, 0.12), (50, 0.3)))
    x *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.21 * t)
    x += lp(rng.standard_normal(len(t)), 400) * 0.08
    fade = np.minimum(1, np.minimum(t / 1.0, (d - t) / 1.0))
    return norm(x * fade, 0.6)


def sfx_click():
    t = t_axis(0.12)
    x = hp(rng.standard_normal(len(t)), 1500) * env_exp(len(t), 0.006)
    x += np.sin(2 * np.pi * 900 * t) * env_exp(len(t), 0.015) * 0.6
    x += np.sin(2 * np.pi * 140 * t) * env_exp(len(t), 0.03) * 0.5  # mechanical thunk
    return norm(x, 0.8)


def sfx_beep(n=3, f=1650, on=0.16, off=0.14):
    out = np.zeros(int((on + off) * n * SR))
    for k in range(n):
        tt = t_axis(on)
        tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.minimum(1, np.minimum(tt / 0.005, (on - tt) / 0.01))
        place(out, tone, k * (on + off))
    return norm(out, 0.45)


def sfx_whoosh(d=1.1):
    n = int(d * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 1024
    for i in range(0, n, blk):
        fc = 300 * (12 ** (i / n))
        out[i:i + blk] = bp(noise[max(0, i - 2048):i + blk], fc / 1.6, min(fc * 1.6, 20000))[-len(out[i:i + blk]):]
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return norm(stereo(out * shape, 0.6, 17), 0.5)


def sfx_impact():
    t = t_axis(2.5)
    fr = 38 + 70 * np.exp(-t / 0.1)
    body = np.sin(2 * np.pi * np.cumsum(fr) / SR) * env_exp(len(t), 0.7)
    tail = lp(rng.standard_normal(len(t)), 300) * env_exp(len(t), 1.0) * 0.12
    return norm(np.tanh(1.4 * (body + tail)), 0.8)


def sfx_tick():
    t = t_axis(0.15)
    x = np.sin(2 * np.pi * 2600 * t) * env_exp(len(t), 0.012) + np.sin(2 * np.pi * 1300 * t) * env_exp(len(t), 0.03) * 0.4
    return norm(x, 0.4)


def sfx_crackle(d=2.5):
    """Electrical arcing / partial-discharge crackle."""
    out = np.zeros(int(d * SR))
    tt = 0.0
    while tt < d - 0.05:
        n = int(rng.uniform(0.002, 0.012) * SR)
        burst = hp(rng.standard_normal(n), 2500) * env_exp(n, 0.002)
        place(out, burst, tt, rng.uniform(0.3, 1.0))
        tt += rng.exponential(0.03)
    buzz = np.sign(np.sin(2 * np.pi * 100 * t_axis(d))) * 0.05
    return norm((out + buzz) * np.minimum(1, t_axis(d) / 0.1), 0.6)


def sfx_rise(d=4.0):
    t = t_axis(d)
    f = 120 * 2 ** (t / d * 2)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 0.3
    return norm(lp(x, 2500) * (t / d) ** 1.8, 0.45)


def sfx_shimmer(d=3.0):
    t = t_axis(d)
    x = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(3, 6) * t)) for f in (1174.7, 1568, 1760, 2349))
    return norm(stereo(x * np.minimum(t / 0.3, 1) * np.exp(-t / 1.2), 0.6), 0.35)


# ---------------------------------------------------------------- music

def pad_voice(freqs, t, bright=1.0):
    out = np.zeros_like(t)
    for f in freqs:
        for k, a in ((1, 1.0), (2, 0.35 * bright), (3, 0.15 * bright), (4, 0.06 * bright)):
            det = 1 + rng.uniform(-0.0015, 0.0015)
            out += a * np.sin(2 * np.pi * f * k * det * t + rng.uniform(0, 6))
    return out


def build_score(tl):
    fps = tl["fps"]
    total = tl["durationInFrames"] / fps
    sc = {k: (v["from"] / fps, v["to"] / fps) for k, v in tl["scenes"].items()}
    n = int(total * SR)
    t = np.arange(n) / SR
    mix = np.zeros(n)

    def win(a, b, fin=2.0, fout=2.0):
        return np.clip((t - a) / fin, 0, 1) * np.clip((b - t) / fout, 0, 1)

    # chord progression (Dm - Bb - F - C), 6 s per chord
    prog = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]
    lift = [[41, 53, 57, 60], [48, 55, 60, 64], [50, 57, 62, 65], [46, 53, 58, 62]]  # F C Dm Bb
    chord_len = 6.0
    pad = np.zeros(n)
    bass = np.zeros(n)
    s6a = sc["6"][0]
    for ci, c0 in enumerate(np.arange(0, total, chord_len)):
        chord = (lift if c0 >= s6a - 0.5 else prog)[ci % 4]
        seg = (t >= c0 - 0.6) & (t < c0 + chord_len + 0.6)
        tt = t[seg] - c0
        envc = np.clip((tt + 0.6) / 1.2, 0, 1) * np.clip((chord_len + 0.6 - tt) / 1.2, 0, 1)
        pad[seg] += pad_voice([midi(m) for m in chord], tt, 0.8) * envc
        bass[seg] += np.sin(2 * np.pi * midi(chord[0] - 12) * tt) * envc
    pad = lp(pad, 1800)
    pad_level = 0.05 + 0.02 * win(sc["6"][0], sc["7"][1], 3, 4)
    mix += pad * pad_level * win(0, total, 2.5, 6)
    mix += lp(bass, 200) * 0.12 * win(0.5, total, 3, 6)

    # arpeggio (soft pluck) for explanation + benefits sections, 84 bpm 8ths
    step = 60 / 84 / 2
    arp = np.zeros(n)
    pl_t = t_axis(0.9)
    k = 0
    for start, end, level in ((sc["3"][0], sc["4"][1], 0.9), (sc["6"][0], sc["7"][0] + 6, 1.0)):
        tt = start + 0.5
        while tt < end - 0.5:
            ci = int(tt // chord_len)
            chord = (lift if tt >= s6a - 0.5 else prog)[ci % 4]
            note = midi(chord[[1, 2, 3, 2][k % 4]] + 12)
            pl = (np.sin(2 * np.pi * note * pl_t) + 0.35 * np.sin(2 * np.pi * 2 * note * pl_t)) * env_exp(len(pl_t), 0.18)
            place(arp, pl, tt, level * (0.8 if k % 2 else 1.0))
            tt += step
            k += 1
    arp += 0.3 * np.concatenate([np.zeros(int(step * 3 * SR)), arp])[:n]
    mix += lp(arp, 3800) * 0.05

    # tension pulse for risks + example (sub kick + ticking hi-hat)
    kick_t = t_axis(0.35)
    kick = np.sin(2 * np.pi * np.cumsum(48 + 70 * np.exp(-kick_t / 0.03)) / SR) * env_exp(len(kick_t), 0.12)
    hat_t = t_axis(0.05)
    hat = hp(rng.standard_normal(len(hat_t)), 7000) * env_exp(len(hat_t), 0.01)
    pulse = np.zeros(n)
    for a, b in (sc["2"], sc["5"]):
        tt = a + 1.0
        beat = 60 / 84
        i = 0
        while tt < b - 1.0:
            place(pulse, kick, tt, 0.8)
            place(pulse, hat, tt + beat / 2, 0.15)
            tt += beat
            i += 1
    mix += lp(pulse, 6000) * 0.22

    # low tension drone under risks + example
    drone = sum(np.sin(2 * np.pi * f * t + p) for f, p in ((36.7, 0), (55.0, 1.3), (73.4, 2.1)))
    mix += lp(drone, 200) * 0.05 * (win(*sc["2"], 2, 2) + win(*sc["5"], 2, 2))

    mix = norm(stereo(mix, 0.4, 14), 0.8)
    # long fade at the end
    mix *= np.clip((total - t) / 4.0, 0, 1)[:, None]
    return mix


def main():
    tl = json.loads((ROOT / "src/data/timeline.json").read_text())
    wav = ROOT / "public/audio/music/score.wav"
    write(wav, build_score(tl))
    # stored as lossless FLAC to keep the repository small
    import subprocess
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-c:a", "flac", "-compression_level", "8", str(wav.with_suffix(".flac"))], check=True)
    wav.unlink()
    sfx = {
        "hum": sfx_hum(),
        "click": sfx_click(),
        "beep": sfx_beep(),
        "whoosh": sfx_whoosh(),
        "impact": sfx_impact(),
        "tick": sfx_tick(),
        "crackle": sfx_crackle(),
        "rise": sfx_rise(),
        "shimmer": sfx_shimmer(),
    }
    for k, v in sfx.items():
        write(ROOT / f"public/audio/sfx/{k}.wav", v)
    print("score + %d sfx written" % len(sfx))


if __name__ == "__main__":
    main()
