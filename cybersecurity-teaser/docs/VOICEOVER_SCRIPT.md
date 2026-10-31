# Voice-over Script — Cybersecurity Teaser 01

**Runtime:** 59 s · **Narrator:** mature, confident documentary voice · **Languages:** Malaysian English + Bahasa Melayu (Scene 3)

Timecodes are when each line starts in the final video (30 fps). `[pause]` marks a held beat. **Bold** words get emphasis.
Numbers in Scene 3 are written out the way they should be spoken.

| # | Time | Scene | Line (spoken) | Direction |
|---|------|-------|---------------|-----------|
| 1 | 00:00.2 | 1 Hook | Every day, we **click**. | Calm and close, almost intimate. |
| 2 | 00:01.5 | 1 Hook | We **scroll**. | Same rhythm, one word per cut. |
| 3 | 00:02.5 | 1 Hook | We **shop**. | |
| 4 | 00:03.4 | 1 Hook | We **transfer money**. | |
| 5 | 00:04.7 | 1 Hook | We share our **personal information**. | Slightly slower. |
| 6 | 00:07.1 | 1 Hook | But… [pause] are we really **safe**? | Drop the pitch. Leave "safe" hanging. |
| 7 | 00:09.4 | 2 Threat | **One message.** [beat] **One call.** [beat] **One click.** | Staccato, rising tension. |
| 8 | 00:13.2 | 2 Threat | And maybe… [pause] all your personal information is **exposed**. | Near-whisper, then hit "exposed". |
| 9 | 00:17.8 | 3 Reality | Di Malaysia, *dua puluh lapan ribu enam ratus sembilan puluh lapan* kes jenayah telekomunikasi direkodkan dari Januari hingga November *dua ribu dua puluh lima*. | Serious news-documentary tone. Stress the number. |
| 10 | 00:28.7 | 3 Reality | Dan golongan *dua puluh satu hingga tiga puluh tahun* mencatat jumlah mangsa **tertinggi**. | Slow down on the age group. |
| 11 | 00:35.0 | 4 Intro | Welcome to the world of **CYBERSECURITY**. | Open up, warmer, more confident. |
| 12 | 00:38.0 | 4 Intro | It's not just about hackers. | |
| 13 | 00:40.3 | 4 Intro | It's about protecting your **identity**, | One idea per breath; each one lands with a pillar on screen. |
| 14 | 00:42.5 | 4 Intro | your **data**, | |
| 15 | 00:43.6 | 4 Intro | your **money**… | |
| 16 | 00:44.7 | 4 Intro | and your **digital life**. | Resolve. |
| 17 | 00:48.0 | 5 Cliffhanger | So, here's the question… | Quiet, over heartbeat. |
| 18 | 00:50.5 | 5 Cliffhanger | Are you really **protected**? | Slow, direct to camera. Then silence. |

## Subtitles

Burned in (bilingual: spoken line + translation) and exported as:

- `output/cybersecurity_teaser_01.srt` — bilingual, matches the video
- `output/cybersecurity_teaser_01.en.srt` — English only
- `output/cybersecurity_teaser_01.ms.srt` — Bahasa Melayu only

| # | Spoken / on-screen | Translation |
|---|--------------------|-------------|
| 1 | Every day, we click. | Setiap hari, kita klik. |
| 2 | We scroll. | Kita skrol. |
| 3 | We shop. | Kita membeli-belah. |
| 4 | We transfer money. | Kita pindahkan wang. |
| 5 | We share our personal information. | Kita kongsi maklumat peribadi. |
| 6 | But… are we really safe? | Tapi… adakah kita benar-benar selamat? |
| 7 | One message. One call. One click. | Satu mesej. Satu panggilan. Satu klik. |
| 8 | And maybe… all your personal information is exposed. | Dan mungkin… semua maklumat peribadi anda terdedah. |
| 9 | Di Malaysia, 28,698 kes jenayah telekomunikasi direkodkan dari Januari hingga November 2025. | In Malaysia, 28,698 telecommunication crime cases were recorded from January to November 2025. |
| 10 | Dan golongan 21 hingga 30 tahun mencatat jumlah mangsa tertinggi. | And those aged 21 to 30 recorded the highest number of victims. |
| 11 | Welcome to the world of CYBERSECURITY. | Selamat datang ke dunia keselamatan siber. |
| 12 | It's not just about hackers. | Ia bukan sekadar tentang penggodam. |
| 13–16 | It's about protecting your identity, your data, your money… and your digital life. | Ia tentang melindungi identiti, data, wang… dan kehidupan digital anda. |
| 17 | So, here's the question… | Jadi, persoalannya… |
| 18 | Are you really PROTECTED? | Adakah anda benar-benar dilindungi? |

## About the current narration

The narration in this build is synthetic: Kokoro, an open-weight neural TTS (Apache-2.0), voice `am_michael`.
The Bahasa Melayu lines go through espeak-ng's Malay phonemiser so the same narrator speaks both languages.
That makes it a solid **temp track**. For the campaign release, record a Malaysian voice actor:

1. Record each line as its own WAV (48 kHz, mono, ~-3 dBFS peaks, no music) and name it like the existing files
   (`public/audio/vo/s1_1.wav` … `s5_2.wav`).
2. Run `python scripts/generate_vo.py --measure-only` to refresh the durations.
3. If a take is longer than the current clip, move that line's start in `src/data/timeline.json` (`vo`) and re-run `npm run srt`.

## Statistics: source and accuracy

- **28,698** telecommunication crime cases, **RM715 million** (RM715.7 juta) in losses, January–November 2025.
  Source: Royal Malaysia Police (PDRM), Bukit Aman Commercial Crime Investigation Department (JSJK/CCID), reported December 2025.
- Victims aged **21–30**: **8,789** (highest). Aged **31–40**: **6,825** (second highest).
- These figures cover **reported telecommunication crime only**. They are not all cybercrime (total online crime
  over the same period was 67,735 cases and more than RM2.7 billion in losses). The video says so on screen.
- Press coverage: The Star (21–22 Dec 2025), Bernama, Sinar Harian, Berita Harian.
