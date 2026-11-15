# Tool & integration registry

_Verified 2026-11-15 in a Claude Code 2.1.325 cloud container (Linux, Node 22.23, Chromium 1243 via Playwright 1.63). Statuses: **PASS** (exercised with evidence) · **FAIL** · **NOT TESTED** · **BLOCKED**._

The plugin deliberately ships **no auto-starting MCP servers**. Every server below is opt-in, so sessions don't start browsers or reach third-party services unless you choose them. The studio's agents do browser work through Playwright scripts (`reference-study`, `web-qa`), which is cheaper in tokens than interactive MCP browsing. Add an MCP server when you want interactive inspection.

## MCP servers

| Name | Purpose in the studio | Install (user scope) | Source / licence / maintenance | Permissions & risk | Cost | Verification |
|---|---|---|---|---|---|---|
| **Playwright MCP** `@playwright/mcp` | Interactive browsing, accessibility snapshots, screenshots, console/network for research and QA | `claude mcp add playwright -- npx -y @playwright/mcp@latest --headless` | github.com/microsoft/playwright-mcp · Apache-2.0 · npm 0.0.85, published 2026-11-09 | Drives a real browser: can visit any URL and submit forms. `browser_run_code_unsafe` runs arbitrary Playwright code, so keep it out of `allow` rules. | Free | **PASS**: handshake (25 tools); `browser_navigate` to lenis.dev returned page title + snapshot. In a **root container** it needs `--no-sandbox` and, if its bundled browser isn't installed, `--executable-path <chrome>` |
| **Chrome DevTools MCP** `chrome-devtools-mcp` | Performance traces, Lighthouse audits, CSS inspection, network analysis | `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --headless --isolated` | github.com/ChromeDevTools/chrome-devtools-mcp · Apache-2.0 · npm 1.13.0, published 2026-11-11 · Google maintainers | Full DevTools access to pages it opens; `evaluate_script` runs JS (disable with `--javascriptEvaluation=false` if not needed) | Free | **PASS**: handshake (33 tools incl. `lighthouse_audit`, `performance_start_trace`); `new_page` opened threejs.org. As root: `--chrome-arg=--no-sandbox` |
| **Context7** `@upstash/context7-mcp` | Up-to-date library docs (GSAP, Lenis, Three, R3F) for agents | `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest` | github.com/upstash/context7 · MIT · npm 4.7.0 | Sends library names and queries to context7.com | Free tier (API key optional for higher limits [I]) | **PASS**: `resolve-library-id` "gsap" → `/websites/gsap` |
| **21st MCP** (formerly Magic, `@21st-dev/magic`) | Search and install UI components from 21st.dev | Official: `npx @21st-dev/cli@latest init --client claude`, or HTTP `https://21st.dev/api/mcp` with header `x-api-key` | github.com/21st-dev/magic-mcp · ISC · npm 0.2.3 (now a compatibility proxy to the hosted 21st MCP) | Sends prompts and code context to 21st.dev; installs component code into your repo | **Free account:** search on every plan, **2 installs/day**; unlimited installs and AI generation need the paid Builder plan (from $6/mo billed yearly), per 21st.dev/mcp on 2026-11-15 | **BLOCKED**: requires a 21st API key. Old Magic keys were reset; generate a new one at 21st.dev/mcp. Not installed. |
| **GitHub** | PRs, issues, CI | Already provided in Claude Code cloud sessions; locally `claude mcp add` the official GitHub MCP server | github.com/github/github-mcp-server | Repo write access per token scope | Free | **PASS (env)**: used in this session for the PR |
| Filesystem MCP `@modelcontextprotocol/server-filesystem` | — | Not recommended | modelcontextprotocol/servers · npm 2.3.0 | Duplicates Claude Code's built-in Read/Write/Edit | Free | Not installed (**duplicate capability**) |

### Container note
Chromium refuses to run as root with its sandbox enabled. On a normal workstation, don't pass `--no-sandbox`. Use it only in disposable root containers.

## CLI tools & libraries used by skills

| Tool | Used by | Version verified | Licence | Status |
|---|---|---|---|---|
| Playwright (+ Chromium 1243) | reference-study, web-qa, demo tests | 1.63.0 | Apache-2.0 | **PASS**: capture of 25 sites; demo suite |
| @axe-core/playwright | web-qa | 4.14.0 | MPL-2.0 | **PASS**: see QA report |
| Lighthouse | web-qa `lighthouse.sh` | 13.6.0 | Apache-2.0 | see PERFORMANCE_REPORT |
| sharp | ai-visual-pipeline `optimize-images.mjs` | 0.35.5 | Apache-2.0 | **PASS**: demo media generated |
| ffmpeg (libx264, libvpx-vp9, libsvtav1, libwebp) | `encode-video.sh` | 6.1.1 | LGPL/GPL (system) | see verification report |
| gradio_client (pip) | `providers.py` hf-space | 2.7.2 | Apache-2.0 | **PASS (client)** / generation **BLOCKED** (ZeroGPU quota 0 for anonymous IP) |
| gsap + @gsap/react | gsap-motion | 3.15.1 / 2.1.2 | GSAP Standard no-charge (both; @gsap/react: "SEE LICENSE AT gsap.com/standard-license") | **PASS**: demo |
| lenis | lenis-scroll | 1.3.27 | MIT | **PASS**: demo |
| three | webgl-three (lab) | 0.187.0 | MIT | see verification report |
| Fontsource variable fonts | typography-system | 5.3.x | OFL-1.1 | **PASS**: demo |

## AI image / video services
See `plugins/premium-web-studio/skills/ai-visual-pipeline/references/providers.md` (licences from the HF model API; free-tier rules from official docs; live probes).

## Secrets policy
No keys are stored in this repository. Tools that need keys read them from environment variables (`HF_TOKEN`, `POLLINATIONS_KEY`, `API_KEY_21ST`). In Claude Code cloud sessions, add them as environment network secrets, never in committed files.
