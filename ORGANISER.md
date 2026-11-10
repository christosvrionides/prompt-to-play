# Organiser checklist

A working checklist for running Prompt to Play. The participant rules are in [RULES.md](RULES.md) and the submission steps are in [SUBMISSION.md](SUBMISSION.md).

The commands use the GitHub CLI (`gh`), signed in as the repository owner. Each one is a single line that works in PowerShell and in Bash.

## Before the event

### Confirm the model

- [ ] The event model is **GPT-6 Luna** (model ID `gpt-6-luna`).
- [ ] Shortly before the event, check that it is still the model you want and that it can be selected in the agent on every team laptop.
- [ ] If the event model changes, update every file that names it so they stay consistent: `README.md`, `RULES.md`, `AGENTS.md`, `templates/BUILD_LOG.md`, `.github/pull_request_template.md` and this file.

### Arrange repository access and authentication

Teams push their submission branch to this repository, so the GitHub account signed in on each team laptop needs write access.

- [ ] Collect the GitHub username that each team laptop will use.
- [ ] Invite each one as a collaborator under **Settings → Collaborators → Add people**, or run this with the username in place of `USERNAME`:

  ```bash
  gh api -X PUT repos/christosvrionides/prompt-to-play/collaborators/USERNAME
  ```

- [ ] Check that every invitation has been accepted.
- [ ] On each laptop, check that Visual Studio Code opens, that the AI agent is signed in and can select GPT-6 Luna, and that Git and the GitHub CLI are signed in as the invited account. The agent needs both to push and to open a pull request.
- [ ] Decide how the repository gets onto each laptop: you clone it during setup, or each team's agent clones it as its first prompt. Tell teams which.
- [ ] Remind teams that authentication and opening VS Code may be done before the timer starts, and that prebuilding game content may not.

Collaborators on a personal repository can push to any unprotected branch, including another team's submission branch. The rules forbid that, but nothing technical prevents it until you lock the branches at the cutoff.

### Check branch protection on `main`

`main` has a branch protection rule. Check it under **Settings → Branches**, or run:

```bash
gh api repos/christosvrionides/prompt-to-play/branches/main/protection
```

- [ ] A pull request is required before merging, with one approval.
- [ ] Review from Code Owners is required. [.github/CODEOWNERS](.github/CODEOWNERS) names `@christosvrionides` as the owner of every file.
- [ ] Stale approvals are dismissed when new commits are pushed.
- [ ] Force pushes are blocked.
- [ ] Branch deletion is blocked.

Participants are collaborators, not administrators. They cannot change or bypass these settings, and they cannot merge without your approval. "Do not allow bypassing the above settings" is left off so that you, as the owner, keep administrative control and can still update the event documentation directly.

## Start of the build period

- [ ] Every team has 3–4 people and one development laptop.
- [ ] On each laptop, VS Code is open and authentication is done. No game content exists yet.
- [ ] Remind teams of the essentials: prompts only, one agent session, GPT-6 Luna only, build in `games/<team-name>-<game-name>/`, and a pull request into `main` before the hour ends.
- [ ] Announce the cutoff time, which is the start time plus 60 minutes, and start the timer.
- [ ] Give time checks as the hour runs down, so that teams leave time to commit, push and open their pull request.

## End of the build period

Do these in order at the cutoff.

- [ ] **Announce the cutoff.** No further game edits are allowed, including local ones.
- [ ] **Lock the submission branches.** This creates an active ruleset that makes every `submission/*` branch read-only for everyone:

  ```bash
  gh api -X POST repos/christosvrionides/prompt-to-play/rulesets -f name=freeze-submissions -f target=branch -f enforcement=active -f "conditions[ref_name][include][]=refs/heads/submission/*" -f "conditions[ref_name][exclude][]" -f "rules[][type]=update" -f "rules[][type]=deletion" -f "rules[][type]=non_fast_forward"
  ```

  In the browser, the same thing is **Settings → Rules → Rulesets → New ruleset → New branch ruleset**. Set the enforcement status to **Active**, leave the bypass list empty, add the target pattern `submission/*`, and enable **Restrict updates**, **Restrict deletions** and **Block force pushes**.

  Do not activate this before the cutoff, because it stops teams pushing. Locked branches can still be merged into `main`.

- [ ] **Record each pull request's head commit ID.** This prints the pull request number, branch and head commit ID of every open submission:

  ```bash
  gh pr list --repo christosvrionides/prompt-to-play --base main --state open --json number,headRefName,headRefOid --jq '.[] | [.number, .headRefName, .headRefOid] | @tsv'
  ```

  Save the output. These commit IDs are the frozen versions. A commit or pull request alone does not prevent later changes, so the recorded ID is what identifies the version being judged.

- [ ] Check that every team has an open pull request into `main` from its `submission/<team-name>-<game-name>` branch.

## Play and judge (45 minutes)

### Demos use the frozen versions

- [ ] Each team launches the version it submitted. Launching and restarting are allowed. Editing is not.
- [ ] Check laptops against your recorded commit IDs. In the repository on the laptop, the first command should print the recorded commit ID and the second should print nothing:

  ```bash
  git rev-parse HEAD
  ```

  ```bash
  git status --short
  ```

- [ ] If a laptop is not on its recorded commit, have the team's agent check out that commit before anyone plays.

### Laptop rotation

Laptops stay where they are, and teams move.

- [ ] Number the laptops in a loop around the room. Each round, every team moves on one laptop, so no team meets the same game twice.
- [ ] Plan the rounds to fit 45 minutes. Four rounds of about 10 minutes, with a minute to move between rounds, fit the window.
- [ ] Adjust to the number of teams. With five teams, four rounds let every team play every other game. With fewer teams there are fewer rounds, so each can run longer. With more teams, each team plays four of the other games.
- [ ] Decide whether one member of each team stays at its own laptop to relaunch the game and explain the controls, and tell teams before the first round.
- [ ] Call the start and end of each round.
- [ ] Point visiting teams to the five [judging criteria](README.md#judging-criteria).

## Review and merge submissions

For each pull request:

- [ ] The head commit matches the commit ID you recorded at the cutoff.
- [ ] Every change is inside the team's own `games/<team-name>-<game-name>/` folder.
- [ ] The folder has a `README.md` and a `BUILD_LOG.md`.
- [ ] There are no credentials or secrets, and no installed dependencies, caches or temporary files.
- [ ] The pull request names the team, game, submission folder, launch instructions and known issues.
- [ ] Reuse is recorded in the build log, and nothing looks like a copied, cloned or reskinned game.
- [ ] Approve as code owner, then merge. Choose **Create a merge commit** so that the recorded commit ID stays in the history of `main`.

When everything is merged:

- [ ] Remove the collaborators you no longer need under **Settings → Collaborators**.
