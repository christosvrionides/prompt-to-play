# Build log

Record observable actions and concise summaries. Do not record private chain-of-thought, credentials or secrets.

| | |
| --- | --- |
| **Team** | Pop Stars |
| **Game** | GTA7: Pipeline Panic |
| **Folder** | `games/pop-stars-gta7/` |
| **Model** | GPT-6 Luna (`gpt-6-luna`) |

## Major actions

| Time | Action | Result |
| --- | --- | --- |
| 2026-11-16 | Created the team submission branch and a dependency-free HTML Canvas game. | Added keyboard co-op platforming, the Richard roster, laptop sprites, Azure pipes, AGB enemies, checkpoints, collectibles, and the ship gate. |
| 2026-11-16 | Added setup documentation and local-only ignore rules. | The game opens directly in a modern browser without installing packages or using an online service. |
| 2026-11-16 | Added separate welcome and character-selection screens, clearer power-up feedback, local results and leaderboard, retry flow, and original synthesized chase music. | Verified the intro, picker, game, pause, music toggle, and mobile layouts in a browser. Updated AGB drawing to face its travel direction. |
| 2026-11-16 | Expanded the game into a five-stage campaign and added direct character menus for Junaid, Tariq, Christos, and Hannah. | Connected Discovery documents, Alpha release keys, forest spotlights, Public Beta lasers, and the HLD-versus-AGB boss to stage progression. Added visible VM badges and Hannah's moving guide dog. Checked JavaScript syntax and simulated stage exits, boss victory, and run-ending death; no browser test was run for this update. |

## Key prompts

| Time | Prompt summary | Outcome |
| --- | --- | --- |
| 2026-11-16 | Build a web-based two-player keyboard platform game with Richards, laptops, Azure pipelines, VM, MacBook, AI flight, and an AGB enemy. | Implemented as an original co-op game with three character choices and shared-screen play. |
| 2026-11-16 | Clarify power-ups, add onboarding, character selection, a named leaderboard and retry, fix AGB facing, and add music. | Added local-only top-five scores and a toggleable original chase loop. |
| 2026-11-16 | Add Discovery, Alpha, Private Beta, Public Beta, and an HLD-versus-AGB finale; include named character choices and clearer objectives. | Added the five-stage campaign, stage-specific hazards and goals, named roster entries, VM visuals, Hannah's guide dog, and corrected campaign completion flow. |

## External sources

| URL | What it was used for |
| --- | --- |
| None | No external pages or tutorials were used. |

## Reused components and assets

| Component or asset | Source URL | Licence | How it is used |
| --- | --- | --- | --- |
| Web Audio API and Canvas 2D | https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API ; https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API | Browser web standards; no bundled assets | Synthesized original chase music and draw all game visuals locally. |

## Important fixes

| Problem | Fix |
| --- | --- |
| The character picker was taller than the game window on narrow screens. | Tightened the title and roster layout and hid secondary intro text on small screens; checked the picker at 390px wide. |
| Ordinary stage exits showed the final results screen before the campaign was complete. | Made normal exits advance to the next stage; reserve results for defeating the final boss or ending the run after lost retries. |
