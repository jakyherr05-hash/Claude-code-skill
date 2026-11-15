# Provider registry — verified 2026-11-15

How verified: **[API]** Hugging Face model API `https://huggingface.co/api/models/<id>` → `cardData.license`; **[DOC]** official doc page fetched on the date; **[PROBE]** live request from this cloud environment; **[I]** inferred/general knowledge — re-check.

Classes: **Fully free** · **Open-source, needs hardware** · **Free tier with restrictions** · **Promotional credits** · **Paid**.

## Image models (weights)
| Model | HF id | Licence | Class | Notes |
|---|---|---|---|---|
| FLUX.1 [schnell] | black-forest-labs/FLUX.1-schnell | apache-2.0 [API] (gated: auto-accept) | Open-source, needs hardware | 1–4 step distilled; best free commercial default |
| FLUX.1 [dev] | black-forest-labs/FLUX.1-dev | flux-1-dev-non-commercial-license [API] | — | **Not for commercial deliverables** |
| FLUX.2 [dev] | black-forest-labs/FLUX.2-dev | flux-non-commercial-license [API] | — | **Not for commercial deliverables** |
| Qwen-Image | Qwen/Qwen-Image | apache-2.0 [API] | Open-source, needs hardware | Strong text rendering in images |
| Z-Image-Turbo | Tongyi-MAI/Z-Image-Turbo | apache-2.0 [API] | Open-source, needs hardware | Fast distilled model |
| SDXL base 1.0 | stabilityai/stable-diffusion-xl-base-1.0 | openrail++ [API] | Open-source, needs hardware | Huge ecosystem (LoRA, ControlNet); use-based restrictions |
| SD 3.5 Large | stabilityai/stable-diffusion-3.5-large | stabilityai-ai-community [API] | Open-source, needs hardware | Community licence has a revenue threshold for free commercial use — read it [I] |

## Video models (weights)
| Model | HF id | Licence | Notes |
|---|---|---|---|
| Wan 2.2 T2V A14B | Wan-AI/Wan2.2-T2V-A14B | apache-2.0 [API] | High quality; large VRAM [I] |
| Wan 2.1 T2V 1.3B | Wan-AI/Wan2.1-T2V-1.3B | apache-2.0 [API] | Consumer-GPU friendly (~8 GB class) [I] |
| Mochi 1 preview | genmo/mochi-1-preview | apache-2.0 [API] | Large VRAM [I] |
| LTX-Video | Lightricks/LTX-Video | "other" (custom) [API] | Fast; read licence |
| LTX-2 | Lightricks/LTX-2 | ltx-2-community-license-agreement [API] | Read revenue/usage terms |
| HunyuanVideo | tencent/HunyuanVideo | tencent-hunyuan-community [API] | Territory exclusions in licence [I] |
| CogVideoX-5b | zai-org/CogVideoX-5b | "other" (custom) [API] | Read licence |

## Services
| Service | Class | Verified facts | Automation |
|---|---|---|---|
| **Hugging Face ZeroGPU Spaces** | Free tier with restrictions | [DOC] ZeroGPU Spaces "are available to use for free to all users"; PRO users get 8× more daily quota. [PROBE] anonymous call to `black-forest-labs/FLUX.1-schnell` Space returned: *"You have exceeded your ZeroGPU quota (90s requested vs. 0s left) … Authenticate with a Hugging Face token for more quota"* — anonymous quota is shared per IP, so cloud hosts often have none. | `gradio_client` (pip) — `providers.py --provider hf-space`; honours `HF_TOKEN` |
| **Hugging Face Inference Providers** | Paid (pay-as-you-go) | [DOC] Free users: **no** monthly credits (must purchase); PRO: $2.00/month; Team/Enterprise $2/seat. [PROBE] unauthenticated router call → HTTP 401. | REST — `providers.py --provider hf-inference` |
| **ComfyUI** (local) | Open-source, needs hardware | GPL-3.0 tool [I]; runs any of the open models above; API-format workflow JSON via `/prompt` | `providers.py --provider comfyui --workflow wf.json` |
| **Pollinations** | Free tier with restrictions / credits ("pollen") | [DOC] gen.pollinations.ai API requires an `sk_` key; [PROBE] legacy keyless `image.pollinations.ai/prompt/...` still returned a JPEG **with a visible pollinations.ai watermark despite `nologo=true`**. Repo licence MIT [DOC]. | REST — `providers.py --provider pollinations` (key) |
| **21st.dev MCP** | Free tier with restrictions | (UI components, not imagery — see tool registry) | MCP |

## Hardware guidance [I]
- Image: FLUX.1-schnell fp8 runs on ~12 GB VRAM; SDXL on 8 GB; Apple Silicon via ComfyUI/MPS is slower but workable.
- Video: Wan 2.1 1.3B targets consumer GPUs (~8 GB+ with offloading); 14B-class models need 24–80 GB.
- No GPU: use ZeroGPU Spaces with a free HF token (daily quota), or procedural/3D-rendered assets.

## How to unblock generation in this studio (cheapest first)
1. **Free HF account token** → `export HF_TOKEN=hf_...` (never commit it) → `providers.py image --provider hf-space ...` (FLUX.1-schnell, Apache-2.0).
2. Local GPU → install ComfyUI from its official GitHub repo, download Apache-2.0 weights, export a workflow in API format.
3. Paid (only with explicit user approval): HF PRO or credits; Pollinations pollen.
