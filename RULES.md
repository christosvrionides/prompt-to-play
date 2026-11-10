# Prompt to Play: rules

These are the full rules for participants. The [README](README.md) has the short version, [SUBMISSION.md](SUBMISSION.md) has the submission steps, and [AGENTS.md](AGENTS.md) tells your AI agent how to follow them.

If something is unclear or borderline, ask the organiser before you rely on it.

## 1. Event format

- Teams have 3–4 people.
- Each team uses **one laptop** for development. Team members may take turns prompting on it.
- **Building time is one hour, including submission.**
- **Playing and judging time is 45 minutes.** After building, teams rotate between laptops to play each other's games.
- Each visiting team gets roughly 10 minutes to play and judge a game, depending on the rotation.

## 2. Your game

- There is no theme and no restriction on genre or format. Games may be 2D, 3D, text-based, puzzles, guessing games or anything else.
- Any language, framework or engine is permitted.
- Your game should deliver its core experience and a satisfying conclusion or milestone within a visiting team's window of roughly 10 minutes.
- Short, repeatable games are welcome. A one-minute round can be played several times.
- Longer games should offer a short mode or a meaningful milestone reachable in the available time.

## 3. Model and agent

- Use only **GPT-6 Luna** (model ID `gpt-6-luna`), the model confirmed for the event.
- Any reasoning level is allowed.
- Only **one active agent session** per team.
- No sub-agents, parallel agents, delegation or other AI models.

## 4. What humans may and may not do

All development instructions must be natural-language prompts entered inside Visual Studio Code, through the AI chat interface or an agent CLI in its integrated terminal.

**Humans may:**

- Write prompts.
- Approve the agent's permission requests.
- Playtest the game. Normal gameplay input is allowed.
- Describe problems to the agent.

**Humans may not:**

- Manually create or edit project code, configuration, scripts or assets.
- Type executable development commands. Entering prompts into the agent CLI is allowed.

**The agent must perform all development operations:** dependency installation, file creation, edits, builds, launches, restarts, Git operations and pull request creation.

**Before the timer starts** you may complete required account authentication and open VS Code. This does not permit prebuilding game content.

## 5. Local execution and internet

- The game, and any backend your team implements, must run locally on your team's laptop.
- No cloud deployment, cloud-hosted game backend or remote database.
- Internet access is allowed during development and gameplay.
- Games may use online services for things such as maps, images and other external data. Games do not need to work offline.
- GitHub is used for source control and submissions.
- Never commit credentials or secrets. Document required environment variables using placeholder values.

## 6. Existing work

- Existing libraries, engines, documentation, assets and tutorials are allowed, subject to their licences.
- Borrowing game ideas is allowed.
- Copying, cloning or reskinning a complete game, or a substantial existing game implementation, is prohibited.
- This applies even if the agent retrieves or copies the implementation without being asked to.
- **Teams are responsible for their agent's actions.**
- Refer borderline cases to the organiser.
- Record external sources and reused components in your team's build log.

## 7. Your folder, branch and pull request

Build inside your final submission folder from the beginning:

```text
games/<team-name>-<game-name>/
```

Use lowercase, hyphen-separated names. Each team must:

1. Have its agent create a branch from `main` named `submission/<team-name>-<game-name>`.
2. Keep all game-specific source, assets, dependency manifests, lockfiles, configuration, instructions and build logs inside its own folder.
3. Not modify root event documentation, repository settings or another team's files.
4. Include a game `README.md` explaining the game, controls, setup, local launch instructions, any external service requirements and known issues.
5. Maintain its own `BUILD_LOG.md`.
6. Exclude installed dependencies, caches, temporary files and secrets from Git.
7. Have the agent commit, push and open a pull request into `main` before the building hour ends.

The pull request must identify the team, game, submission folder, launch instructions and known issues.

**Do not merge your own submission.** The organiser reviews and merges it.

The steps are in [SUBMISSION.md](SUBMISSION.md), and the README and build log templates are in [templates/](templates/).

## 8. Submission cutoff

- The submitted version freezes when the building hour ends.
- The organiser records the exact head commit ID of each submitted pull request.
- You must play and demonstrate that submitted version.
- No further game edits are allowed after the cutoff, including local edits.
- Launching or restarting the submitted version is allowed.
- The organiser locks submission branches and merges the frozen versions into `main`.

A commit or pull request alone does not prevent later changes. The recorded commit ID is what identifies the version being judged.

## 9. Judging criteria

Games are judged on five criteria:

| Criterion | What it means |
| --- | --- |
| **Gameplay** | Engaging interactions, understandable controls and enjoyable challenges. |
| **Creativity** | Originality, or an interesting interpretation of an idea. |
| **Design** | Visual presentation, clarity, usability, and audio where appropriate. |
| **Reliability** | The game works smoothly and consistently. |
| **Progression / replayability** | Meaningful advancement, satisfying goals, or reasons to replay and improve a score. |
