/**
 * Studio Three.js stage template (webgl-three skill asset).
 *
 * A single-canvas Three.js scene that:
 *  - caps DPR (default 1.5; pass 1 on mobile),
 *  - renders ON DEMAND only: `render()` is a no-op unless something changed,
 *    and is meant to be driven by an external ticker (gsap.ticker) — no own rAF,
 *  - resizes via ResizeObserver, pauses via IntersectionObserver,
 *  - exposes `setProgress(p)` for scroll-scrubbed motion (ScrollTrigger onUpdate),
 *  - handles context loss, and disposes EVERYTHING in `dispose()`.
 *
 * The demo object is a spun-brass reflector: a LatheGeometry with a
 * MeshStandardMaterial, a concentric "spinning marks" roughness map and a
 * PMREM room environment, lit by one directional key from the upper left
 * (the studio's sitewide light direction) plus a dim warm ambient.
 *
 * Lazy-load this module (`await import('./threeStage')`) so three.js never
 * sits on the LCP path. Note: `dispose()` forces context loss, which makes the
 * canvas element unusable for a new WebGL context — remount with a fresh
 * <canvas> (React: key it, or let unmount remove it). Under React StrictMode's
 * dev double-effect on the same element, pass `{ forceContextLoss: false }`.
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  LatheGeometry,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  RGBAFormat,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Texture,
  UnsignedByteType,
  Vector2,
  WebGLRenderer,
  type Material,
  type Object3D,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Anything shaped like gsap.ticker. */
export type Ticker = { add(fn: () => void): unknown; remove(fn: () => void): unknown };

export type ThreeStageOptions = {
  /** DPR cap. Default 1.5; pass 1 on mobile. */
  maxDpr?: number;
  /** Drive render() from this ticker (e.g. gsap.ticker). Omit to call render() yourself. */
  ticker?: Ticker;
  /** Background colour (scene clear). Default #0d0c0b. */
  background?: number;
  /** Call WEBGL_lose_context on dispose (frees the GPU context immediately). Default true. */
  forceContextLoss?: boolean;
  /** Element observed for size/visibility. Default: the canvas's parent (or the canvas). */
  observe?: Element;
};

export type ThreeStage = {
  /** 0..1 scroll progress → reflector rotation/tilt. Marks dirty. */
  setProgress(p: number): void;
  /** Draw if dirty and visible. Safe to call every tick. */
  render(): void;
  /** Force a re-measure (ResizeObserver does this automatically). */
  resize(): void;
  /** Remove observers/listeners/ticker and free every GPU resource. Idempotent. */
  dispose(): void;
  readonly renderer: WebGLRenderer;
  readonly visible: boolean;
  readonly lost: boolean;
  readonly frames: number;
};

/** Concentric spinning marks: a 1×N stripe along the lathe's v (profile) axis. */
function makeSpinMarks(): DataTexture {
  const h = 256;
  const data = new Uint8Array(h * 4); // RGBA; roughnessMap samples the G channel
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < h; i++) {
    const fine = 0.5 + 0.5 * Math.sin(i * 1.9 + rnd() * 0.8);
    const v = Math.round(255 * (0.28 + 0.16 * fine + 0.06 * rnd()));
    data.set([v, v, v, 255], i * 4);
  }
  const tex = new DataTexture(data, 1, h, RGBAFormat, UnsignedByteType);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

/** Reflector profile: shallow parabolic dish with a rolled rim and a neck. */
function reflectorProfile(): Vector2[] {
  const pts: Vector2[] = [];
  pts.push(new Vector2(0.0, -0.62), new Vector2(0.16, -0.62), new Vector2(0.17, -0.5), new Vector2(0.2, -0.42));
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const r = 0.2 + (i / n) * 0.95;
    pts.push(new Vector2(r, -0.42 + 0.55 * Math.pow((r - 0.2) / 0.95, 2)));
  }
  pts.push(new Vector2(1.19, 0.15), new Vector2(1.21, 0.12), new Vector2(1.2, 0.09));
  return pts;
}

export function createThreeStage(canvas: HTMLCanvasElement, opts: ThreeStageOptions = {}): ThreeStage {
  const maxDpr = opts.maxDpr ?? 1.5;
  const target = opts.observe ?? canvas.parentElement ?? canvas;

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const scene = new Scene();
  scene.background = new Color(opts.background ?? 0x0d0c0b);

  // Image-based lighting from a procedural room, baked once, source scene freed at once.
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  room.dispose();
  pmrem.dispose();
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.42; // keep it a dark room

  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.55, 4.4);
  camera.lookAt(0, -0.05, 0);

  const spin = makeSpinMarks();
  const brass = new MeshStandardMaterial({
    color: 0xc9a36a,
    metalness: 1,
    roughness: 1, // scaled per texel by the spinning marks
    roughnessMap: spin,
    side: DoubleSide, // a lathe is a single surface: show the spun interior too
  });
  const geo = new LatheGeometry(reflectorProfile(), 128);
  const reflector = new Mesh(geo, brass);
  const rig = new Group();
  rig.add(reflector);
  rig.rotation.x = 0.7;
  rig.scale.setScalar(0.8);
  scene.add(rig);

  const key = new DirectionalLight(0xffd9a8, 3.2); // ~2700–3000 K key, upper left (sitewide light direction)
  key.position.set(-3, 4.2, 2.5);
  scene.add(key);
  scene.add(new AmbientLight(0x2a221a, 0.6));

  let dirty = true;
  let visible = true;
  let lost = false;
  let disposed = false;
  let frames = 0;

  function resize(): void {
    if (disposed) return;
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  }

  function setProgress(p: number): void {
    const t = Math.min(1, Math.max(0, p));
    const y = t * Math.PI * 1.2;
    const x = 0.7 - t * 0.55;
    if (y !== rig.rotation.y || x !== rig.rotation.x) {
      rig.rotation.y = y;
      rig.rotation.x = x;
      dirty = true;
    }
  }

  function render(): void {
    if (!dirty || !visible || lost || disposed) return;
    dirty = false;
    renderer.render(scene, camera);
    frames++;
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(target);
  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1];
      if (!e) return;
      visible = e.isIntersecting;
      if (visible) dirty = true; // the buffer may have been discarded while hidden
    },
    { rootMargin: '10% 0px' },
  );
  io.observe(target);

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
  };
  const onRestored = () => {
    lost = false;
    dirty = true; // three re-uploads resources lazily on the next render
  };
  canvas.addEventListener('webglcontextlost', onLost, false);
  canvas.addEventListener('webglcontextrestored', onRestored, false);

  const tick = () => render();
  opts.ticker?.add(tick);

  resize();

  function disposeMaterial(m: Material): void {
    for (const v of Object.values(m)) if (v instanceof Texture) v.dispose();
    m.dispose();
  }

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    opts.ticker?.remove(tick);
    ro.disconnect();
    io.disconnect();
    canvas.removeEventListener('webglcontextlost', onLost, false);
    canvas.removeEventListener('webglcontextrestored', onRestored, false);
    scene.traverse((o: Object3D) => {
      const mesh = o as Mesh;
      if (mesh.isMesh) {
        mesh.geometry.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach(disposeMaterial);
        else disposeMaterial(mat);
      }
    });
    scene.environment = null;
    envRT.dispose();
    scene.clear();
    renderer.renderLists.dispose();
    renderer.dispose();
    if (opts.forceContextLoss !== false) renderer.forceContextLoss();
  }

  return {
    setProgress,
    render,
    resize,
    dispose,
    renderer,
    get visible() {
      return visible;
    },
    get lost() {
      return lost;
    },
    get frames() {
      return frames;
    },
  };
}
