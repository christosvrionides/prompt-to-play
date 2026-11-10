# Submitting your game

Your agent does every step below. You prompt, and it runs the commands. The full rules are in [RULES.md](RULES.md).

## The short version

| | |
| --- | --- |
| **Folder** | `games/<team-name>-<game-name>/` |
| **Branch** | `submission/<team-name>-<game-name>` |
| **Pull request** | Into `main`, opened by your agent before the building hour ends |
| **Merging** | The organiser only. Never merge your own pull request. |

Names are lowercase and hyphen-separated. Team "Pixel Pirates" with the game "Star Hop" uses `games/pixel-pirates-star-hop/` and `submission/pixel-pirates-star-hop`.

## Step by step

### 1. Start in the repository

Work in a clone of this repository, opened in Visual Studio Code. If it isn't on your laptop yet, prompt your agent to clone it. Your agent should work from the repository root so that it picks up [AGENTS.md](AGENTS.md).

### 2. Tell your agent who you are

Choose your team name and game name first, because they fix your folder and branch names. Then prompt something like:

> We are team Pixel Pirates and our game is Star Hop. Read AGENTS.md, RULES.md and SUBMISSION.md, then create our submission branch from main and our game folder.

Your agent creates the branch `submission/<team-name>-<game-name>` from `main` and the folder `games/<team-name>-<game-name>/`.

### 3. Build inside your folder from the beginning

Everything game-specific stays in your folder: source, assets, dependency manifests, lockfiles, configuration, instructions and build logs. Don't build somewhere else and move it later.

Don't change root event documentation, repository settings or another team's files.

### 4. Add your README and build log

Your folder must contain:

- `README.md`, based on [templates/GAME_README.md](templates/GAME_README.md). It explains the game, controls, setup, local launch instructions, any external service requirements and known issues.
- `BUILD_LOG.md`, based on [templates/BUILD_LOG.md](templates/BUILD_LOG.md). Your agent keeps it up to date as you build.

### 5. Keep dependencies and secrets out of Git

Your agent should add a `.gitignore` inside your folder that excludes installed dependencies, caches, temporary files and secrets.

Never commit credentials. If your game needs environment variables, document them with placeholder values, for example:

```text
MAPS_API_KEY=your-key-here
```

### 6. Commit, push and open the pull request

Leave time for this. It is part of your hour. Prompt something like:

> Submit our game: commit everything in our folder, push our submission branch and open the pull request into main using the pull request template.

The pull request must identify your team, game, submission folder, launch instructions and known issues. The [pull request template](.github/pull_request_template.md) has a section for each.

You can open the pull request early. Anything your agent pushes to the branch before the cutoff updates it.

**Do not merge your pull request.** The organiser reviews and merges it.

### 7. At the cutoff

When the building hour ends, your submitted version is frozen:

- The organiser records the exact head commit ID of your pull request. That commit is the version being judged.
- You must play and demonstrate that version.
- No further game edits are allowed, including local edits on your laptop.
- Launching or restarting the submitted version is allowed.
- The organiser locks submission branches and merges the frozen versions into `main`.

A commit or pull request alone does not prevent later changes, which is why the commit ID is recorded.

## Submission checklist

- [ ] The branch is `submission/<team-name>-<game-name>`, created from `main`.
- [ ] Everything is inside `games/<team-name>-<game-name>/`, and nothing outside it has changed.
- [ ] The game launches locally using the instructions in its `README.md`.
- [ ] `README.md` covers the game, controls, setup, launch, external services and known issues.
- [ ] `BUILD_LOG.md` is up to date, including external sources and reused components.
- [ ] No installed dependencies, caches, temporary files or secrets are committed.
- [ ] Required environment variables are documented with placeholder values.
- [ ] The agent has committed, pushed and opened the pull request into `main`.
- [ ] The pull request names the team, game, folder, launch instructions and known issues.
- [ ] Nobody on the team has merged the pull request.
