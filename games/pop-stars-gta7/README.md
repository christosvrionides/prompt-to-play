# GTA7: Pipeline Panic

| | |
| --- | --- |
| **Team** | Pop Stars |
| **Folder** | `games/pop-stars-gta7/` |

GTA7: Pipeline Panic is an original two-player co-op platform game. Choose two characters from the Richard crew, Junaid, Tariq, Christos, and Hannah, then work through five stages: search the Discovery office, ship the original Alpha pipeline, sneak through the Private Beta forest, cross the Public Beta policy course, and defeat the AGB in the HLD review. Each runner carries two laptops.

## How to play

- **Goal:** Complete each stage objective and bring both runners to its exit. Collect three documents in Discovery and three release keys in Alpha, avoid the forest spotlights in Private Beta, jump the policy lasers in Public Beta, then hit the final AGB with HLDs.
- **Player 1:** `A` and `D` to move, `W` to jump. Press `F` to throw an HLD during the final boss fight.
- **Player 2:** Left and Right arrows to move, Up arrow to jump. Press Down arrow to throw an HLD during the final boss fight.
- **Character picker:** Choose either runner directly from the menus, or use `Q` / `E` for Player 1 and `,` / `.` for Player 2. Junaid, Tariq, and Christos carry VMs; Hannah has a guide dog.
- **Power-ups:** The pickup banner and player HUD name the effect and show its remaining time. `VM` slows you, `MB` speeds you up, and `AI` lets you fly while you hold the jump key.
- **Other controls:** Follow the opening screen, then press `Enter` to choose runners and start. `P` or `Esc` pauses; `R` restarts; `M` toggles the original chase music.
- **Leaderboard:** At the end of a run, enter a name to save the score to this browser's local top-five leaderboard. Choose **Retry Run** to play again.
- **Progression:** Ordinary stage exits open the next stage. The results and leaderboard screen appear after the final boss is defeated or the run ends from lost retries.

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