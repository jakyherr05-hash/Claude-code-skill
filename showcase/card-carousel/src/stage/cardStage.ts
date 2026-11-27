/**
 * WebGL card stage (pattern from the webgl-three skill's threeStage template).
 *
 * Draws the carousel cards as textured planes in ONE canvas, so a move only changes a few
 * matrices and uniforms per frame instead of re-compositing five large clipped DOM layers.
 *  - 1 unit = 1 CSS px; the camera reproduces the CSS `perspective` the poses were measured with,
 *  - rounded corners, the 1px light rim and the grey haze are drawn in the fragment shader,
 *  - textures are uploaded once (sRGB, mipmapped),
 *  - renders ON DEMAND from an external ticker (gsap.ticker): no own rAF, nothing drawn when idle,
 *  - DPR capped, ResizeObserver, IntersectionObserver pause, context loss, full dispose().
 * Lazy-load it: `await import('./stage/cardStage')`, so three.js never sits on the first paint.
 */
import {
  Color,
  LinearMipmapLinearFilter,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  WebGLRenderer,
} from 'three';

export type Ticker = { add(fn: () => void): unknown; remove(fn: () => void): unknown };

export interface CardPose {
  x: number; // CSS px from the stage centre
  scale: number;
  rotY: number; // degrees, CSS rotateY convention
  haze: number; // 0..1 veil opacity
  blur: number; // 0..1 of the measured side-card blur
  z: number; // paint order (higher = on top)
  visible: boolean;
  zoom: number; // image zoom inside the card (1 = fit)
}

export interface CardStage {
  /** Push the latest poses (one per card) and card size; draws on the next tick. */
  update(poses: CardPose[], cardPx: number, perspectivePx: number): void;
  render(): void;
  dispose(): void;
  readonly frames: number;
  readonly lost: boolean;
}

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D map;
  uniform float uRadius;  // corner radius, in card units (0..0.5)
  uniform float uRim;     // rim width, in card units (1 CSS px / card size)
  uniform float uHaze;    // grey veil opacity
  uniform float uZoom;
  uniform float uBlur;    // mip LOD bias for the side-card softness
  uniform vec3 uHazeColor;
  varying vec2 vUv;
  vec3 toSrgb(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
  vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
  void main() {
    vec2 p = vUv - 0.5;
    vec2 q = abs(p) - 0.5 + uRadius;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius; // signed distance to the rounded edge
    float aa = fwidth(d);
    float alpha = 1.0 - smoothstep(-aa, aa, d);
    if (alpha <= 0.0) discard;
    // Blend in sRGB like the browser does (the veil was measured on sRGB pixels: side = 0.78*front + 23).
    vec3 col = toSrgb(texture2D(map, (vUv - 0.5) / uZoom + 0.5, uBlur).rgb);
    col = mix(col, uHazeColor, uHaze);
    float rim = smoothstep(-uRim - aa, -uRim, d);       // 1 px band just inside the edge
    col = mix(col, vec3(1.0), 0.16 * rim);
    gl_FragColor = vec4(toLinear(col), alpha);
    #include <colorspace_fragment>
  }
`;

export async function createCardStage(
  canvas: HTMLCanvasElement,
  images: HTMLImageElement[],
  opts: { ticker: Ticker; maxDpr?: number; radius?: number },
): Promise<CardStage> {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const maxDpr = opts.maxDpr ?? 2;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 1, 100000);
  const geometry = new PlaneGeometry(1, 1);
  const hazeColor = new Color(200 / 255, 200 / 255, 206 / 255); // measured veil colour, kept as sRGB values (blended in sRGB)

  await Promise.all(images.map((im) => (im.complete && im.naturalWidth ? im.decode().catch(() => undefined) : new Promise((r) => { im.onload = r; im.onerror = r; }))));
  const textures = images.map((im) => {
    const t = new Texture(im);
    t.colorSpace = SRGBColorSpace;
    t.generateMipmaps = true;
    t.minFilter = LinearMipmapLinearFilter;
    t.magFilter = LinearFilter;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    t.needsUpdate = true;
    return t;
  });
  const materials = textures.map((map) => new ShaderMaterial({
    uniforms: {
      map: { value: map },
      uRadius: { value: opts.radius ?? 0.085 },
      uRim: { value: 0.003 },
      uHaze: { value: 0 },
      uZoom: { value: 1 },
      uBlur: { value: 0 },
      uHazeColor: { value: hazeColor },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: false, // paint order comes from the measured z, like the CSS version
    depthWrite: false,
  }));
  const meshes = materials.map((m) => {
    const mesh = new Mesh(geometry, m);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });
  // Upload every texture now, so the first move never stalls on a texture upload.
  textures.forEach((t) => renderer.initTexture(t));

  let dirty = true;
  let visible = true;
  let lost = false;
  let frames = 0;
  let size = { w: 0, h: 0 };

  function resize() {
    // Exact (fractional) CSS size: clientWidth/Height are rounded and would shift the cards by up to 0.5 px.
    const r = canvas.getBoundingClientRect();
    const w = r.width, h = r.height;
    if (!w || !h) return;
    size = { w, h };
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    renderer.setPixelRatio(1);
    renderer.setSize(Math.round(w * dpr), Math.round(h * dpr), false);
    applyCamera();
  }

  // CSS perspective P with its origin at the stage centre == a camera P px in front of the plane z=0
  // whose vertical field of view spans exactly the canvas height (so 1 unit = 1 CSS px at z=0).
  let perspective = 1000;
  function applyCamera() {
    if (!size.h) return;
    camera.position.set(0, 0, perspective);
    camera.aspect = size.w / size.h;
    camera.fov = (2 * Math.atan(size.h / 2 / perspective) * 180) / Math.PI;
    camera.updateProjectionMatrix();
    dirty = true;
  }

  function update(poses: CardPose[], cardPx: number, perspectivePx: number) {
    if (perspectivePx !== perspective) { perspective = perspectivePx; applyCamera(); }
    poses.forEach((p, i) => {
      const mesh = meshes[i];
      mesh.visible = p.visible;
      mesh.position.set(p.x, 0, 0);
      mesh.scale.set(cardPx * p.scale, cardPx * p.scale, 1);
      mesh.rotation.y = (p.rotY * Math.PI) / 180; // same sign as CSS rotateY (checked against the DOM render)
      mesh.renderOrder = p.z;
      const u = materials[i].uniforms;
      u.uHaze.value = p.haze;
      u.uZoom.value = p.zoom;
      u.uBlur.value = p.blur * 2.2; // ~4.5 source px of softness at the side slot
      u.uRim.value = 1 / Math.max(1, cardPx * p.scale);
    });
    dirty = true;
  }

  function render() {
    if (!dirty || !visible || lost) return;
    dirty = false;
    renderer.render(scene, camera);
    frames++;
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) dirty = true; });
  io.observe(canvas);
  const onLost = (e: Event) => { e.preventDefault(); lost = true; };
  const onRestored = () => { lost = false; textures.forEach((t) => { t.needsUpdate = true; }); dirty = true; };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  opts.ticker.add(render);
  resize();

  let disposed = false;
  return {
    update,
    render,
    get frames() { return frames; },
    get lost() { return lost; },
    dispose() {
      if (disposed) return;
      disposed = true;
      opts.ticker.remove(render);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
