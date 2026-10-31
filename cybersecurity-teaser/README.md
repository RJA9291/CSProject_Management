# Cybersecurity Teaser 01: "Are You Really Safe?"

A 59-second vertical (1080×1920, 30 fps) cinematic teaser for a Malaysian cybersecurity awareness series,
aimed at young working adults aged 25–30. It is built entirely in code with **React + Remotion + TypeScript**,
rendered with Remotion and mastered with **FFmpeg**.

**Final video:** [`output/cybersecurity_teaser_01.mp4`](output/cybersecurity_teaser_01.mp4)

| Deliverable | Location |
|---|---|
| Final MP4 (H.264, AAC 320k, -14 LUFS) | `output/cybersecurity_teaser_01.mp4` |
| Subtitles (.srt): bilingual / EN / BM | `output/cybersecurity_teaser_01.srt`, `.en.srt`, `.ms.srt` |
| Editable Remotion project | `src/` |
| Voice-over script and statistic sources | `docs/VOICEOVER_SCRIPT.md` |
| Asset checklist and AI generation prompts | `docs/ASSET_CHECKLIST.md` |
| Implemented storyboard / shot list | `docs/STORYBOARD.md` |

## Story (5 scenes)

1. **Hook (0:00–0:09):** a rim-lit silhouette by a rainy KL window, then quick cuts of the phone: scroll, shop, transfer, share. Ends on *BUT… ARE YOU REALLY SAFE?*
2. **Threat (0:09–0:17):** a scam message, an unknown call, one click, fake parcel and bank-verification notifications, a slow-motion hesitation over *SAHKAN SEKARANG*, then *DATA EXPOSED*.
3. **Malaysian reality check (0:17–0:34):** an animated Malaysia map, **28,698** telecommunication crime cases, **RM715 million** in losses, and the **21–30** age group with the most victims (PDRM, Jan–Nov 2025, with the source on screen).
4. **Cybersecurity (0:33–0:48):** a red-to-blue wipe, a 3D node network, the **CYBERSECURITY** title, a shield, then *YOUR IDENTITY / DATA / MONEY / DIGITAL LIFE*.
5. **Cliffhanger (0:47–0:59):** a heartbeat in the dark, *ARE YOU REALLY PROTECTED?*, then the title card *CYBERSECURITY · ARE YOU READY? · COMING SOON.* and silence.

## Requirements

- Node.js 18+ (tested with 22), FFmpeg
- Optional, only to regenerate audio: Python 3.10+, `pip install numpy scipy soundfile kokoro-onnx` and `espeak-ng` (`apt install espeak-ng`)

```bash
cd cybersecurity-teaser
npm install
```

## Render

```bash
npm run build        # = npm run render && npm run master
```

- `npm run render`: Remotion renders `output/render_raw.mp4` (H.264, CRF 16)
- `npm run master`: FFmpeg runs two-pass loudness normalisation to -14 LUFS / -1.5 dBTP, then writes `output/cybersecurity_teaser_01.mp4` with faststart
- `npx remotion render src/index.ts CyberTeaser01-NoSubs output/no_subs.mp4` renders a clean version without burned-in subtitles
- `npx remotion still src/index.ts CyberTeaser01 output/thumbnail.png --frame=1700` exports a thumbnail

If Remotion cannot download its own headless Chrome (offline or locked-down networks), point it at a local one:

```bash
export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell
```

On a 4-core machine with no GPU, the full render takes about 10 minutes.

## Edit

```bash
npm run studio       # live preview, timeline and props editor at http://localhost:3000
```

| To change… | Edit |
|---|---|
| Any on-screen text (words, scam messages, stats, title card) | `src/data/content.ts`, or the props panel in Studio |
| Timing of the narration, scene boundaries and visual beats | `src/data/timeline.json` (video, score and subtitles all read it) |
| Narration text and subtitles / translations | `src/data/narration.json` → then `npm run srt` |
| Sound-effect placement and levels | `src/data/audioCues.ts` |
| Music / narration / SFX balance | `musicVolume`, `voVolume`, `sfxVolume` props in `src/Root.tsx` |
| Colours, fonts, mobile safe zone | `src/theme.ts` |
| Add real footage | put the file in `public/videos/`, set `footage.*` in `content.ts` (see `docs/ASSET_CHECKLIST.md`) |

After changing `timeline.json`, regenerate the score so it stays in sync:

```bash
python scripts/generate_audio.py     # music bed + SFX (procedural, royalty-free)
npm run srt                          # subtitles
```

### Replacing the narration

The narration is a temp track made with local neural TTS (Kokoro, `am_michael`). The Bahasa Melayu lines go through
espeak-ng's Malay phonemiser. To use a voice actor, record each line to `public/audio/vo/<id>.wav`, then run
`python scripts/generate_vo.py --measure-only` and adjust `timeline.json` if a take runs longer.
To regenerate the TTS:

```bash
# model files: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
PHONEMIZER_ESPEAK_LIBRARY=/usr/lib/x86_64-linux-gnu/libespeak-ng.so.1 \
  python scripts/generate_vo.py --model kokoro-v1.0.onnx --voices voices-v1.0.bin
```

## Project structure

```
cybersecurity-teaser/
├── public/
│   ├── audio/{vo,music,sfx}/   narration clips, score, sound effects (all generated, royalty-free)
│   ├── fonts/                  Bebas Neue, Inter, JetBrains Mono (OFL)
│   ├── images/grain/           film-grain tiles
│   └── videos/                 optional real / AI footage (see asset checklist)
├── src/
│   ├── index.ts, Root.tsx      Remotion entry + compositions (with / without subtitles)
│   ├── Video.tsx               scene sequencing, subtitles, grain, audio mix with ducking
│   ├── scenes/                 Scene1Hook … Scene5Cliffhanger (one component per scene)
│   ├── components/             Phone, fictional app screens, MalaysiaMap, Glitch, Camera,
│   │                           KineticText, ShieldNetwork, Particles, City, Subtitles, Effects
│   ├── data/                   content.ts, timeline.json, narration.json, audioCues.ts
│   └── assets/malaysiaMap.ts   baked Natural Earth outline
├── scripts/                    generate_vo.py, generate_audio.py, generate_grain.py,
│                               build-map.mjs, build-srt.mjs, master.sh, stills.mjs
├── docs/                       voice-over script, asset checklist, storyboard
└── output/                     final MP4 + SRT files
```

## Quality checklist (done for this render)

- [x] Statistics checked against PDRM CCID figures reported December 2025, and labelled as *telecommunication crime*, not all cybercrime
- [x] Source citation on screen during the statistics
- [x] Spelling and grammar checked (EN and BM)
- [x] Subtitles generated from the same timing data as the audio
- [x] Music ducks about 8 dB under narration; final mix normalised to -14 LUFS
- [x] Text kept inside a mobile safe zone (TikTok / Reels / Shorts UI)
- [x] The opening 3 seconds have a bass hit, a glitch reveal and kinetic type on frame 0
- [x] No real brands, personal data or working links; all fictional, masked and defanged

## Licensing

- Remotion is free for individuals and small companies. Larger organisations need a
  [company licence](https://www.remotion.dev/license) to use it commercially.
- Fonts: SIL Open Font License. Map: Natural Earth (public domain).
- Music, SFX and grain are generated procedurally by the scripts in this repo.
  The narration is generated with Kokoro (Apache-2.0 weights).
