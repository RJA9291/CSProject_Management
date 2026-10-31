# Asset Checklist — Cybersecurity Teaser 01

This build works on its own. Every shot is real-time motion graphics: fictional phone UIs, a KL skyline,
a rim-lit silhouette, the Malaysia map, the shield network and the type. The audio is synthesised and the
narration comes from local TTS, so the MP4 contains **no third-party footage or music**.

The items below are **optional upgrades** that make the piece more cinematic. Each one lists its file path,
the slot it fills and a generation prompt you can use with an AI video or image tool, or as a brief for a stock search or a shoot.

## Status legend
- ✅ in the project, used in the render
- ⬜ optional, not supplied yet (the motion-graphics fallback is used)

## Audio
| Status | File | Notes |
|---|---|---|
| ✅ | `public/audio/vo/*.wav` (18 clips) | Temp narration (Kokoro TTS). Replace with a Malaysian voice actor for release; see VOICEOVER_SCRIPT.md |
| ✅ | `public/audio/music/score.wav` | Original procedural score (`scripts/generate_audio.py`). Follows the scene timing |
| ✅ | `public/audio/sfx/*.wav` (19 files) | Original procedural SFX: glitch, notification, heartbeat, impacts, whooshes, riser, vibrate, click, ticks |
| ⬜ | licensed music track | If you swap in a licensed track, keep it around -18 LUFS before mixing. The narration ducking is automatic |

## Fonts (SIL Open Font License)
| Status | File |
|---|---|
| ✅ | `public/fonts/bebas-neue-latin-400-normal.woff2`: display titles |
| ✅ | `public/fonts/inter-latin-{400,600,800}-normal.woff2`: UI and subtitles |
| ✅ | `public/fonts/jetbrains-mono-latin-{400,700}-normal.woff2`: data labels |

## Data / graphics
| Status | Item | Source |
|---|---|---|
| ✅ | Malaysia map outline | Natural Earth 1:50m (public domain), baked by `scripts/build-map.mjs` |
| ✅ | Statistics | PDRM CCID, Jan–Nov 2025 (see VOICEOVER_SCRIPT.md) |

## Optional live-action / AI footage

Drop the file into `public/videos/` and set the matching path in `src/data/content.ts → footage`.
The scene then uses `<OffthreadVideo>` in place of the built-in graphics and grades it to match.

### V01: Hero scrolling at night (Scene 1, 0:00–0:01.5) → `footage.heroScrolling`
- **Spec:** 1080×1920 or larger, 30 fps, ≥ 3 s, no audio needed
- **Prompt:** *Cinematic vertical 9:16 close-up of a Malaysian young professional in their late 20s, office attire, sitting by a
  condo window at night in Kuala Lumpur. The face is lit only by a smartphone screen in cool blue light, Petronas Twin Towers
  softly out of focus in the background, light rain on the glass, deep navy and black palette, shallow depth of field,
  anamorphic bokeh, slow push-in, 35mm film look, moody tech-thriller atmosphere, no text, no logos.*

### V02: Thumb hovering over a button (Scene 2, 0:13–0:16, slow motion) → `footage.hesitationCloseUp`
- **Spec:** 1080×1920, ideally 60 fps so it can be slowed to 0.6×, ≥ 4 s
- **Prompt:** *Extreme macro close-up, vertical 9:16, of a thumb hesitating just above a smartphone screen in a dark room. The screen
  shows a blurred, glowing red button. Red warning light reflects on the skin, a shallow focal plane on the thumb tip,
  slow motion, dramatic suspense lighting, dark navy background, no readable text, no brand logos.*

### V03 (optional B-roll): Malaysian office at night
- **Prompt:** *Vertical 9:16 cinematic shot of a modern open-plan office in Kuala Lumpur after hours, rows of monitors glowing
  blue, one young Malaysian employee checking a phone, city skyline through floor-to-ceiling windows, cool blue and teal
  grade with subtle red accent light, slow dolly, no logos.*

### V04 (optional B-roll): Pasar malam / e-wallet payment
- **Prompt:** *Vertical 9:16 close-up of a hand scanning a QR code with a phone at a Malaysian night market stall, warm bokeh
  lights, shallow depth of field, cinematic, generic QR code, no real brand names or logos.*

### I01 (optional): Thumbnail / poster still
- **Prompt:** *Vertical poster, dark navy background. A smartphone lies face-up and emits a red glow, with glitch artefacts and
  faint data particles rising from it. Large empty space at the top for the title "CYBERSECURITY". Cinematic, premium
  corporate look, no logos.*
- Alternative: export a frame from the video with `npx remotion still src/index.ts CyberTeaser01 output/thumbnail.png --frame=1700`.

## Compliance notes
- All app names (KedaiKu, BankKita, ParcelGo MY), people and phone numbers are fictional. Personal data is masked (•••).
- Every link shown is defanged (`hxxp`, `[.]`) and uses the reserved `.example` domain, so none of them can be followed.
- The UI is styled as "a messaging app", "a bank app" and so on. No real logos, trademarks or brand colours are copied.
- Footage you add must be owned, licensed, or AI-generated under terms that allow commercial use.
