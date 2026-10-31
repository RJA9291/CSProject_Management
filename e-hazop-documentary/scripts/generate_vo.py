"""Generate the British English narration with Kokoro (local neural TTS, Apache-2.0 weights).

Usage:
  PHONEMIZER_ESPEAK_LIBRARY=/usr/lib/x86_64-linux-gnu/libespeak-ng.so.1 \
  python scripts/generate_vo.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin

Each line is phonemised (en-gb), pronunciation fixes are applied at phoneme level
(e.g. HAZOP -> /ˈhazɒp/), then synthesised. Writes public/audio/vo/<id>.wav and
src/data/vo-durations.json. With --measure-only, only durations are refreshed
(use this after dropping in human recordings with the same file names).
"""
import argparse, json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent

# phoneme-level pronunciation fixes
FIXES = {
    "hˈeɪzəp": "hˈazɒp",   # HAZOP: "HAZ-op", not "HAY-zop"
    "hˌeɪzəp": "hˌazɒp",
}


def trim(audio, sr, thresh=0.008, pad=0.05):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    return audio[max(idx[0] - int(pad * sr), 0): min(idx[-1] + int(pad * sr), len(audio))]


def tighten(audio, sr, max_gap=0.32, keep=0.26, thresh=0.006):
    """Shorten over-long internal pauses (TTS tends to over-pause at commas)."""
    win = int(0.01 * sr)
    n = len(audio) // win
    loud = np.array([np.max(np.abs(audio[i * win:(i + 1) * win])) > thresh for i in range(n)])
    out, i = [], 0
    while i < n:
        j = i
        while j < n and loud[j] == loud[i]:
            j += 1
        seg = audio[i * win:j * win]
        if not loud[i] and (j - i) * 0.01 > max_gap:
            k = int(keep * sr) // 2
            fade = np.linspace(1, 0, min(k, 200))
            a, b = seg[:k].copy(), seg[-k:].copy()
            a[-len(fade):] *= fade
            b[:len(fade)] *= fade[::-1]
            seg = np.concatenate([a, b])
        out.append(seg)
        i = j
    out.append(audio[n * win:])
    return np.concatenate(out)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--model", default="kokoro-v1.0.onnx")
    p.add_argument("--voices", default="voices-v1.0.bin")
    p.add_argument("--measure-only", action="store_true")
    args = p.parse_args()

    data = json.loads((ROOT / "src/data/narration.json").read_text())
    out = ROOT / "public/audio/vo"
    out.mkdir(parents=True, exist_ok=True)

    if not args.measure_only:
        from kokoro_onnx import Kokoro
        k = Kokoro(args.model, args.voices)
        for line in data["lines"]:
            ph = k.tokenizer.phonemize(line["say"], data["lang"])
            for a, b in FIXES.items():
                ph = ph.replace(a, b)
            audio, sr = k.create(ph, voice=data["voice"], speed=line["speed"], lang=data["lang"], is_phonemes=True)
            audio = tighten(trim(audio, sr), sr)
            audio = audio / (np.max(np.abs(audio)) or 1) * 0.89
            sf.write(out / f"{line['id']}.wav", audio, sr, subtype="PCM_16")
            print(f"{line['id']}: {len(audio) / sr:.2f}s  {ph[:70]}")

    durations = {}
    for line in data["lines"]:
        info = sf.info(out / f"{line['id']}.wav")
        durations[line["id"]] = round(info.frames / info.samplerate, 3)
    (ROOT / "src/data/vo-durations.json").write_text(json.dumps(durations, indent=2) + "\n")
    print("total speech:", round(sum(durations.values()), 1), "s")


if __name__ == "__main__":
    main()
