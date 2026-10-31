# Storyboard — implemented shot list

Frame numbers are at 30 fps. The source of truth is `src/data/timeline.json`, which the video, the score and the subtitles all read.

| Scene | Frames (time) | Shot | Key beats (frame) | Component |
|---|---|---|---|---|
| **1 Hook** | 0–264 (0:00–0:08.8) | Rim-lit silhouette by a rainy KL window → phone close-ups: feed scroll, shop "add to cart", bank transfer success, sharing IC/address in chat → red-lit phone in the dark | bass hit + glitch at 0, "CLICK." 20, cut on every narrated verb, "REALLY SAFE?" slam 224 | `scenes/Scene1Hook.tsx` |
| **2 Threat** | 264–516 (0:08.8–0:17.2) | Unknown-number scam message → incoming unknown call (vibrating) → tap on link → parcel + bank "verify" notifications → slow push-in on the "SAHKAN SEKARANG" phishing button → data burst | message 282, call 312, click 333, parcel 356, bank 376, heartbeat 396+, headline 420–459, **exposed** 488 | `scenes/Scene2Threat.tsx` |
| **3 Reality check** | 516–1026 (0:17.2–0:34.2) | Malaysia map draws in, incident points and attack arcs, the map turns red; stats stack below | map 520, **28,698** counter 564, source 600, **RM715 MILLION** 700, **21–30** age bars 878 | `scenes/Scene3Reality.tsx` |
| **4 Cybersecurity** | 1000–1440 (0:33.3–0:48) | Circular blue wipe from red to blue → rotating 3D node network → **CYBERSECURITY** title → shield and lock → four pillars | wipe 1000, title 1098, shield 1202, IDENTITY 1238, DATA 1278, MONEY 1310, DIGITAL LIFE 1350 | `scenes/Scene4Intro.tsx` |
| **5 Cliffhanger** | 1410–1770 (0:47–0:59) | Fade to black, heartbeat ECG line goes from blue to red → "ARE YOU REALLY PROTECTED?" decodes → title card | question 1515, **title boom** 1582, READY 1636, COMING SOON 1686, glitch-out 1734, silence 1746–1770 | `scenes/Scene5Cliffhanger.tsx` |

Global layers (`src/Video.tsx`): bilingual subtitles, film grain, vignette, ducked music bed, 18 VO clips, about 65 timed SFX (`src/data/audioCues.ts`).
