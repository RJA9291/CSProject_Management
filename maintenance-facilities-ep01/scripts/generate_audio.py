"""Original, royalty-free score and sound effects (procedural synthesis).

Score sections follow the scene ranges in src/data/timeline.json:
  1 cinematic intro + build · 2–3 documentary pulse · 4, 6, 7 digital arpeggios
  5 industrial percussion · 8 inspirational lift and resolve

Usage:  python scripts/generate_audio.py
Output: public/audio/music/score.flac, public/audio/sfx/*.wav
"""
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(21)


def T(d):
    return np.arange(int(d * SR)) / SR


def lp(x, hz, o=2):
    b, a = signal.butter(o, hz / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, hz, o=2):
    b, a = signal.butter(o, hz / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), min(hi, SR / 2 - 100) / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def env(n, d):
    return np.exp(-np.arange(n) / SR / d)


def norm(x, p=0.89):
    m = np.max(np.abs(x)) or 1
    return x / m * p


def place(buf, clip, at, g=1.0):
    i = int(at * SR)
    if i < 0 or i >= len(buf):
        return
    j = min(i + len(clip), len(buf))
    buf[i:j] += clip[: j - i] * g


def stereo(m, w=0.35, ms=12):
    d = int(ms / 1000 * SR)
    r = np.concatenate([np.zeros(d), m])[: len(m)]
    return np.stack([m, (1 - w) * m + w * r], axis=1)


def write(p, x):
    p.parent.mkdir(parents=True, exist_ok=True)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    sf.write(p, x.astype(np.float32), SR, subtype="PCM_16")


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def fade(x, a=0.01, b=0.05):
    x = x.copy()
    na, nb = int(a * SR), int(b * SR)
    if na:
        x[:na] *= np.linspace(0, 1, na)
    if nb:
        x[-nb:] *= np.linspace(1, 0, nb)
    return x


# ------------------------------------------------------------------ SFX

def s_machine_hum(d=8.0):
    t = T(d)
    x = sum(a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f, a in ((50, 0.4), (100, 1), (150, 0.3), (200, 0.4), (300, 0.15)))
    x += lp(rng.standard_normal(len(t)), 500) * 0.25
    x *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.3 * t)
    return norm(fade(x, 1, 1), 0.6)


def s_servo(d=1.4):
    t = T(d)
    f = 380 + 260 * np.sin(np.pi * t / d)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.5 + np.sin(2 * np.pi * np.cumsum(f * 2.01) / SR) * 0.25
    x += bp(rng.standard_normal(len(t)), 800, 3000) * 0.15
    return norm(fade(x * np.sin(np.pi * t / d) ** 0.6, 0.05, 0.2), 0.5)


def s_spot_weld():
    t = T(0.6)
    zap = hp(rng.standard_normal(len(t)), 1500) * env(len(t), 0.04)
    thunk = np.sin(2 * np.pi * 90 * t) * env(len(t), 0.05)
    sizzle = bp(rng.standard_normal(len(t)), 3000, 9000) * env(len(t), 0.18) * 0.4
    return norm(zap + thunk * 0.8 + sizzle, 0.7)


def s_conveyor(d=6.0):
    out = np.zeros(int(d * SR))
    tt = 0.0
    while tt < d:
        n = int(0.06 * SR)
        clank = bp(rng.standard_normal(n), 400, 2500) * env(n, 0.015)
        place(out, clank, tt, rng.uniform(0.4, 1))
        tt += 0.42
    out += lp(rng.standard_normal(len(out)), 200) * 0.2
    return norm(fade(out, 0.5, 0.5), 0.5)


def s_elec_buzz(d=4.0):
    t = T(d)
    x = np.sign(np.sin(2 * np.pi * 100 * t)) * 0.3 + np.sin(2 * np.pi * 50 * t) * 0.4
    x = lp(x, 1500)
    return norm(fade(x, 0.3, 0.6), 0.45)


def s_click():
    t = T(0.12)
    x = hp(rng.standard_normal(len(t)), 1500) * env(len(t), 0.006) + np.sin(2 * np.pi * 160 * t) * env(len(t), 0.03) * 0.6
    return norm(x, 0.8)


def s_beep():
    t = T(0.18)
    x = np.sin(2 * np.pi * 2400 * t) * np.minimum(1, np.minimum(t / 0.005, (0.18 - t) / 0.01))
    return norm(x, 0.4)


def s_ratchet(d=1.2):
    out = np.zeros(int(d * SR))
    tt = 0.0
    while tt < d - 0.05:
        n = int(0.025 * SR)
        place(out, hp(rng.standard_normal(n), 2500) * env(n, 0.004), tt, rng.uniform(0.5, 1))
        tt += 0.07
    return norm(out, 0.6)


def s_gear(d=3.0):
    t = T(d)
    x = np.sin(2 * np.pi * 180 * t) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 22 * t)))
    x = lp(x, 2000) + bp(rng.standard_normal(len(t)), 500, 2000) * 0.2
    return norm(fade(x, 0.3, 0.5), 0.45)


def s_weld_arc(d=4.5):
    t = T(d)
    hiss = bp(rng.standard_normal(len(t)), 2000, 10000)
    crack = np.zeros(len(t))
    tt = 0.0
    while tt < d:
        n = int(rng.uniform(0.002, 0.01) * SR)
        place(crack, hp(rng.standard_normal(n), 3000) * env(n, 0.002), tt, rng.uniform(0.3, 1))
        tt += rng.exponential(0.02)
    buzz = np.sin(2 * np.pi * 100 * t) * 0.15
    x = hiss * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 7 * t))) + crack * 0.8 + buzz
    return norm(fade(x, 0.05, 0.3), 0.6)


def s_ui():
    out = np.zeros(int(0.35 * SR))
    for f, at in ((1320, 0), (1980, 0.06)):
        t = T(0.25)
        place(out, np.sin(2 * np.pi * f * t) * env(len(t), 0.06), at)
    return norm(out, 0.4)


def s_whoosh(d=1.1):
    n = int(d * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 1024
    for i in range(0, n, blk):
        fc = 300 * (14 ** (i / n))
        seg = bp(noise[max(0, i - 2048): i + blk], fc / 1.6, fc * 1.6)
        out[i:i + blk] = seg[-len(out[i:i + blk]):]
    return norm(stereo(out * np.sin(np.linspace(0, np.pi, n)) ** 2, 0.6, 17), 0.5)


def s_impact():
    t = T(2.4)
    fr = 40 + 70 * np.exp(-t / 0.1)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(t), 0.7) + lp(rng.standard_normal(len(t)), 300) * env(len(t), 0.9) * 0.12
    return norm(np.tanh(1.4 * x), 0.8)


def s_shimmer(d=3.0):
    t = T(d)
    x = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(3, 6) * t)) for f in (1318.5, 1568, 1975.5, 2637))
    return norm(stereo(x * np.minimum(t / 0.3, 1) * np.exp(-t / 1.2), 0.6), 0.35)


def s_alarm(n=4):
    out = np.zeros(int(0.5 * n * SR))
    for k in range(n):
        t = T(0.25)
        place(out, (np.sin(2 * np.pi * 880 * t) + 0.4 * np.sin(2 * np.pi * 1760 * t)) * np.minimum(1, (0.25 - t) / 0.02), k * 0.5)
    return norm(out, 0.4)


def s_footsteps(d=6.0, rate=1.75):
    out = np.zeros(int(d * SR))
    tt = 0.1
    while tt < d - 0.2:
        n = int(0.09 * SR)
        step = lp(rng.standard_normal(n), 900) * env(n, 0.02) + np.sin(2 * np.pi * 75 * T(0.09)) * env(n, 0.03) * 0.6
        place(out, step, tt, rng.uniform(0.6, 1))
        tt += 1 / rate + rng.uniform(-0.02, 0.02)
    return norm(out, 0.6)


def s_panel_open():
    t = T(0.8)
    creak = np.sin(2 * np.pi * np.cumsum(300 + 120 * np.sin(t * 9)) / SR) * env(len(t), 0.3) * 0.3
    c = s_click()
    click = np.concatenate([c, np.zeros(len(t) - len(c))])
    return norm(click + lp(creak, 1200), 0.6)


def s_wind(d=6.0):
    t = T(d)
    x = lp(rng.standard_normal(len(t)), 600) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.2 * t))
    return norm(fade(x, 1, 1.5), 0.5)


# ------------------------------------------------------------------ music

def pad(freqs, t, bright=0.8):
    o = np.zeros_like(t)
    for f in freqs:
        for k, a in ((1, 1.0), (2, 0.35 * bright), (3, 0.14 * bright)):
            o += a * np.sin(2 * np.pi * f * k * (1 + rng.uniform(-0.0015, 0.0015)) * t + rng.uniform(0, 6))
    return o


def build_score(tl):
    fps = tl["fps"]
    total = tl["total"] / fps
    sc = {s["id"]: (s["from"] / fps, (s["from"] + s["len"]) / fps) for s in tl["scenes"]}
    n = int(total * SR)
    t = np.arange(n) / SR
    mix = np.zeros(n)

    def win(a, b, fin=1.5, fout=1.5):
        return np.clip((t - a) / fin, 0, 1) * np.clip((b - t) / fout, 0, 1)

    # chords: Am - F - C - G (documentary), lift in scene 8: F - G - Am - C -> C
    prog = [[45, 57, 60, 64], [41, 57, 60, 65], [48, 55, 60, 64], [43, 55, 59, 62]]
    lift = [[41, 57, 60, 65], [43, 55, 59, 62], [45, 57, 60, 64], [48, 55, 60, 67]]
    cl = 5.0
    padbuf = np.zeros(n)
    bass = np.zeros(n)
    s8 = sc[8][0]
    for ci, c0 in enumerate(np.arange(0, total, cl)):
        ch = (lift if c0 >= s8 - 0.5 else prog)[ci % 4]
        m = (t >= c0 - 0.6) & (t < c0 + cl + 0.6)
        tt = t[m] - c0
        e = np.clip((tt + 0.6) / 1.2, 0, 1) * np.clip((cl + 0.6 - tt) / 1.2, 0, 1)
        padbuf[m] += pad([midi(x) for x in ch], tt) * e
        bass[m] += np.sin(2 * np.pi * midi(ch[0] - 12) * tt) * e
    padbuf = lp(padbuf, 1800)
    level = 0.045 + 0.03 * win(*sc[8], 3, 4)
    mix += padbuf * level * win(0, total, 3, 4)
    mix += lp(bass, 180) * 0.11 * win(1.0, total, 4, 4)

    # scene 1: rising tension into the factory
    riser = np.sin(2 * np.pi * np.cumsum(60 * 2 ** (np.clip(t / sc[1][1], 0, 1) * 1.5)) / SR)
    mix += lp(riser, 400) * 0.05 * win(sc[1][0] + 2, sc[1][1] + 0.5, 4, 0.5)

    # documentary pulse (96 bpm) scenes 2–3 and 8
    kt = T(0.35)
    kick = np.sin(2 * np.pi * np.cumsum(48 + 70 * np.exp(-kt / 0.03)) / SR) * env(len(kt), 0.12)
    ht = T(0.05)
    hat = hp(rng.standard_normal(len(ht)), 7000) * env(len(ht), 0.01)
    pulse = np.zeros(n)
    beat = 60 / 96
    for a, b in ((sc[1][1] - 3.0, sc[3][1]), (sc[8][0] + 1, sc[8][1] - 3)):
        tt = a
        while tt < b - 0.5:
            place(pulse, kick, tt, 0.7)
            place(pulse, hat, tt + beat / 2, 0.14)
            tt += beat
    mix += lp(pulse, 6000) * 0.2

    # digital arpeggios (scenes 4, 6, 7)
    arp = np.zeros(n)
    step = 60 / 104 / 2
    pt = T(0.8)
    k = 0
    for sid in (4, 6, 7):
        a, b = sc[sid]
        tt = a + 0.4
        while tt < b - 0.4:
            ch = prog[int(tt // cl) % 4]
            f = midi(ch[[1, 2, 3, 2][k % 4]] + 12)
            place(arp, (np.sin(2 * np.pi * f * pt) + 0.3 * np.sin(2 * np.pi * 2 * f * pt)) * env(len(pt), 0.16), tt, 0.8 + 0.2 * (k % 2))
            tt += step
            k += 1
    arp += 0.3 * np.concatenate([np.zeros(int(step * 3 * SR)), arp])[:n]
    mix += lp(arp, 4000) * 0.045

    # industrial percussion (scene 5): metallic hits + low toms, 104 bpm
    perc = np.zeros(n)
    a, b = sc[5]
    beat = 60 / 104
    tt = a + 0.2
    i = 0
    while tt < b - 0.5:
        nt = int(0.4 * SR)
        tom = np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-T(0.4) / 0.04)) / SR) * env(nt, 0.15)
        place(perc, tom, tt, 0.7 if i % 4 in (0, 2) else 0.35)
        if i % 4 == 3:
            ml = bp(rng.standard_normal(int(0.3 * SR)), 2500, 6000) * env(int(0.3 * SR), 0.06)
            ml += np.sin(2 * np.pi * 1870 * T(0.3)) * env(int(0.3 * SR), 0.12) * 0.4
            place(perc, ml, tt, 0.35)
        tt += beat / 2
        i += 1
    mix += perc * 0.14

    # scene 8 swell + final resolve on C major
    s8a, s8b = sc[8]
    fin = pad([midi(x) for x in (48, 55, 60, 64, 67, 72)], t, 1.0)
    mix += lp(fin, 2500) * 0.05 * win(s8b - 5, total, 2, 3)

    mix = norm(stereo(mix, 0.4, 14), 0.8)
    mix *= np.clip((total - t) / 3.0, 0, 1)[:, None]
    return mix


def main():
    tl = json.loads((ROOT / "src/data/timeline.json").read_text())
    wav = ROOT / "public/audio/music/score.wav"
    write(wav, build_score(tl))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-c:a", "flac", "-compression_level", "8", str(wav.with_suffix(".flac"))], check=True)
    wav.unlink()
    sfx = {
        "machine_hum": s_machine_hum(),
        "servo": s_servo(),
        "spot_weld": s_spot_weld(),
        "conveyor": s_conveyor(),
        "elec_buzz": s_elec_buzz(),
        "click": s_click(),
        "beep": s_beep(),
        "ratchet": s_ratchet(),
        "gear": s_gear(),
        "weld_arc": s_weld_arc(),
        "ui": s_ui(),
        "whoosh": s_whoosh(),
        "impact": s_impact(),
        "shimmer": s_shimmer(),
        "alarm": s_alarm(),
        "footsteps": s_footsteps(),
        "panel_open": s_panel_open(),
        "wind": s_wind(),
    }
    for k, v in sfx.items():
        write(ROOT / f"public/audio/sfx/{k}.wav", v)
    print("score + %d sfx" % len(sfx))


if __name__ == "__main__":
    main()
