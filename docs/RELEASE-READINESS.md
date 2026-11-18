# Release readiness

Evidence for every line is in [VALIDATION-REPORT.md](VALIDATION-REPORT.md) and [AGENT-VALIDATION.md](AGENT-VALIDATION.md). This page is a decision summary, not new evidence.

## Verdict

| Deliverable | Verdict | Why |
|---|---|---|
| **Claude Code plugin** (12 agents, 10 skills, scripts, templates) | **Ready for a preview release** to Linux/Chromium users. **Not production-ready** | Install (local and from GitHub), discovery, delegation to all 12 agents, model selection, BLOCKED handling, scripts (23/23) and structural checks (173/173) PASS in real sessions. A full ten-phase run on a fresh project reached a Gate B pass with all three reviewers. Windows/macOS and claude.ai upload are NOT TESTED |
| **Demo website** | **Ready as a demonstration** (hosted preview). **Not production-ready** | Suite (57/57), accessibility (axe at 1440/768/390), contrast, LCP, CLS and font budget pass on Chromium with software WebGL. Gate B round 2 done; its majors are fixed and closed by the reviewer. Real GPUs, other browsers and real devices are NOT TESTED. Detail→Home long tasks are open |

"Production-ready" is not claimed for either deliverable: the remaining items below cannot be verified in this environment.

## Must-do before calling it production-ready

1. **Real-GPU and real-device pass:** Detail→Home trace, TBT with WebGL on, frame cost on a mid-range phone (VALIDATION-REPORT C).
2. **Firefox and Safari/WebKit:** add the Playwright projects where those browsers are installed and run the suite.
3. **Windows/macOS install check** of `install.sh` and the marketplace install.
4. **Mobile TBT on a fixed, quiet host or a real phone** (VALIDATION-REPORT C: host-dependent).

Done since the last revision: demo Gate B round 2 (majors closed), a complete ten-phase run to a Gate B pass, the GitHub marketplace install.

## Blocked (needs something from the user)

| Item | Needs |
|---|---|
| AI image/video generation | a free Hugging Face token, or a machine with a GPU |
| 21st.dev MCP | an API key |

## Accepted trade-offs

- Mono labels specified at weight 500 render with the 400 face, to keep first-load fonts at 212.6 KB (budget 220 KB). Creative sign-off not obtained.
- Mobile TBT with WebGL off was at the edge of its budget (198.5 ms vs 200 ms on 2026-11-16); later hosts were slower, and an interleaved A/B shows the Gate B r2 changes add no measurable cost.
- The hosted preview uses `VITE_MEMORY_ROUTER=1`: the address bar does not change between pages. Normal builds use real URLs.
