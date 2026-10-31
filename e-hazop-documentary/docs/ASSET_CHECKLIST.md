# Asset checklist and limitations

## What is in the video
| Asset | Status | Source |
|---|---|---|
| Substation, transmission lines, transformers, switchgear, control room | ✅ illustrated motion graphics (SVG) | built in `src/components/Substation.tsx` and `Equipment.tsx` |
| Engineers in PPE, team review meeting | ✅ illustrated | `src/components/People.tsx` |
| Single-line diagram, workflow, guideword matrix, hazard register, voltage trend | ✅ animated technical graphics | `src/components/Diagrams.tsx` |
| British English narration (34 clips) | ✅ neural TTS temp track | Kokoro (`bm_george`, en-gb), `scripts/generate_vo.py` |
| Music bed and SFX (hum, relay click, alarm beep, arcing crackle, whooshes) | ✅ original, procedural | `scripts/generate_audio.py` |
| Fonts | ✅ Inter, JetBrains Mono (SIL OFL) | `public/fonts/` |

## Limitations
- **No live-action footage.** This environment could not reach any stock footage library or AI video generator, so every
  "footage" shot is an illustrated, cinematic motion graphic. None of it shows a real site or a real incident.
  The transformer example is labelled **ILLUSTRATIVE SCENARIO · NOT A RECORDED INCIDENT** on screen.
- **Narration is synthetic.** It is a natural-sounding British English neural voice, not a human recording. For a
  personal assignment, the student may prefer to record their own voice. See "Replacing the narration" in the README.
- **Reference pages could not be opened** from this environment (the sites were unreachable). Titles and URLs are as
  supplied in the brief. The technical content was cross-checked by web search: the IEC 61882:2016 edition, E-HAZOP guidewords
  (over, under, spike, dip, fault, blackout), and SAFAN/SYSOP/OPTAN as one provider's study structure.

## Optional upgrades (live-action / AI B-roll)
Each item can replace or sit behind an illustrated shot. Use only footage you own, have licensed, or generated under terms that allow use.

| # | Shot | Replaces | Suggested prompt / brief |
|---|---|---|---|
| V1 | Aerial drone over a high-voltage substation at dusk | Scene 2 opening, Scene 7 | *Slow cinematic drone shot over an outdoor high-voltage substation at blue hour, rows of transformers and gantries, transmission lines leading away, deep navy and steel-blue grade, light haze, 16:9, no logos.* |
| V2 | Power transformer close-up | Scene 2, Scene 5 | *Slow dolly past a large oil-filled power transformer in a substation at night, porcelain bushings and radiator fins lit by floodlights, cool blue grade, shallow depth of field, 16:9.* |
| V3 | MV switchgear with a protection relay alarm | Scene 2, Scene 5 | *Close-up of medium-voltage switchgear panels in an electrical room, a protection relay display showing an alarm and an amber indicator lamp blinking, industrial blue lighting, 16:9, no brand names.* |
| V4 | Engineers reviewing an SLD | Scene 4 | *Multidisciplinary engineering team around a meeting table reviewing a printed electrical single-line diagram, pointing at a transformer section, modern office, natural documentary style, 16:9.* |
| V5 | Engineers in PPE inspecting equipment | Scene 6 | *Two electrical engineers in hard hats, safety glasses and hi-vis vests inspecting a substation transformer with a tablet, golden-hour rim light, 16:9.* |
