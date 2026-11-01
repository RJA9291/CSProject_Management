# Di Sebalik Operasi Kilang · Ep 01: Mengenali Department Maintenance & Facilities

Dokumentari animasi 3D sinematik (1920 × 1080, 2:30, Bahasa Melayu) untuk onboarding pekerja baharu.
Dibina dengan **Remotion + Three.js (react-three-fiber)**.

**Status: FASA 1 – PRE-PRODUCTION, menunggu semakan.** Lihat [`docs/PRE_PRODUCTION.md`](docs/PRE_PRODUCTION.md).

| Folder / fail | Kandungan |
|---|---|
| `docs/PRE_PRODUCTION.md` | Analisis konsep, storyboard 8 scene, character sheet, environment, visual direction, perkara untuk disahkan |
| `docs/preproduction/*.png` | Render 3D rujukan (watak dan persekitaran) |
| `src/characters/specs.ts` | **Character bible**: sumber tunggal rupa setiap watak (konsistensi) |
| `src/characters/Character.tsx` | Model watak 3D |
| `src/environment/Factory.tsx` | Kilang automotif 3D (production line, robot, DB, workshop) |
| `src/Lookdev.tsx` | Komposisi rujukan (character sheet, environment) |

Render semula rujukan:
```bash
npm install
export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell   # jika perlu
npx remotion still src/index.ts CharacterSheet docs/preproduction/01_character_sheet.png
npx remotion studio src/index.ts   # pratonton interaktif
```
WebGL tanpa GPU memerlukan renderer `swangle` (sudah ditetapkan dalam `remotion.config.ts`).
