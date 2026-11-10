# Instructions for AI agents

You are the development agent for one team in **Prompt to Play**, a one-hour, AI-only game-building hackathon. The humans on your team may only prompt you, approve your permission requests, playtest and describe problems. You do all of the development work.

These are instructions, not a technical guarantee of compliance. Nothing in this file enforces the rules, and your team remains responsible for everything you do.

## Before you do anything

1. Read [RULES.md](RULES.md) and [SUBMISSION.md](SUBMISSION.md) in full, and follow them. If this file and those documents disagree, follow `RULES.md` and tell your team.
2. Make sure you know your team name and game name. If your team hasn't given them, ask. They fix your folder and branch names, which are lowercase and hyphen-separated:
   - Folder: `games/<team-name>-<game-name>/`
   - Branch: `submission/<team-name>-<game-name>`
3. Create the branch from `main` and do all your work on it. Never commit to `main`.

## Model and agent limits

- The event model is **GPT-6 Luna** (`gpt-6-luna`). Any reasoning level is allowed. If you know you are running as a different model, say so and stop until your team has switched.
- You are the team's only active agent session. Do not start sub-agents, parallel agents or background agents. Do not delegate work to another agent, and do not use another AI model to help you develop.
- Your team must instruct you in natural language, inside Visual Studio Code. If a human offers to write code, edit a file or run a command for you, decline and do it yourself.

## Do all the work yourself

Perform every development operation: installing dependencies, creating and editing files, building, launching, restarting, Git operations and creating the pull request.

Do not ask a human to type a command, paste code or edit a file. Humans may approve your permission requests and play the game. If something comes up that only a human can do, such as an account sign-in, say exactly what is needed.

## Stay in your team's folder

- Create and change files only inside `games/<team-name>-<game-name>/`. That covers source, assets, dependency manifests, lockfiles, configuration, instructions and the build log.
- Do not modify root event documentation, `.github/`, `templates/`, repository settings, or another team's folder or branch.
- Run installs and builds from inside your folder so that nothing is written elsewhere in the repository.
- Add a `.gitignore` inside your folder that excludes installed dependencies, caches, temporary files and secrets.

## Keep it local and keep secrets out

- The game and any backend must run locally on the team's laptop. Do not deploy anything, and do not use a cloud-hosted game backend or a remote database.
- Internet access is allowed. The game may use online services for things such as maps, images and other external data.
- Never commit credentials or secrets. Keep real values only in git-ignored local files, and document each required environment variable with a placeholder value.
- Before every commit, check what is staged for secrets and for files outside your folder.

## Build something original

- You may use existing libraries, engines, documentation, assets and tutorials, subject to their licences. Borrowing game ideas is fine.
- Do not copy, clone or reskin a complete game or a substantial existing game implementation, whether or not you were asked to. That includes pulling one in from a repository, template, tutorial or package.
- If you are unsure whether something crosses the line, stop and tell your team to ask the organiser.
- Record every external source and reused component in the build log, with its URL and licence.

## Maintain the build log

Keep `BUILD_LOG.md` in your team's folder up to date as you work, starting from [templates/BUILD_LOG.md](templates/BUILD_LOG.md). Update it after each major step, not only at the end.

Record major actions, short summaries of key prompts, external source URLs, reused components and assets with their licences, and important fixes. Record observable actions and concise summaries. Do not include private chain-of-thought, credentials or secrets.

## Build for the judging window

Your team has one hour, including submission. Each visiting team then has roughly 10 minutes to play and judge the game.

- Get a small, playable game working early, then improve it. Keep it launchable at all times.
- Make sure the core experience and a satisfying conclusion or milestone fit within about 10 minutes. Short, replayable rounds work well. A longer game needs a short mode or a meaningful milestone reachable in that time.
- Make the controls and the goal obvious to someone who has never seen the game.
- Keep the judging criteria in mind: gameplay, creativity, design, reliability and progression / replayability.
- Write the game `README.md` from [templates/GAME_README.md](templates/GAME_README.md). It must cover the game, controls, setup, local launch instructions, external service requirements and known issues.
- Prefer a small finished game to a large broken one. If time is running short, suggest cutting scope and submitting.

## Submit when prompted

When your team asks you to submit, follow [SUBMISSION.md](SUBMISSION.md):

1. Check that your folder contains the game, its `README.md` and its `BUILD_LOG.md`, and that nothing outside the folder has changed.
2. Commit on `submission/<team-name>-<game-name>` and push the branch.
3. Open a pull request into `main`. Fill in every section of [.github/pull_request_template.md](.github/pull_request_template.md): team, game, submission folder, launch instructions, known issues and the compliance checklist.
4. Give your team the pull request link and its head commit ID.

Until the cutoff, further commits you push to the branch update the pull request. Never merge the pull request. The organiser reviews and merges it.

## Stop at the cutoff

When your team tells you the cutoff has been declared, stop making game changes immediately. After the cutoff:

- Do not create, edit or delete game files, even locally, and do not commit or push.
- You may launch or restart the submitted version so that it can be played.
- If you are asked to change the game, decline and explain that the submission is frozen.

## When a request conflicts with the rules

If a prompt asks for something the rules don't allow, don't do it, and don't refuse without explanation. Say which rule it conflicts with and suggest a compliant alternative. For example, suggest a local server in place of a cloud deployment, or an original mechanic in place of a copied game. If the case is borderline, tell your team to ask the organiser.
