# Release readiness

Evidence for every line is in [VALIDATION-REPORT.md](VALIDATION-REPORT.md) and [AGENT-VALIDATION.md](AGENT-VALIDATION.md). This page is a decision summary, not new evidence.

## Verdict

| Deliverable | Verdict | Why |
|---|---|---|
| **Claude Code plugin** (12 agents, 10 skills, scripts, templates) | **Ready for a preview release** to Linux/Chromium users. **Not production-ready** | Install, discovery, delegation to all 12 agents, model selection, BLOCKED handling, scripts (21/21) and structural checks (173/173) PASS in real sessions. One full ten-phase run is PARTIAL: it never reached a final Gate B pass. Windows/macOS and claude.ai upload are NOT TESTED |
| **Demo website** | **Ready as a demonstration** (hosted preview). **Not production-ready** | Suite, accessibility, contrast, LCP, CLS and font budget pass on Chromium with software WebGL. Gate B round 2 has not been done. Real GPUs, other browsers and real devices are NOT TESTED. Detail→Home long tasks are open |

"Production-ready" is not claimed for either deliverable: the remaining items below cannot be verified in this environment.

## Must-do before calling it production-ready

1. **Real-GPU and real-device pass:** Detail→Home trace, TBT with WebGL on, frame cost on a mid-range phone (VALIDATION-REPORT C).
2. **Firefox and Safari/WebKit:** add the Playwright projects where those browsers are installed and run the suite.
3. **Demo Gate B round 2:** creative-director, tech-lead and qa-engineer review the finished demo independently.
4. **One complete ten-phase run** to a full Gate B pass, with enough usage quota for the account (A.3).
5. **Windows/macOS install check** of `install.sh` and the marketplace install.

## Blocked (needs something from the user)

| Item | Needs |
|---|---|
| AI image/video generation | a free Hugging Face token, or a machine with a GPU |
| 21st.dev MCP | an API key |

## Accepted trade-offs

- Mono labels specified at weight 500 render with the 400 face, to keep first-load fonts at 212.6 KB (budget 220 KB). Creative sign-off not obtained.
- The hosted preview uses `VITE_MEMORY_ROUTER=1`: the address bar does not change between pages. Normal builds use real URLs.
