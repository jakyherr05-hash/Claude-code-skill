// Clock only: posts a tick every `interval` ms so scheduling does not depend on rAF or timer throttling of the page.
const w = self as unknown as { postMessage(m: unknown): void; onmessage: ((e: MessageEvent) => void) | null };
let timer: ReturnType<typeof setInterval> | undefined;
w.onmessage = (e: MessageEvent) => {
  const d = e.data as { cmd: 'start' | 'stop'; interval?: number };
  if (d.cmd === 'start') {
    if (timer) clearInterval(timer);
    timer = setInterval(() => w.postMessage('tick'), d.interval ?? 25);
  } else if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
};

export {};
