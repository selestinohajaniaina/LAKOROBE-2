const OUT = "#2a1530";

/* ---------- Outils ---------- */
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};
const oval = (ctx, x, y, rx, ry, rot = 0) => {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
};
const box = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};
const fillStroke = (ctx, fill, lw = 5) => {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = OUT;
  ctx.stroke();
};
const limb = (ctx, pts, width, fill) => {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.strokeStyle = OUT;
  ctx.lineWidth = width + 8;
  ctx.stroke();
  ctx.strokeStyle = fill;
  ctx.lineWidth = width;
  ctx.stroke();
};

/* ---------- Jambes et bras ---------- */
function leg(ctx, spec, stride, lift, far) {
  const hipX = 128;
  const hipY = 194;
  const fx = hipX + stride * 30;
  const fy = 238 - lift;
  const kx = (hipX + fx) / 2 + 12;
  const ky = (hipY + fy) / 2 - 2 - lift * 0.2;
  limb(ctx, [[hipX, hipY], [kx, ky], [fx, fy - 4]], 15,
    far ? shade(spec.pants, 0.8) : spec.pants);
  oval(ctx, fx + 6, fy, 13, 7);
  fillStroke(ctx, far ? shade(spec.shoes, 0.85) : spec.shoes, 4);
}

function arm(ctx, spec, swing, relaxed, far) {
  const sx = 128;
  const sy = 152;
  const ex = sx + swing * 20;
  const ey = sy + 26;
  const hx = relaxed ? ex + 2 : ex + 10 + swing * 8;
  const hy = relaxed ? ey + 20 : ey - 6 - swing * 10;
  const sleeve = far ? shade(spec.topColor, 0.78) : spec.topColor;
  const skin = far ? shade(spec.skin, 0.85) : spec.skin;
  limb(ctx, [[sx, sy], [ex, ey]], 15, sleeve);
  limb(ctx, [[ex, ey], [hx, hy]], 13, spec.sleeves === "long" ? sleeve : skin);
  oval(ctx, hx, hy, 9, 9);
  fillStroke(ctx, skin, 4);
}

/* ---------- Haut du corps (ajoutez-en ici) ---------- */
const torsoPath = (ctx) => box(ctx, 102, 140, 52, 58, 14);

const collar = (ctx, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(126, 140);
  ctx.lineTo(152, 140);
  ctx.lineTo(139, 156);
  ctx.closePath();
  ctx.fill();
};
const buttons = (ctx, color) => {
  ctx.fillStyle = color;
  [164, 176, 188].forEach((y) => {
    oval(ctx, 139, y, 2.5, 2.5);
    ctx.fill();
  });
};

const TOPS = {
  hoodie(ctx, s) {
    for (let y = 150, i = 0; y < 198; y += 7, i += 1) {
      ctx.fillStyle = i % 2 ? "#1c1c22" : "#f2f2f2";
      ctx.fillRect(126, y, 28, 7);
    }
    ctx.fillStyle = shade(s.topColor, 0.7);
    ctx.fillRect(122, 140, 4, 58);
  },
  shirt(ctx) {
    collar(ctx, "#e6f3ff");
    buttons(ctx, "#8aa8c8");
  },
  pattern(ctx) {
    ctx.strokeStyle = "#7aa5ff";
    ctx.lineWidth = 3;
    for (let i = -60; i < 80; i += 11) {
      ctx.beginPath();
      ctx.moveTo(100 + i, 140);
      ctx.lineTo(130 + i, 198);
      ctx.stroke();
    }
    collar(ctx, "#1f3aa0");
  },
  hawaii(ctx) {
    for (let r = 0; r < 4; r += 1)
      for (let c = 0; c < 4; c += 1) {
        oval(ctx, 108 + c * 14 + (r % 2) * 7, 152 + r * 13, 6, 2.8, (r + c) * 0.9);
        ctx.fillStyle = (r + c) % 3 ? "#6fcf8a" : "#e8a0c0";
        ctx.fill();
      }
    collar(ctx, "#3f6a58");
  },
  blazer(ctx, s) {
    ctx.fillStyle = s.innerColor;
    ctx.fillRect(124, 140, 22, 58);
    ctx.fillStyle = shade(s.topColor, 0.75);
    ctx.beginPath();
    ctx.moveTo(120, 140);
    ctx.lineTo(136, 140);
    ctx.lineTo(128, 172);
    ctx.closePath();
    ctx.fill();
  },
  dots(ctx) {
    ctx.fillStyle = "#b6bcc8";
    for (let y = 148; y < 198; y += 10)
      for (let x = 108 + ((y / 10) % 2) * 5; x < 154; x += 10) {
        oval(ctx, x, y, 2, 2);
        ctx.fill();
      }
    collar(ctx, "#9aa2ae");
  },
  polo(ctx) {
    collar(ctx, "#d9dce2");
    ctx.strokeStyle = "#8a909b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(139, 156);
    ctx.lineTo(139, 192);
    ctx.stroke();
    buttons(ctx, "#6a707b");
  },
};

function torso(ctx, spec) {
  if (spec.top === "hoodie") {
    oval(ctx, 112, 142, 16, 10);
    fillStroke(ctx, shade(spec.topColor, 0.85), 4);
  }
  torsoPath(ctx);
  fillStroke(ctx, spec.topColor, 5);
  ctx.save();
  torsoPath(ctx);
  ctx.clip();
  TOPS[spec.top]?.(ctx, spec);
  ctx.restore();
  torsoPath(ctx);
  ctx.lineWidth = 5;
  ctx.strokeStyle = OUT;
  ctx.stroke();
}

/* ---------- Cheveux (ajoutez-en ici) ---------- */
const HAIR = {
  afro: {
    back(ctx, c) {
      oval(ctx, 120, 66, 54, 44);
      fillStroke(ctx, c, 5);
    },
    front(ctx, c) {
      oval(ctx, 134, 60, 38, 14);
      ctx.fillStyle = c;
      ctx.fill();
    },
  },
  curly: {
    back(ctx, c) {
      oval(ctx, 122, 68, 46, 38);
      fillStroke(ctx, c, 5);
      [[96, 70], [110, 48], [134, 42], [156, 52]].forEach(([x, y]) => {
        oval(ctx, x, y, 14, 14);
        fillStroke(ctx, c, 5);
      });
    },
    front(ctx, c) {
      oval(ctx, 134, 62, 38, 14);
      ctx.fillStyle = c;
      ctx.fill();
    },
  },
  short: {
    front(ctx, c) {
      oval(ctx, 134, 64, 42, 20);
      fillStroke(ctx, c, 4);
    },
  },
  buzz: {
    front(ctx, c) {
      oval(ctx, 134, 66, 40, 17);
      fillStroke(ctx, c, 3);
    },
  },
  bald: {
    front(ctx) {
      oval(ctx, 120, 66, 8, 4, -0.4);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fill();
    },
  },
};

function glasses(ctx, spec) {
  ctx.strokeStyle = spec.glassColor ?? "#2a2a33";
  ctx.lineWidth = spec.glasses === "square" ? 4 : 2.5;
  [[148, 95], [167, 94]].forEach(([x, y]) => {
    if (spec.glasses === "round") oval(ctx, x, y, 9.5, 9.5);
    else box(ctx, x - 9.5, y - 8, 19, 16, 4);
    ctx.fillStyle = "rgba(190,220,255,0.28)";
    ctx.fill();
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(138, 95);
  ctx.lineTo(113, 92);
  ctx.stroke();
}

function bucketHat(ctx, color) {
  box(ctx, 106, 30, 62, 40, 16);
  fillStroke(ctx, color, 5);
  box(ctx, 106, 58, 62, 9, 3);
  fillStroke(ctx, shade(color, 0.75), 3);
  oval(ctx, 138, 72, 66, 13);
  fillStroke(ctx, color, 5);
  ctx.strokeStyle = shade(color, 0.7);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(118, 82);
  ctx.quadraticCurveTo(116, 106, 126, 124);
  ctx.stroke();
}

function head(ctx, spec) {
  const hair = HAIR[spec.hairStyle];
  hair?.back?.(ctx, spec.hair);

  oval(ctx, 177, 101, 6, 5); // nez
  fillStroke(ctx, spec.skin, 4);
  oval(ctx, 134, 90, 40, 38); // visage
  fillStroke(ctx, spec.skin, 5);
  oval(ctx, 113, 97, 6, 9); // oreille
  fillStroke(ctx, shade(spec.skin, 0.85), 3);

  if (spec.beard) {
    ctx.save();
    oval(ctx, 134, 90, 40, 38);
    ctx.clip();
    ctx.globalAlpha = 0.5;
    oval(ctx, 146, 118, 32, 22);
    ctx.fillStyle = spec.hair;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (spec.beard === "goatee") {
      oval(ctx, 160, 122, 9, 8);
      ctx.fill();
    }
    ctx.restore();
  }
  if (spec.mustache) {
    oval(ctx, 166, 106, 9, 3.5);
    ctx.fillStyle = spec.hair;
    ctx.fill();
  }

  ctx.strokeStyle = OUT; // bouche
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(153, 111);
  ctx.quadraticCurveTo(161, 117, 170, 110);
  ctx.stroke();

  [[148, 95, 3.5, 5], [166, 94, 3, 4.5]].forEach(([x, y, rx, ry]) => {
    oval(ctx, x, y, rx, ry); // yeux
    ctx.fillStyle = "#1a0f14";
    ctx.fill();
  });

  hair?.front?.(ctx, spec.hair);

  ctx.strokeStyle = spec.hair; // sourcils
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(141, 84);
  ctx.lineTo(154, 83);
  ctx.moveTo(161, 83);
  ctx.lineTo(173, 84);
  ctx.stroke();

  if (spec.glasses) glasses(ctx, spec);
  if (spec.hat) bucketHat(ctx, spec.hat);
}

/* ---------- Dessin complet d'une frame ---------- */
export function drawHuman(ctx, spec, pose) {
  const relaxed = pose.stride === 0 && pose.tuck === 0 && pose.tilt === 0;
  const liftOf = (s) => Math.max(0, -s) * 16 + pose.tuck * 12;

  leg(ctx, spec, -pose.stride, liftOf(-pose.stride), true);

  ctx.save();
  ctx.translate(128, 196 + pose.bob);
  ctx.rotate(pose.tilt);
  ctx.translate(-128, -196);

  arm(ctx, spec, pose.stride, relaxed, true);
  if (spec.backpack) {
    box(ctx, 82, 148, 30, 46, 9);
    fillStroke(ctx, spec.backpack, 5);
    box(ctx, 88, 160, 18, 14, 4);
    fillStroke(ctx, shade(spec.backpack, 0.7), 3);
  }
  box(ctx, 121, 122, 22, 24, 6); // cou
  fillStroke(ctx, spec.neckColor ?? shade(spec.skin, 0.9), 4);
  torso(ctx, spec);
  if (spec.backpack) limb(ctx, [[116, 144], [118, 192]], 6, shade(spec.backpack, 1.3));
  head(ctx, spec);
  arm(ctx, spec, -pose.stride, relaxed, false);

  ctx.restore();
  leg(ctx, spec, pose.stride, liftOf(pose.stride), false);
}

/* ---------- Les 7 personnages (modifiez librement) ---------- */
export const HUMANS = [
  {
    id: "noah", name: "NOAH", skin: "#a5683f", hair: "#1e1412", hairStyle: "curly",
    glasses: "square", top: "hoodie", topColor: "#e5483f", sleeves: "long",
    pants: "#2f3a55", shoes: "#241a26", backpack: "#2a2a30",
  },
  {
    id: "leo", name: "LEO", skin: "#6b3f28", hair: "#150e0c", hairStyle: "afro",
    top: "shirt", topColor: "#bfe0ff", sleeves: "long",
    pants: "#2a3350", shoes: "#241a26", backpack: "#2f4a78",
  },
  {
    id: "sam", name: "SAM", skin: "#a8643a", hair: "#2a1a12", mustache: true,
    hat: "#c9b98c", top: "pattern", topColor: "#2a4fc0", sleeves: "long",
    pants: "#262c45", shoes: "#241a26",
  },
  {
    id: "max", name: "MAX", skin: "#8a4f31", hair: "#140d0b", hairStyle: "short",
    top: "blazer", topColor: "#7a1f2e", innerColor: "#1f4a3a", neckColor: "#1f4a3a",
    sleeves: "long", pants: "#1f3a30", shoes: "#1c1620",
  },
  {
    id: "tom", name: "TOM", skin: "#9a5a35", hair: "#1a110e", hairStyle: "short",
    glasses: "thin", glassColor: "#8a8f9a", top: "hawaii", topColor: "#1f3a33",
    sleeves: "short", pants: "#464c5a", shoes: "#241a26",
  },
  {
    id: "ari", name: "ARI", skin: "#a8633c", hair: "#2a1c16", hairStyle: "buzz",
    beard: "goatee", top: "dots", topColor: "#7f8794", sleeves: "short",
    pants: "#262b3a", shoes: "#241a26",
  },
  {
    id: "ben", name: "BEN", skin: "#a8663f", hair: "#2a1c16", hairStyle: "bald",
    glasses: "round", glassColor: "#1c1c22", beard: "stubble", top: "polo",
    topColor: "#b9bdc4", sleeves: "short", pants: "#2a2f3e", shoes: "#241a26",
  },
];