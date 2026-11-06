"""Generate Malay voice-over per scene with edge-tts (needs internet).

Usage: python scripts/generate-voiceover.py --script scripts/script-ep02.json [--voice ms-MY-YasminNeural] [--rate +6%] [--only 4]
The script JSON (from scripts/export-script.mjs) names the output folder and timings file.
Writes <voDir>/sceneNN.mp3 + sceneNN.words.json, then collects all word timings into <timingsPath>.
"""
import argparse
import asyncio
import json
import os
import pathlib

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent


async def synth(item, out, voice, rate, pitch):
    n = item["scene"]
    mp3 = out / f"scene{n:02d}.mp3"
    words = []
    # Uses the HTTPS proxy when one is configured (e.g. cloud sessions); none on a normal laptop.
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    comm = edge_tts.Communicate(item["tts"], voice, rate=rate, pitch=pitch, boundary="WordBoundary", proxy=proxy)
    with open(mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "start": chunk["offset"] / 1e7,
                    "end": (chunk["offset"] + chunk["duration"]) / 1e7,
                })
    (out / f"scene{n:02d}.words.json").write_text(json.dumps({"text": item["vo"], "words": words}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"scene{n:02d}: {len(words)} words, ends {words[-1]['end'] if words else 0:.2f}s")


def write_timings(out, timings_path):
    """Collects every sceneNN.words.json into the episode's vo-timings.json for the video code."""
    timings = {}
    for f in sorted(out.glob("scene*.words.json")):
        n = int(f.name[5:7])
        timings[str(n)] = json.loads(f.read_text(encoding="utf-8"))["words"]
    (ROOT / timings_path).write_text(json.dumps(timings, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Wrote word timings for {len(timings)} scenes to {timings_path}")


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", default="scripts/script-ep01.json")
    ap.add_argument("--voice", default="ms-MY-OsmanNeural")
    ap.add_argument("--rate", default="+6%")
    ap.add_argument("--pitch", default="+2Hz")
    ap.add_argument("--only", type=int)
    ap.add_argument("--timings-only", action="store_true")
    a = ap.parse_args()
    script = json.loads((ROOT / a.script).read_text(encoding="utf-8"))
    out = ROOT / script["voDir"]
    out.mkdir(parents=True, exist_ok=True)
    if not a.timings_only:
        for item in script["lines"]:
            if a.only and item["scene"] != a.only:
                continue
            await synth(item, out, a.voice, a.rate, a.pitch)
    write_timings(out, script["timingsPath"])


asyncio.run(main())
