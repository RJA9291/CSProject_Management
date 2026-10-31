"""Pre-renders film-grain tiles (much cheaper than per-frame SVG turbulence).
Usage: python scripts/generate_grain.py  ->  public/images/grain/grain_0..7.png"""
from pathlib import Path
import numpy as np
from PIL import Image

out = Path(__file__).resolve().parent.parent / "public/images/grain"
out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(3)
for i in range(8):
    g = rng.normal(128, 38, (960, 540)).clip(0, 255).astype(np.uint8)
    Image.fromarray(g, "L").save(out / f"grain_{i}.png", optimize=True)
print("ok")
