# Installation guide

The studio is a **Claude Code plugin** (`premium-web-studio`) served from this repository, which is also a plugin **marketplace**. Pick one method.

## A. Plugin (recommended): namespaced, updatable, all projects
```bash
claude plugin marketplace add jakyherr05-hash/claude-code-skill
claude plugin install premium-web-studio@premium-web-studio-marketplace
```
Inside a session you can also use `/plugin marketplace add …` and `/plugin install …`. Skills appear as `/premium-web-studio:web-studio` and so on, and agents as `premium-web-studio:creative-director` and so on.

Update later with `claude plugin marketplace update premium-web-studio-marketplace`.

Limitations (from the Claude Code docs): plugin agents ignore the `hooks`, `mcpServers` and `permissionMode` frontmatter. The studio's agents don't use them.

## B. Copy into your user scope (`~/.claude`): unnamespaced, this machine only
```bash
git clone https://github.com/jakyherr05-hash/claude-code-skill && cd claude-code-skill
./install.sh --dry-run      # preview
./install.sh                # installs 10 skills → ~/.claude/skills, 12 agents → ~/.claude/agents
```
- The installer never overwrites. Existing same-named items are skipped unless you pass `--force`, which backs them up to `~/.claude/backups/premium-web-studio-<timestamp>/` first.
- `./install.sh --uninstall` removes exactly what it installed (tracked in `~/.claude/.premium-web-studio-installed`).
- `./install.sh --project /path/to/repo` installs into that project's `.claude/` instead, so you can commit it for your team.
- If `~/.claude/agents/` didn't exist when your session started, restart Claude Code so the agents load (documented watcher behaviour).

## C. Cloud sessions, Cowork and claude.ai
Cloud sessions and Cowork **don't read `~/.claude/skills` from your machine**. Use one of these:
- Add the marketplace (method A) in the cloud environment, or commit the project-scope install (B with `--project`) to the repository the session clones.
- For claude.ai skill upload: each skill folder is a valid Agent Skill (frontmatter uses only `name` and `description`). Zip a skill folder and upload it under Settings → Skills. **Agents (subagents) are a Claude Code feature and don't upload to claude.ai.** The orchestrator still works there, but runs the specialists' instructions itself, without parallel delegation.

## Optional tools
| Need | Install |
|---|---|
| Browser automation for research/QA scripts | `npm i -D playwright` then `npx playwright install chromium` (or use a global install with `NODE_PATH=$(npm root -g)`) |
| Image optimisation | `npm i -D sharp` |
| Video encoding | ffmpeg with libx264 + libvpx-vp9 (+ libsvtav1 for AV1) |
| AI generation via HF ZeroGPU | `pip install gradio_client` and `export HF_TOKEN=…` (free account token) |
| MCP servers | See `docs/TOOL_REGISTRY.md` (Playwright MCP, Chrome DevTools MCP, Context7, 21st) |

## Verify the install
```bash
claude plugin validate ./plugins/premium-web-studio      # ✔ Validation passed
claude plugin list                                        # premium-web-studio enabled
```
In a session, ask "list the agents available to you", or run `/premium-web-studio:web-studio`.
