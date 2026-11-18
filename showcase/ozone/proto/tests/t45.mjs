// T6b span t45 (S4 -> S5, includes the cue change). Usage: node t45.mjs [--configs A,B,C] [--runs 3] [--variant default] [--query "cut=2"] [--only wheel-slow]
import { runSpan } from './protocol.mjs';
await runSpan('t45');
