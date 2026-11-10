# Prompt to Play

**One hour. One laptop. One AI agent. Build a game through prompting.**

Prompt to Play is an AI-only game-building hackathon. Your team describes the game. Your AI agent writes every line, runs every command and opens the pull request. Then everyone swaps laptops and plays.

## At a glance

| | |
| --- | --- |
| **Team** | 3–4 people |
| **Laptop** | One per team for development. Take turns prompting. |
| **Model** | GPT-6 Luna (`gpt-6-luna`), any reasoning level |
| **Build** | 60 minutes, including submission |
| **Play and judge** | 45 minutes, rotating between laptops |
| **Theme** | None. Any genre, any format, any language, framework or engine. |

## How it runs

1. **Build (60 minutes).** Your team builds a game on one laptop by prompting one AI agent in Visual Studio Code. Your agent must commit, push and open your pull request before the hour ends.
2. **Freeze.** When the hour ends, your submitted version is final. No more edits, not even local ones.
3. **Play and judge (45 minutes).** Teams rotate between laptops and play each other's games, with roughly 10 minutes per game.

## The essential rules

- **Prompt, don't type.** Humans write natural-language prompts, approve permission requests, playtest and describe problems. Humans don't write or edit code, configuration, scripts or assets, and don't type development commands.
- **The agent does the work.** Installing dependencies, creating and editing files, building, launching, restarting, Git and the pull request are all done by the agent.
- **One model, one agent.** Use only GPT-6 Luna, in one active agent session. No sub-agents, parallel agents, delegation or other AI models.
- **Stay in VS Code.** Prompts go into the AI chat or an agent CLI in the integrated terminal.
- **Run it locally.** The game and any backend you build run on your laptop. No cloud deployment, cloud-hosted backend or remote database.
- **Internet is allowed** while building and playing. Games may use online services such as maps or images, and don't need to work offline.
- **Make your own game.** Libraries, engines, assets, tutorials and borrowed ideas are fine. Copying, cloning or reskinning an existing game is not, even if your agent does it unprompted.
- **No secrets in Git.** Never commit credentials. Document environment variables with placeholder values.

Full details: [RULES.md](RULES.md).

## Build for a 10-minute visit

Each visiting team has roughly 10 minutes with your game, depending on the rotation.

- Deliver the core experience and a satisfying conclusion or milestone within that window.
- Short, repeatable games are welcome. A one-minute round can be played several times.
- A longer game should offer a short mode or a meaningful milestone that visitors can reach in time.

## Judging criteria

| Criterion | What it means |
| --- | --- |
| **Gameplay** | Engaging interactions, understandable controls and enjoyable challenges. |
| **Creativity** | Originality, or an interesting interpretation of an idea. |
| **Design** | Visual presentation, clarity, usability, and audio where appropriate. |
| **Reliability** | The game works smoothly and consistently. |
| **Progression / replayability** | Meaningful advancement, satisfying goals, or reasons to replay and improve a score. |

## Submitting

Everything your team makes lives in one folder, on one branch, in one pull request:

- **Folder:** `games/<team-name>-<game-name>/`, lowercase and hyphen-separated. Build there from the start.
- **Branch:** `submission/<team-name>-<game-name>`, created from `main` by your agent.
- **Include:** a game `README.md` and a `BUILD_LOG.md`. There are [templates](templates/) for both.
- **Pull request:** your agent opens it into `main` before the hour ends. Don't merge it yourself. The organiser reviews and merges.

Step-by-step instructions and a checklist: [SUBMISSION.md](SUBMISSION.md).

## Documents

| Document | What it is |
| --- | --- |
| [RULES.md](RULES.md) | The full participant rules |
| [SUBMISSION.md](SUBMISSION.md) | Branch, folder, pull request and deadline steps |
| [AGENTS.md](AGENTS.md) | Instructions your AI agent follows |
| [templates/GAME_README.md](templates/GAME_README.md) | Template for your game's README |
| [templates/BUILD_LOG.md](templates/BUILD_LOG.md) | Template for your build log |
| [ORGANISER.md](ORGANISER.md) | The organiser's checklist |
