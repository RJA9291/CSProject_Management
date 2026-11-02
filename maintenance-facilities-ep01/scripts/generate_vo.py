"""Temporary Bahasa Melayu voice-over with Kokoro (local neural TTS, Apache-2.0 weights).

Malay text is phonemised with espeak-ng's Malay rules; text inside {braces} is phonemised as
English (en-gb), so terms like "Department" or "work order" sound the way they are said in
Malaysian workplaces. Writes public/audio/vo/<id>.wav and src/data/vo-durations.json.

To swap in a human recording, drop WAVs with the same names into public/audio/vo/ and run
with --measure-only.

Usage:
  PHONEMIZER_ESPEAK_LIBRARY=/usr/lib/x86_64-linux-gnu/libespeak-ng.so.1 \
  python scripts/generate_vo.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin
"""
import argparse, json, re
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent


def trim(a, sr, thresh=0.008, pad=0.05):
    idx = np.where(np.abs(a) > thresh)[0]
    if len(idx) == 0:
        return a
    return a[max(idx[0] - int(pad * sr), 0): min(idx[-1] + int(pad * sr), len(a))]


def phonemes(tok, text):
    parts = re.split(r"(\{[^}]*\})", text)
    out = []
    for p in parts:
        if not p.strip():
            continue
        if p.startswith("{"):
            out.append(tok.phonemize(p[1:-1], "en-gb"))
        else:
            out.append(tok.phonemize(p, "ms"))
    return " ".join(s.strip() for s in out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", default="kokoro-v1.0.onnx")
    ap.add_argument("--voices", default="voices-v1.0.bin")
    ap.add_argument("--measure-only", action="store_true")
    ap.add_argument("--ep", default="", help="episode folder, e.g. ep02 (data in src/data/ep02, audio in public/audio/ep02/vo)")
    args = ap.parse_args()
    ddir = ROOT / "src/data" / args.ep if args.ep else ROOT / "src/data"
    data = json.loads((ddir / "narration.json").read_text())
    out = ROOT / "public/audio" / args.ep / "vo" if args.ep else ROOT / "public/audio/vo"
    out.mkdir(parents=True, exist_ok=True)
    if not args.measure_only:
        from kokoro_onnx import Kokoro
        k = Kokoro(args.model, args.voices)
        for line in data["lines"]:
            ph = phonemes(k.tokenizer, line["say"])
            audio, sr = k.create(ph, voice=data["voice"], speed=line["speed"], lang="en-us", is_phonemes=True)
            audio = trim(audio, sr)
            audio = audio / (np.max(np.abs(audio)) or 1) * 0.89
            sf.write(out / f"{line['id']}.wav", audio, sr, subtype="PCM_16")
            print(f"{line['id']}: {len(audio) / sr:.2f}s")
    dur = {}
    for line in data["lines"]:
        info = sf.info(out / f"{line['id']}.wav")
        dur[line["id"]] = round(info.frames / info.samplerate, 3)
    (ddir / "vo-durations.json").write_text(json.dumps(dur, indent=2) + "\n")


if __name__ == "__main__":
    main()
