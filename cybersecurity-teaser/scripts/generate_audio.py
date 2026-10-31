"""Procedurally synthesise the soundtrack and sound effects.

Everything here is generated from oscillators and noise, so the audio is
original and royalty-free. The music bed follows the scene boundaries and
beats defined in src/data/timeline.json, so re-running this after a timing
change keeps the score in sync.

Usage:  python scripts/generate_audio.py
Output: public/audio/music/score.wav and public/audio/sfx/*.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
rng = np.random.default_rng(7)


# ---------- helpers ----------

def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def lp(x, hz, order=2):
    b, a = signal.butter(order, hz / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, hz, order=2):
    b, a = signal.butter(order, hz / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def sweep_filter(x, f0, f1, kind="band", q=1.2, block=512):
    """Block-wise filter whose centre frequency glides exponentially f0 -> f1."""
    out = np.zeros_like(x)
    n = len(x)
    zi = None
    for i in range(0, n, block):
        frac = i / max(n - 1, 1)
        fc = f0 * (f1 / f0) ** frac
        if kind == "band":
            lo, hi = fc / (1 + 1 / q), min(fc * (1 + 1 / q), SR / 2 - 100)
            b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], "band")
        else:
            b, a = signal.butter(2, min(fc, SR / 2 - 100) / (SR / 2), "low")
        if zi is None or len(zi) != max(len(a), len(b)) - 1:
            zi = signal.lfilter_zi(b, a) * 0
        out[i:i + block], zi = signal.lfilter(b, a, x[i:i + block], zi=zi)
    return out


def env_exp(n, decay):
    return np.exp(-np.arange(n) / SR / decay)


def fade(x, fin=0.005, fout=0.02):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def saw(freq, t, harmonics=24):
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if freq * k > SR / 2.2:
            break
        out += np.sin(2 * np.pi * freq * k * t) / k
    return out


def place(buf, clip, at_s, gain=1.0):
    i = int(at_s * SR)
    if i >= len(buf):
        return
    j = min(i + len(clip), len(buf))
    buf[i:j] += clip[: j - i] * gain


def stereo(mono, width=0.0, delay_ms=11):
    d = int(delay_ms / 1000 * SR)
    r = np.concatenate([np.zeros(d), mono])[: len(mono)]
    left = mono
    right = (1 - width) * mono + width * r
    return np.stack([left, right], axis=1)


def write(path, x):
    path.parent.mkdir(parents=True, exist_ok=True)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    sf.write(path, x.astype(np.float32), SR, subtype="PCM_16")


# ---------- sound effects ----------

def sfx_impact(dur=2.2, f0=110, f1=32):
    t = t_axis(dur)
    freq = f1 + (f0 - f1) * np.exp(-t / 0.12)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * env_exp(len(t), 0.65)
    crack = lp(rng.standard_normal(len(t)), 2500) * env_exp(len(t), 0.05) * 0.6
    tail = lp(rng.standard_normal(len(t)), 400) * env_exp(len(t), 0.9) * 0.15
    x = np.tanh(1.8 * (body + crack + tail))
    return norm(fade(x, 0.001, 0.3))


def sfx_boom():
    return sfx_impact(3.5, 70, 26)


def sfx_glitch(dur=0.45, seed=0):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    x = np.zeros(n)
    i = 0
    while i < n:
        seg = int(r.uniform(0.008, 0.05) * SR)
        kind = r.integers(0, 4)
        tt = np.arange(seg) / SR
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * r.uniform(80, 1800) * tt))
        elif kind == 1:
            s = r.standard_normal(seg)
            s = np.round(s * 3) / 3  # bitcrush
        elif kind == 2:
            s = np.zeros(seg)
        else:
            s = np.sin(2 * np.pi * r.uniform(2000, 6000) * tt)
        x[i:i + seg] = s[: n - i] * r.uniform(0.3, 1.0)
        i += seg
    x = hp(x, 120) * np.linspace(1, 0.6, n)
    return norm(fade(x, 0.001, 0.03), 0.7)


def sfx_whoosh(dur=0.9, up=True):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    f0, f1 = (300, 6000) if up else (6000, 300)
    x = sweep_filter(noise, f0, f1, "band", q=2.0)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return norm(stereo(x * shape, 0.6, 17), 0.75)


def sfx_riser(dur=3.0):
    t = t_axis(dur)
    n = len(t)
    noise = sweep_filter(rng.standard_normal(n), 200, 9000, "band", q=1.5)
    freq = 80 * (16 ** (t / dur))
    tone = np.sin(2 * np.pi * np.cumsum(freq) / SR) * 0.4
    tone += np.sin(2 * np.pi * np.cumsum(freq * 1.5) / SR) * 0.2
    shape = (t / dur) ** 2.2
    x = (noise * 0.8 + tone) * shape
    return norm(stereo(fade(x, 0.01, 0.01), 0.5), 0.7)


def sfx_heartbeat():
    def thump(f, d, a):
        t = t_axis(d)
        fr = f * (1 + 0.8 * np.exp(-t / 0.02))
        return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env_exp(len(t), 0.07) * a
    out = np.zeros(int(0.7 * SR))
    place(out, thump(52, 0.35, 1.0), 0.0)
    place(out, thump(46, 0.35, 0.7), 0.2)
    return norm(lp(np.tanh(out * 1.5), 180), 0.95)


def sfx_notify():
    """Fictional two-tone message chime (not any real app's sound)."""
    out = np.zeros(int(0.6 * SR))
    for f, at in ((1175, 0.0), (1568, 0.09)):
        t = t_axis(0.45)
        tone = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)) * env_exp(len(t), 0.11)
        place(out, tone, at)
    return norm(fade(out), 0.6)


def sfx_alert():
    """Darker, detuned notification for the suspicious messages."""
    out = np.zeros(int(0.8 * SR))
    for f, at in ((880, 0.0), (830, 0.12)):
        t = t_axis(0.6)
        tone = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.01 * t)) * env_exp(len(t), 0.16)
        place(out, tone, at)
    return norm(fade(out), 0.6)


def sfx_vibrate(dur=1.3):
    t = t_axis(dur)
    buzz = np.sign(np.sin(2 * np.pi * 165 * t)) * 0.5 + np.sin(2 * np.pi * 330 * t) * 0.3
    gate = ((t % 0.55) < 0.38).astype(float)
    gate = lp(gate, 60)
    return norm(lp(buzz, 1200) * gate, 0.55)


def sfx_click():
    t = t_axis(0.06)
    x = hp(rng.standard_normal(len(t)), 2000) * env_exp(len(t), 0.004)
    x += np.sin(2 * np.pi * 2400 * t) * env_exp(len(t), 0.008) * 0.5
    return norm(x, 0.8)


def sfx_tick():
    t = t_axis(0.12)
    x = np.sin(2 * np.pi * 3200 * t) * env_exp(len(t), 0.012)
    x += np.sin(2 * np.pi * 1600 * t) * env_exp(len(t), 0.02) * 0.4
    return norm(x, 0.5)


def sfx_counter(dur=2.0):
    out = np.zeros(int(dur * SR))
    tk = sfx_tick()
    tt, k = 0.0, 0
    while tt < dur - 0.1:
        place(out, tk, tt, 0.5 + 0.5 * (1 - tt / dur))
        tt += 0.035 + 0.06 * (tt / dur) ** 2
        k += 1
    return norm(out, 0.5)


def sfx_chime():
    out = np.zeros(int(1.2 * SR))
    for i, f in enumerate((784, 988, 1175, 1568)):
        t = t_axis(0.8)
        place(out, np.sin(2 * np.pi * f * t) * env_exp(len(t), 0.25), i * 0.06)
    return norm(fade(out), 0.5)


def sfx_shimmer(dur=3.0):
    t = t_axis(dur)
    x = np.zeros_like(t)
    for f in (1174.7, 1480, 1760, 2217, 2637):
        x += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.5 + 0.5 * np.sin(2 * np.pi * rng.uniform(3, 7) * t))
    shape = np.minimum(t / 0.4, 1) * np.exp(-t / 1.4)
    return norm(stereo(x * shape, 0.7, 23), 0.45)


def sfx_scan():
    """UI scan sweep for data/shield reveals."""
    t = t_axis(0.7)
    freq = 600 + 2400 * (t / 0.7)
    x = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.sin(np.pi * t / 0.7) ** 2
    return norm(stereo(x * 0.6, 0.5), 0.4)


def sfx_typing(dur=1.0):
    out = np.zeros(int(dur * SR))
    tt = 0.0
    while tt < dur - 0.05:
        c = sfx_click() * rng.uniform(0.3, 0.7)
        place(out, lp(c, 5000), tt)
        tt += rng.uniform(0.06, 0.14)
    return norm(out, 0.45)


# ---------- music bed ----------

def build_score(tl):
    fps = tl["fps"]
    total = tl["durationInFrames"] / fps
    sc = {k: (v["from"] / fps, v["to"] / fps) for k, v in tl["scenes"].items()}
    beats = {k: v / fps for k, v in tl["beats"].items()}
    t = t_axis(total)
    n = len(t)

    def window(a, b, fin=1.0, fout=1.0):
        w = np.clip((t - a) / max(fin, 1e-3), 0, 1) * np.clip((b - t) / max(fout, 1e-3), 0, 1)
        return w

    # 1) Dark drone (D) through hook/threat/reality, slow breathing LFO
    drone = saw(36.71, t, 30) * 0.6 + saw(36.71 * 1.003, t, 30) * 0.6 + saw(55.0, t, 20) * 0.35
    drone = lp(drone, 260, 2)
    lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * t)
    drone_env = window(0.0, beats["blueTurn"] + 0.6, 0.4, 1.5) * (0.55 + 0.45 * np.clip((t - sc["threat"][0]) / 6, 0, 1))
    mix = drone * lfo * drone_env * 0.32

    # 2) Pulse: sub-kick tempo rises from 72 to 100 bpm through the threat scene
    pulse = np.zeros(n)
    kick_t = t_axis(0.4)
    kick = np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-kick_t / 0.03)) / SR) * env_exp(len(kick_t), 0.12)
    tt = 0.9
    while tt < sc["reality"][0] - 0.2:
        bpm = 72 if tt < sc["threat"][0] else 72 + 28 * min((tt - sc["threat"][0]) / 6, 1)
        place(pulse, kick, tt, 0.8 if tt >= sc["threat"][0] else 0.55)
        tt += 60 / bpm
    # half-time pulse under the statistics
    tt = sc["reality"][0] + 1.6
    while tt < beats["blueTurn"] - 1.2:
        place(pulse, kick, tt, 0.6)
        tt += 60 / 60
    mix += lp(pulse, 200) * 0.55

    # 3) Tension pad (D minor cluster) swelling through threat + reality
    pad = np.zeros(n)
    for f, a in ((146.83, 1), (174.61, 0.8), (220.0, 0.7), (233.08, 0.25)):
        vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t + rng.uniform(0, 6))
        pad += (np.sin(2 * np.pi * np.cumsum(f * vib) / SR) + 0.3 * np.sin(2 * np.pi * np.cumsum(2 * f * vib) / SR)) * a
    pad = lp(pad, 1400)
    pad_env = window(sc["threat"][0] - 1, beats["blueTurn"] + 0.3, 4, 1.2) * (0.6 + 0.4 * np.clip((t - sc["reality"][0]) / 8, 0, 1))
    mix += pad * pad_env * 0.07

    # 4) High ticking clock during the hook (attention, unease)
    tick = np.zeros(n)
    tk = sfx_tick()
    tt = 0.45
    while tt < sc["threat"][0]:
        place(tick, tk, tt, 0.18)
        tt += 0.4167
    mix += tick

    # 5) Blue section: hopeful Dmaj9 pad + plucked arpeggio at 110 bpm
    s4a, s4b = sc["intro"]
    lift = np.zeros(n)
    for f, a in ((73.42, 0.8), (146.83, 1), (220.0, 0.8), (277.18, 0.6), (329.63, 0.5), (440.0, 0.3)):
        lift += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * a * (1 + 0.15 * np.sin(2 * np.pi * 0.3 * t))
    lift = lp(lift, 2200)
    mix += lift * window(beats["blueTurn"] - 0.2, s4b + 0.6, 2.0, 1.5) * 0.06

    arp = np.zeros(n)
    notes = (293.66, 440.0, 554.37, 659.25, 587.33, 440.0, 369.99, 554.37)
    step = 60 / 110 / 2
    tt, k = beats["cyberWord"] / 1.0 - 0.3, 0
    pl_t = t_axis(0.5)
    while tt < s4b - 0.3:
        f = notes[k % len(notes)]
        pl = (np.sin(2 * np.pi * f * pl_t) + 0.4 * np.sin(2 * np.pi * 2 * f * pl_t)) * env_exp(len(pl_t), 0.12)
        place(arp, pl, tt, 0.5 + 0.2 * (k % 2 == 0))
        tt += step
        k += 1
    arp = arp + 0.35 * np.concatenate([np.zeros(int(step * 1.5 * SR)), arp])[:n]  # dotted delay
    mix += lp(arp, 4000) * window(beats["cyberWord"] - 0.5, s4b, 1.5, 0.6) * 0.12

    kick2 = np.zeros(n)
    tt = beats["cyberWord"] + 0.1
    while tt < s4b - 0.4:
        place(kick2, kick, tt, 0.5)
        tt += 60 / 110 * 2
    mix += lp(kick2, 200) * 0.4

    # 6) Cliffhanger: near-silence, low tone; title tail after reveal; then silence
    s5a, _ = sc["cliffhanger"]
    low = np.sin(2 * np.pi * 36.71 * t) * 0.6 + np.sin(2 * np.pi * 73.42 * t) * 0.25
    mix += low * window(s5a + 0.3, beats["titleReveal"], 2.0, 0.05) * 0.18
    tail = (saw(36.71, t, 12) + saw(55.0, t, 10) * 0.6)
    tail = lp(tail, 500) * window(beats["titleReveal"], beats["glitchOut"] + 0.1, 0.02, 0.15)
    tail *= np.exp(-np.clip(t - beats["titleReveal"], 0, None) / 2.6)
    mix += tail * 0.3

    # hard silence at the end
    mix[int(beats["silence"] * SR):] = 0
    return norm(stereo(mix, 0.35, 13), 0.8)


def main():
    tl = json.loads((ROOT / "src/data/timeline.json").read_text())
    out = ROOT / "public/audio"
    write(out / "music/score.wav", build_score(tl))
    sfx = {
        "impact": sfx_impact(),
        "boom": sfx_boom(),
        "glitch": sfx_glitch(0.45, 1),
        "glitch_short": sfx_glitch(0.22, 2),
        "glitch_long": sfx_glitch(0.9, 3),
        "whoosh_up": sfx_whoosh(0.9, True),
        "whoosh_down": sfx_whoosh(0.8, False),
        "riser": sfx_riser(3.0),
        "heartbeat": sfx_heartbeat(),
        "notify": sfx_notify(),
        "alert": sfx_alert(),
        "vibrate": sfx_vibrate(),
        "click": sfx_click(),
        "tick": sfx_tick(),
        "counter": sfx_counter(2.0),
        "chime": sfx_chime(),
        "shimmer": sfx_shimmer(),
        "scan": sfx_scan(),
        "typing": sfx_typing(),
    }
    for name, x in sfx.items():
        write(out / f"sfx/{name}.wav", x)
    print("wrote score +", len(sfx), "sfx")


if __name__ == "__main__":
    main()
