// Assembles the world either as ONE <svg> with a camera <g> (default) or, for cut-line 6, as one HTML wrapper
// <div> per depth plane, each holding its own <svg>, with the camera transform applied to the wrapper.
import { el, type Art, type PageArt } from './art';

export interface World {
  mode: 'svg' | 'div';
  wrap: HTMLElement;
  camEls: Element[];
  /** elements that `display` is set on for mounting a scene */
  mountTargets(scene: string): Element[];
  planeEl(id: string): Element;
}

export function assembleWorld(art: Art, page: PageArt, cut6: boolean, opts: { lite: boolean }): World {
  const { W, H } = art;
  const wrap = document.getElementById('worldwrap')!;
  const pageLayer = document.getElementById('page-layer')!;
  pageLayer.appendChild(page.svg);
  const vb = `${-W / 2} ${-H / 2} ${W} ${H}`;

  // shared defs (patterns, mask, panels) live in their own zero-size <svg>, never display:none
  const defsSvg = el('svg', { class: 'defs-svg', width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' });
  defsSvg.appendChild(art.defs);
  document.body.appendChild(defsSvg);

  const mountMap = new Map<string, Element[]>();
  const planeEls = new Map<string, Element>();
  const camEls: Element[] = [];

  if (!cut6) {
    const svg = el('svg', { class: 'world', viewBox: vb, preserveAspectRatio: 'xMidYMid slice', focusable: 'false' });
    const cam = el('g', { 'data-cam': '' }, svg);
    for (const p of art.planes) { cam.appendChild(p.g); planeEls.set(p.id, p.g); (mountMap.get(p.scene) ?? mountMap.set(p.scene, []).get(p.scene)!).push(p.g); }
    wrap.appendChild(svg);
    camEls.push(cam);
  } else {
    // Cut-line 6: one wrapper <div> per depth plane. The wrapper is sized to the plane's real world extent (its bbox, so the
    // compositor layer is honest about what it has to hold) and the camera transform is applied to the wrapper, with the
    // transform origin at the world origin (the stage centre at identity). Planes are measured once, attached, before wrapping.
    const probe = el('svg', { width: 10, height: 10, style: 'position:absolute;left:-9999px;top:0;visibility:hidden' });
    document.body.appendChild(probe);
    for (const p of art.planes) {
      probe.appendChild(p.g);
      const bb = p.g.getBBox();
      const pad = 8;
      const bx = Math.floor(bb.x - pad), by = Math.floor(bb.y - pad), bw = Math.ceil(bb.width + 2 * pad), bh = Math.ceil(bb.height + 2 * pad);
      const d = document.createElement('div');
      d.className = 'plane';
      d.dataset.cam = '';
      d.dataset.planeWrap = p.id;
      Object.assign(d.style, { left: `${W / 2 + bx}px`, top: `${H / 2 + by}px`, width: `${bw}px`, height: `${bh}px`, transformOrigin: `${-bx}px ${-by}px` });
      const svg = el('svg', { viewBox: `${bx} ${by} ${bw} ${bh}`, width: bw, height: bh, focusable: 'false' });
      svg.appendChild(p.g);
      d.appendChild(svg);
      wrap.appendChild(d);
      camEls.push(d);
      planeEls.set(p.id, p.g);
      (mountMap.get(p.scene) ?? mountMap.set(p.scene, []).get(p.scene)!).push(d);
    }
    probe.remove();
  }
  mountMap.set('7', [page.group]);
  void opts;
  return { mode: cut6 ? 'div' : 'svg', wrap, camEls, mountTargets: (s) => mountMap.get(s) ?? [], planeEl: (id) => planeEls.get(id)! };
}
