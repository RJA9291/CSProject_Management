#!/usr/bin/env python3
"""Generate PWA icons: engineering-blue gradient + white factory silhouette.
Pure Python, no Pillow. Produces icon-180/192/512.png. Pair with icon.svg."""
import zlib, struct, os

OUT = "."
TOP = (0x2f, 0x8a, 0xc6)   # engineering blue top
BOT = (0x15, 0x5a, 0x8a)   # deeper blue bottom
INK = (255, 255, 255)      # factory silhouette

def in_factory(x, y, s):
    """x,y in 0..1 unit square. A sawtooth-roof factory with a chimney."""
    # body
    if 0.20 <= x <= 0.82 and 0.55 <= y <= 0.78:
        return True
    # chimney
    if 0.24 <= x <= 0.32 and 0.30 <= y <= 0.55:
        return True
    # three sawtooth roof teeth over the body (x 0.20..0.82), tooth width ~0.207
    if 0.44 <= y <= 0.55 and 0.20 <= x <= 0.82:
        tw = (0.82 - 0.20) / 3.0
        lx = (x - 0.20) % tw            # local x within a tooth
        # right-angled triangle: vertical rise on left, slope down to the right
        frac = lx / tw                  # 0..1 across the tooth
        top = 0.55 - (1.0 - frac) * 0.11
        if y >= top:
            return True
    return False

def make_icon(size, path):
    ss = 3
    raw = bytearray()
    for py in range(size):
        raw.append(0)
        t = py / (size - 1)
        bg = tuple(int(TOP[i] + (BOT[i]-TOP[i]) * t) for i in range(3))
        for px in range(size):
            hits = 0
            for sy in range(ss):
                for sx in range(ss):
                    ux = (px + (sx+0.5)/ss) / size
                    uy = (py + (sy+0.5)/ss) / size
                    if in_factory(ux, uy, size):
                        hits += 1
            a = hits / (ss*ss)
            if a <= 0:
                raw += bytes((bg[0], bg[1], bg[2], 255))
            else:
                raw += bytes(tuple(int(bg[i] + (INK[i]-bg[i]) * a) for i in range(3)) + (255,))

    def chunk(typ, data):
        return struct.pack(">I", len(data)) + typ + data + struct.pack(">I", zlib.crc32(typ + data) & 0xffffffff)
    png = (b'\x89PNG\r\n\x1a\n'
           + chunk(b'IHDR', struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
           + chunk(b'IEND', b''))
    with open(os.path.join(OUT, path), 'wb') as f:
        f.write(png)
    print(path, len(png), "bytes")

for s, p in [(180, 'icon-180.png'), (192, 'icon-192.png'), (512, 'icon-512.png')]:
    make_icon(s, p)
print("done")
