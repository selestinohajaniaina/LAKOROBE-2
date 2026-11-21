// Calcul de la mise en page (sans Phaser) : testable et réutilisable.
//
//  Paysage :  [ plateau ]  [ SUIVANT ]
//                          [ IMAGE   ]
//  Portrait :  [ plateau ]
//              [ SUIVANT ][ IMAGE ]
//
// Le plateau est une zone de hauteur fixe : un espace libre en haut (où le
// bloc apparaît et tombe, DROP_ROWS cases de haut) puis la grille N x N.
// Plus N est grand, plus les cases sont petites.

import { DROP_ROWS } from "./boardLogic.js";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

export const FRAME_OVERHANG = 6; // le cadre dépasse de 6 px autour du plateau

export function computeLayout(W, H, N) {
  const B = FRAME_OVERHANG;
  const base = Math.min(W, H);
  const m = Math.round(clamp(base * 0.04, 10, 36));
  const headerH = Math.round(clamp(base * 0.09, 30, 56));
  const gap = Math.round(m * 0.8);
  const pad = Math.max(6, Math.round(m * 0.4));
  const portrait = H > W;

  const fonts = {
    title: Math.round(clamp(base * 0.05, 12, 28)),
    label: Math.round(clamp(base * 0.035, 10, 20)),
    overlay: Math.round(clamp(base * 0.07, 18, 44)),
    sub: Math.round(clamp(base * 0.035, 11, 22)),
  };

  const area = { x: m, y: m + headerH, w: W - 2 * m, h: H - 2 * m - headerH };

  let Z; // hauteur (et largeur max) de la zone du plateau
  let zone;
  let next;
  let image;

  if (!portrait) {
    Z = Math.max(60, Math.min(area.h - 2 * B, area.w * 0.55 - 2 * B));
    const cell = Z / (N + DROP_ROWS);
    const gridW = N * cell;
    zone = { x: area.x + B + (Z - gridW) / 2, y: area.y + B, w: gridW, h: Z };
    const colX = area.x + Z + 2 * B + gap;
    const colW = area.x + area.w - colX;
    const nextH = clamp(area.h * 0.3, 80, 220);
    next = { x: colX, y: area.y, w: colW, h: nextH };
    image = {
      x: colX,
      y: area.y + nextH + gap,
      w: colW,
      h: area.h - nextH - gap,
    };
  } else {
    Z = Math.max(60, Math.min(area.w - 2 * B, area.h * 0.62 - 2 * B));
    const cell = Z / (N + DROP_ROWS);
    const gridW = N * cell;
    zone = {
      x: area.x + (area.w - gridW) / 2,
      y: area.y + B,
      w: gridW,
      h: Z,
    };
    const py = area.y + Z + 2 * B + gap;
    const ph = Math.max(40, Math.min(area.y + area.h - py, area.w * 0.5));
    const nextW = (area.w - gap) * 0.38;
    next = { x: area.x, y: py, w: nextW, h: ph };
    image = { x: area.x + nextW + gap, y: py, w: area.w - nextW - gap, h: ph };
  }

  const cell = Z / (N + DROP_ROWS);
  const drop = { x: zone.x, y: zone.y, w: zone.w, h: DROP_ROWS * cell };
  const grid = {
    x: zone.x,
    y: zone.y + DROP_ROWS * cell,
    w: zone.w,
    h: N * cell,
  };

  const nextLabelH = Math.round(fonts.label * 1.5) + pad;
  const imageLabelH = Math.round(fonts.label * 2.6) + pad;
  const imageInner = {
    x: image.x + pad,
    y: image.y + imageLabelH,
    w: Math.max(0, image.w - 2 * pad),
    h: Math.max(0, image.h - imageLabelH - pad),
  };

  return {
    W,
    H,
    portrait,
    m,
    pad,
    gap,
    fonts,
    cell,
    zone,
    drop,
    grid,
    next,
    image,
    imageInner,
    nextLabelH,
    imageLabelH,
    title: { x: m, y: m + headerH / 2 },
    score: { x: W - m, y: m + headerH / 2 },
  };
}
