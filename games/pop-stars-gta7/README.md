# GTA7: Pipeline Panic

| | |
| --- | --- |
| **Team** | Pop Stars |
| **Folder** | `games/pop-stars-gta7/` |

GTA7: Pipeline Panic is an original two-player co-op platform game. Follow the opening instructions, choose two of the three Richards, collect all three release keys, then get both runners to the exit while dodging Azure pipeline pipes and angry green birds (AGB). Each Richard always carries two laptops.

## How to play

- **Goal:** Collect all three golden release keys and bring both runners to the SHIP gate. Each runner has three retries; losing all retries on either runner ends the build.
- **Player 1:** `A` and `D` to move, `W` to jump. In the character picker, `Q` and `E` cycle through the Richards.
- **Player 2:** Left and Right arrows to move, Up arrow to jump. In the character picker, `,` and `.` cycle through the Richards.
- **Power-ups:** The pickup banner and player HUD name the effect and show its remaining time. `VM` (Power Apps) slows you, `MB` (MacBook) speeds you up, and `AI` lets you fly while you hold the jump key.
- **Other controls:** Follow the opening screen, then press `Enter` to choose runners and start. `P` or `Esc` pauses; `R` restarts; `M` toggles the original chase music.
- **Leaderboard:** At the end of a run, enter a name to save the score to this browser's local top-five leaderboard. Choose **Retry Run** to play again.
- **Time to play:** A short run takes about 3-6 minutes, depending on how often the AGB catches the team. The finish gate is the run's milestone.

## Setup

No installation or dependencies are required. Use a current desktop browser such as Chrome, Edge, or Firefox. Both players need a physical keyboard with the letter and arrow keys. Music starts after you begin the game so the browser can allow audio playback.

## Launch

Open `index.html` in a browser. The game runs locally in the page and does not need a server.

## External services

None. The game has no backend, external assets, or environment variables. Music is synthesized locally with the Web Audio API; scores are stored in the browser's local storage.

| Variable | What it is for | Placeholder |
| --- | --- | --- |
| None | No environment variables are used. | None |

## Known issues

- The leaderboard is local to one browser and device; it is not shared online and may be cleared with browser data.
- Keyboard ghosting on some laptop keyboards may prevent several simultaneous keys from registering. If that happens, try a keyboard that handles simultaneous key presses better.