"""Generate the voice-over for one short with edge-tts (needs internet).

Usage: python scripts/generate-vo.py waze
Reads src/<id>/script.json, writes public/audio/<id>/vo/<shot>.mp3 and src/<id>/timings.json
(duration + word timings per shot) so captions and scene lengths follow the narration.
"""
import asyncio
import json
import os
import pathlib
import subprocess
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent


def tts_text(text, say):
    for k, v in say.items():
        text = text.replace(k, v)
    return text


GAP = 0.25  # silence between parts of one shot (seconds)


async def synth_part(text, mp3, voice, rate, pitch, say):
    words = []
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    comm = edge_tts.Communicate(tts_text(text, say), voice, rate=rate, pitch=pitch, boundary="WordBoundary", proxy=proxy)
    with open(mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"text": chunk["text"], "start": chunk["offset"] / 1e7, "end": (chunk["offset"] + chunk["duration"]) / 1e7})
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(mp3)]).decode().strip())
    return words, dur


async def synth(shot, cfg, out):
    """A shot is either one `vo` line (file <id>.mp3) or several `parts`, each with its own voice."""
    say = cfg.get("say", {})
    if "parts" not in shot:
        words, dur = await synth_part(shot.get("tts", shot["vo"]), out / f"{shot['id']}.mp3", cfg["voice"], cfg["rate"], cfg["pitch"], say)
        print(f"{shot['id']}: {len(words)} words, {dur:.2f}s")
        return {"duration": dur, "words": words}
    t = 0.0
    words, parts = [], []
    for k, p in enumerate(shot["parts"]):
        name = f"{shot['id']}-{k}.mp3"
        w, d = await synth_part(p["vo"], out / name, p.get("voice", cfg["voice"]), p.get("rate", cfg["rate"]), p.get("pitch", cfg["pitch"]), say)
        words += [{"text": x["text"], "start": x["start"] + t, "end": x["end"] + t} for x in w]
        parts.append({"file": name, "start": t, "duration": d})
        t += d + GAP
    total = t - GAP
    print(f"{shot['id']}: {len(words)} words in {len(parts)} parts, {total:.2f}s")
    return {"duration": total, "words": words, "parts": parts}


async def main():
    sid = sys.argv[1] if len(sys.argv) > 1 else "waze"
    cfg = json.loads((ROOT / f"src/{sid}/script.json").read_text(encoding="utf-8"))
    out = ROOT / f"public/audio/{sid}/vo"
    out.mkdir(parents=True, exist_ok=True)
    timings = {}
    for shot in cfg["shots"]:
        timings[shot["id"]] = await synth(shot, cfg, out)
    (ROOT / f"src/{sid}/timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=1), encoding="utf-8")


asyncio.run(main())
