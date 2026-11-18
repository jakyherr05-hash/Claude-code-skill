// Single listener registry (TECH §3 cleanup): on() returns off; the count feeds __ozoneStats.listeners.
let live = 0;
const offs = new Set<() => void>();
export function on<K extends keyof WindowEventMap>(t: Window, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions): () => void;
export function on(t: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions): () => void;
export function on(t: EventTarget, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) {
  t.addEventListener(type, fn as EventListener, opts);
  live++;
  const off = () => {
    if (!offs.delete(off)) return;
    t.removeEventListener(type, fn as EventListener, opts);
    live--;
  };
  offs.add(off);
  return off;
}
export const listenerCount = () => live;
export function disposeAll() { [...offs].forEach((f) => f()); }
