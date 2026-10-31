"""Generate narration clips with Kokoro (local neural TTS, Apache-2.0 weights).

Usage:
  python scripts/generate_vo.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin

English lines use the en-us phonemiser; Bahasa Melayu lines are phonemised with
espeak-ng's Malay ("ms") rules and voiced by the same speaker so the narrator
stays consistent. Writes public/audio/vo/<id>.wav and src/data/vo-durations.json.

To use a human voice-over instead, drop recordings with the same file names into
public/audio/vo/ and re-run with --measure-only to refresh durations.
"""
import argparse, json, os, subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
LANG = {"en": "en-us", "ms": "ms"}


def trim(audio, sr, thresh=0.01, pad=0.04):
    idx = np.where(np.abs(audio) > thresh)[0]
    if len(idx) == 0:
        return audio
    a = max(idx[0] - int(pad * sr), 0)
    b = min(idx[-1] + int(pad * sr), len(audio))
    return audio[a:b]


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--model", default="kokoro-v1.0.onnx")
    p.add_argument("--voices", default="voices-v1.0.bin")
    p.add_argument("--measure-only", action="store_true")
    args = p.parse_args()

    data = json.loads((ROOT / "src/data/narration.json").read_text())
    out_dir = ROOT / "public/audio/vo"
    out_dir.mkdir(parents=True, exist_ok=True)

    if not args.measure_only:
        from kokoro_onnx import Kokoro
        k = Kokoro(args.model, args.voices)
        for line in data["lines"]:
            audio, sr = k.create(line["say"], voice=line.get("voice", data["voice"]),
                                 speed=line["speed"], lang=LANG[line["lang"]])
            audio = trim(audio, sr)
            peak = np.max(np.abs(audio)) or 1.0
            audio = audio / peak * 0.89  # -1 dBFS peak; final loudness set in master.sh
            sf.write(out_dir / f"{line['id']}.wav", audio, sr, subtype="PCM_16")
            print(f"{line['id']}: {len(audio)/sr:.2f}s")

    durations = {}
    for line in data["lines"]:
        info = sf.info(out_dir / f"{line['id']}.wav")
        durations[line["id"]] = round(info.frames / info.samplerate, 3)
    (ROOT / "src/data/vo-durations.json").write_text(json.dumps(durations, indent=2) + "\n")


if __name__ == "__main__":
    main()
