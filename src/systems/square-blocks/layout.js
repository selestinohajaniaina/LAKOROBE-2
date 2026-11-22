// Calcul de la mise en page (sans Phaser) : testable et réutilisable.
//
//  Paysage :  [ plateau ]  [ SUIVANT  ]
//                          [ IMAGE    ]
//                          [ BOUTONS  ]
//  Portrait :  [ plateau ]
//              [ SUIVANT ][ IMAGE ]
//              [ BOUTONS          ]
//
// La rangée de boutons a sa place fixe (vide pendant la partie, les boutons
// n'apparaissent qu'à la fin du niveau) : aucune fenêtre ne recouvre le plateau.
//
// Le plateau est une zone de hauteur fixe : un espace libre en haut (où le
// bloc apparaît et tombe, DROP_ROWS cases de haut) puis la grille N x N.
// Plus N est grand, plus les cases sont petites.

import { DROP_ROWS } from "./boardLogic.js";

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

export const FRAME_OVERHANG = 6; // le cadre dépasse de 6 px autour du plateau

export function computeLayout(W, H, rows, columns = rows, gridAspect = 1) {
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

  // Pied de page : une seule rangée, réservée aux boutons de fin de niveau.
  const btnH = Math.max(36, Math.round(fonts.label * 2.4));
  const footerH = btnH;

  // Rapport largeur / hauteur d'une case. Pour un puzzle image, il est choisi
  // pour que la grille complète garde exactement le rapport de la photo.
  const cellAspect = (gridAspect * rows) / columns;
  const zoneAspect = (columns * cellAspect) / (rows + DROP_ROWS);
  let zoneH;
  let zoneW;
  let zone;
  let next;
  let image;
  let buttons;

  if (!portrait) {
    const reservation = area.w * 0.55 - 2 * B;
    zoneH = Math.max(
      60,
      Math.min(area.h - 2 * B, reservation, reservation / zoneAspect)
    );
    zoneW = zoneH * zoneAspect;
    zone = {
      x: area.x + B + (reservation - zoneW) / 2,
      y: area.y + B,
      w: zoneW,
      h: zoneH,
    };
    const colX = area.x + reservation + 2 * B + gap;
    const colW = area.x + area.w - colX;
    const nextH = clamp(area.h * 0.26, 70, 180);
    const footerY = area.y + area.h - footerH;
    const imageY = area.y + nextH + gap;
    next = { x: colX, y: area.y, w: colW, h: nextH };
    image = {
      x: colX,
      y: imageY,
      w: colW,
      h: Math.max(40, footerY - gap - imageY),
    };
    buttons = { x: colX, y: footerY, w: colW, h: btnH };
  } else {
    const footerY = area.y + area.h - footerH;
    const available = footerY - gap - area.y;
    const maxH = Math.min(area.w - 2 * B, available * 0.64 - 2 * B);
    zoneH = Math.max(60, Math.min(maxH, (area.w - 2 * B) / zoneAspect));
    zoneW = zoneH * zoneAspect;
    zone = {
      x: area.x + (area.w - zoneW) / 2,
      y: area.y + B,
      w: zoneW,
      h: zoneH,
    };
    const py = area.y + zoneH + 2 * B + gap;
    const ph = Math.max(40, Math.min(footerY - gap - py, area.w * 0.5));
    const nextW = (area.w - gap) * 0.38;
    next = { x: area.x, y: py, w: nextW, h: ph };
    image = { x: area.x + nextW + gap, y: py, w: area.w - nextW - gap, h: ph };
    buttons = { x: area.x, y: footerY, w: area.w, h: btnH };
  }

  const cellH = zoneH / (rows + DROP_ROWS);
  const cellW = zoneW / columns;
  const drop = { x: zone.x, y: zone.y, w: zone.w, h: DROP_ROWS * cellH };
  const grid = {
    x: zone.x,
    y: zone.y + DROP_ROWS * cellH,
    w: zone.w,
    h: rows * cellH,
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
    cell: Math.min(cellW, cellH),
    cellW,
    cellH,
    zone,
    drop,
    grid,
    next,
    image,
    buttons,
    imageInner,
    nextLabelH,
    imageLabelH,
    title: { x: m, y: m + headerH / 2 },
    score: { x: W - m, y: m + headerH / 2 },
  };
}
