import { HUMANS, drawHuman } from "./humanSprites";

const CELL = 256; // taille d'une frame dessinée
const COLS = 6;
const OUT = "#2d0026"; // contour
const STORAGE_KEY = "runner-character";

const DEFAULT_PALETTE = {
  face: "#300028",
  eye: "#ffffff",
  cloak: "#8b3f1f",
  cloakShade: "#5e2a16",
  accent: "#f0ad2f",
  accent2: "#8a4a22",
  leaf: "#6f8f1a",
  screen: "#1a2433", // écran du robot
};

/* ---------- Outils de dessin ---------- */
const paint = (ctx, fill, lw = 7) => {
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = lw;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = OUT;
  ctx.stroke();
};
const ellipse = (ctx, x, y, rx, ry, rot = 0) => {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
};
const rrect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

/* ---------- Corps (ajoutez-en ici) ---------- */
const OUTFITS = {
  cloak(ctx, p) {
    ctx.beginPath();
    ctx.moveTo(104, 138);
    ctx.quadraticCurveTo(82, 170, 70, 200);
    ctx.quadraticCurveTo(66, 220, 88, 222);
    ctx.quadraticCurveTo(100, 228, 112, 220);
    ctx.quadraticCurveTo(128, 230, 144, 220);
    ctx.quadraticCurveTo(158, 228, 170, 222);
    ctx.quadraticCurveTo(190, 218, 186, 200);
    ctx.quadraticCurveTo(178, 170, 154, 138);
    ctx.closePath();
    paint(ctx, p.cloak);
    ctx.strokeStyle = p.cloakShade;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(96, 204);
    ctx.lineTo(100, 214);
    ctx.moveTo(150, 200);
    ctx.lineTo(156, 212);
    ctx.stroke();
    ellipse(ctx, 129, 158, 11, 7);
    ctx.lineWidth = 4;
    ctx.stroke();
  },
  robot(ctx, p) {
    rrect(ctx, 118, 130, 20, 12, 3); // cou
    paint(ctx, p.cloakShade, 4);
    rrect(ctx, 93, 140, 70, 64, 12); // torse
    paint(ctx, p.cloak);
    rrect(ctx, 105, 152, 46, 28, 7); // panneau
    paint(ctx, p.cloakShade, 4);
    [
      [116, p.accent],
      [128, p.accent2],
      [140, p.leaf],
    ].forEach(([x, c]) => {
      ellipse(ctx, x, 166, 4.5, 4.5);
      ctx.fillStyle = c;
      ctx.fill();
    });
    [
      [100, 148],
      [156, 148],
      [100, 196],
      [156, 196],
    ].forEach(([x, y]) => {
      ellipse(ctx, x, y, 3, 3);
      ctx.fillStyle = p.accent2;
      ctx.fill();
    });
  },
};

/* ---------- Visages (ajoutez-en ici) ---------- */
const FACES = {
  round(ctx, p) {
    ellipse(ctx, 128, 108, 42, 38);
    paint(ctx, p.face);
    [111, 147].forEach((x) => {
      ellipse(ctx, x, 112, 5.5, 9);
      ctx.fillStyle = p.eye;
      ctx.fill();
    });
  },
  robot(ctx, p) {
    rrect(ctx, 84, 72, 88, 68, 16); // tête métallique
    paint(ctx, p.face);
    rrect(ctx, 94, 84, 68, 46, 10); // écran
    paint(ctx, p.screen, 4);
    [104, 136].forEach((x) => {
      rrect(ctx, x, 96, 16, 20, 4); // yeux carrés lumineux
      ctx.fillStyle = p.eye;
      ctx.fill();
    });
    ctx.strokeStyle = p.eye;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(114, 124);
    ctx.lineTo(142, 124);
    ctx.stroke();
  },
};

/* ---------- Têtes (ajoutez-en ici) ---------- */
const HEADS = {
  witch(ctx, p) {
    ellipse(ctx, 152, 44, 20, 10, -0.5);
    paint(ctx, p.leaf, 5);
    ctx.beginPath();
    ctx.moveTo(88, 78);
    ctx.lineTo(70, 32);
    ctx.quadraticCurveTo(120, 40, 166, 70);
    ctx.lineTo(170, 84);
    ctx.closePath();
    paint(ctx, p.accent);
    ctx.beginPath();
    ctx.moveTo(90, 72);
    ctx.quadraticCurveTo(128, 52, 168, 70);
    ctx.lineTo(170, 84);
    ctx.quadraticCurveTo(128, 66, 92, 86);
    ctx.closePath();
    paint(ctx, p.accent2, 4);
    ellipse(ctx, 132, 80, 64, 16, -0.12);
    paint(ctx, p.accent);
  },
  cat(ctx, p) {
    const ear = (s) => {
      const m = (x) => 128 + s * (x - 128);
      ctx.beginPath();
      ctx.moveTo(m(92), 86);
      ctx.lineTo(m(86), 34);
      ctx.lineTo(m(124), 68);
      ctx.closePath();
      paint(ctx, p.face);
      ctx.beginPath();
      ctx.moveTo(m(96), 76);
      ctx.lineTo(m(93), 48);
      ctx.lineTo(m(114), 68);
      ctx.closePath();
      ctx.fillStyle = p.accent;
      ctx.fill();
    };
    ear(1);
    ear(-1);
    ctx.beginPath();
    ctx.moveTo(122, 124);
    ctx.lineTo(134, 124);
    ctx.lineTo(128, 131);
    ctx.closePath();
    ctx.fillStyle = p.accent;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    [-1, 1].forEach((s) => {
      ctx.moveTo(128 + s * 32, 126);
      ctx.lineTo(128 + s * 56, 120);
      ctx.moveTo(128 + s * 32, 132);
      ctx.lineTo(128 + s * 56, 136);
    });
    ctx.stroke();
  },
  crown(ctx, p) {
    ctx.beginPath();
    ctx.moveTo(90, 76);
    ctx.lineTo(88, 40);
    ctx.lineTo(110, 58);
    ctx.lineTo(128, 34);
    ctx.lineTo(146, 58);
    ctx.lineTo(168, 40);
    ctx.lineTo(166, 76);
    ctx.closePath();
    paint(ctx, p.accent);
    ctx.fillStyle = p.accent2;
    ctx.fillRect(90, 66, 76, 10);
    [
      [128, 55, "#e63946"],
      [104, 71, "#3b82f6"],
      [152, 71, "#3b82f6"],
    ].forEach(([x, y, c]) => {
      ellipse(ctx, x, y, 5, 5);
      ctx.fillStyle = c;
      ctx.fill();
    });
  },
  sprout(ctx, p) {
    ctx.lineCap = "round";
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(128, 76);
    ctx.lineTo(128, 48);
    ctx.stroke();
    ctx.strokeStyle = p.leaf;
    ctx.lineWidth = 6;
    ctx.stroke();
    ellipse(ctx, 108, 42, 20, 10, -0.5);
    paint(ctx, p.leaf, 5);
    ellipse(ctx, 148, 38, 20, 10, 0.5);
    paint(ctx, p.accent, 5);
  },
  antenna(ctx, p) {
    ctx.lineCap = "round";
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(128, 72);
    ctx.lineTo(128, 46);
    ctx.stroke();
    ctx.strokeStyle = p.cloakShade;
    ctx.lineWidth = 4;
    ctx.stroke();
    ellipse(ctx, 128, 38, 9, 9);
    paint(ctx, p.accent, 5);
    [74, 168].forEach((x) => {
      rrect(ctx, x, 96, 14, 26, 5); // boulons d'oreilles
      paint(ctx, p.accent2, 4);
    });
  },
};

/* ---------- Poses : 11 frames (idle 0-1, run 2-5, jump 6-8, fall 9-10) ---------- */
const POSES = [
  { bob: 0, tilt: 0, stride: 0, tuck: 0 },
  { bob: 3, tilt: 0, stride: 0, tuck: 0 },
  { bob: 0, tilt: 0.06, stride: 1, tuck: 0 },
  { bob: -5, tilt: 0.06, stride: 0.2, tuck: 0.5 },
  { bob: 0, tilt: 0.06, stride: -1, tuck: 0 },
  { bob: -5, tilt: 0.06, stride: -0.2, tuck: 0.5 },
  { bob: 4, tilt: 0.05, stride: 0, tuck: 0 },
  { bob: -4, tilt: 0.08, stride: 0.3, tuck: 0.8 },
  { bob: -8, tilt: 0.1, stride: 0.5, tuck: 1 },
  { bob: -4, tilt: -0.04, stride: 0.6, tuck: 0.4 },
  { bob: 0, tilt: -0.06, stride: 0.8, tuck: 0.1 },
];

const ANIMATIONS = [
  { name: "idle", frames: [0, 1], frameRate: 2, repeat: -1 },
  { name: "run", frames: [2, 3, 4, 5], frameRate: 11, repeat: -1 },
  { name: "jump", frames: [6, 7, 8], frameRate: 12, repeat: 0 },
  { name: "fall", frames: [9, 10], frameRate: 12, repeat: 0 },
];

function drawLegs(ctx, pose) {
  const legs = [
    {
      hip: 112,
      dx: pose.stride * 20,
      lift: Math.max(0, -pose.stride) * 14 + pose.tuck * 14,
    },
    {
      hip: 146,
      dx: -pose.stride * 20,
      lift: Math.max(0, pose.stride) * 14 + pose.tuck * 14,
    },
  ];
  ctx.strokeStyle = OUT;
  ctx.fillStyle = OUT;
  ctx.lineCap = "round";
  ctx.lineWidth = 14;
  legs.forEach(({ hip, dx, lift }) => {
    const fx = hip + dx;
    const fy = 238 - lift;
    ctx.beginPath();
    ctx.moveTo(hip, 205);
    ctx.lineTo(fx, fy);
    ctx.stroke();
    ellipse(ctx, fx + 5, fy + 3, 11, 6);
    ctx.fill();
  });
}

function drawCharacter(ctx, character, pose) {
  if (character.human) {
    drawHuman(ctx, character.human, pose);
    return;
  }
  const p = { ...DEFAULT_PALETTE, ...character.palette };
  drawLegs(ctx, pose);
  ctx.save();
  ctx.translate(128, 214 + pose.bob);
  ctx.rotate(pose.tilt);
  ctx.translate(-128, -214);
  OUTFITS[character.outfit](ctx, p);
  FACES[character.face ?? "round"](ctx, p);
  HEADS[character.head](ctx, p);
  ctx.restore();
}

/* ---------- Liste des personnages ---------- */
const procedural = (id, name, head, palette, extra = {}) => ({
  id,
  name,
  type: "procedural",
  texture: `char-${id}`,
  head,
  outfit: "cloak",
  face: "round",
  frame: CELL,
  scale: 0.36,
  hitbox: { w: 105, h: 212, x: 75, y: 35 },
  palette,
  ...extra,
});

const human = (spec) => ({
  id: spec.id,
  name: spec.name,
  type: "procedural",
  texture: `char-${spec.id}`,
  human: spec,
  frame: CELL,
  scale: 0.36,
  hitbox: { w: 84, h: 204, x: 86, y: 40 },
});

export const CHARACTERS = [
  {
    id: "person-1", // sprite d'origine (images)
    name: "ORIGINAL",
    type: "image",
    texture: "person-1-idle",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 425, x: 151, y: 70 },
  },
  procedural("purple-witch", "PURPLE WITCH", "witch", {
    cloak: "#5b2a8a",
    cloakShade: "#3a1a5a",
    accent: "#8a4fd0",
    accent2: "#4a2a7a",
    leaf: "#7bd36a",
  }),
  procedural("cat", "CAT", "cat", {
    cloak: "#2f6fd0",
    cloakShade: "#1f4a96",
    accent: "#f08aa8",
  }),
  procedural("king", "KING", "crown", {
    cloak: "#b3263a",
    cloakShade: "#7a1a28",
    accent: "#f5c518",
    accent2: "#d99a10",
  }),
  procedural("sprout", "SPROUT", "sprout", {
    cloak: "#3f8f4a",
    cloakShade: "#2a6234",
    accent: "#9be36a",
    leaf: "#4fb04a",
  }),
  procedural(
    "bob",
    "BOB",
    "antenna",
    {
      face: "#9fb0c0",
      screen: "#16202e",
      eye: "#6ff2ff",
      cloak: "#5f7a94",
      cloakShade: "#3d5166",
      accent: "#ff7a1a",
      accent2: "#34495e",
      leaf: "#4ade80",
    },
    { outfit: "robot", face: "robot", hitbox: { w: 92, h: 208, x: 82, y: 38 } }
  ),
  ...HUMANS.map(human),
];

/* ---------- Création des textures et animations ---------- */
export function createCharacterTextures(scene) {
  CHARACTERS.filter((c) => c.type === "procedural").forEach((character) => {
    if (scene.textures.exists(character.texture)) return;
    const rows = Math.ceil(POSES.length / COLS);
    const texture = scene.textures.createCanvas(
      character.texture,
      CELL * COLS,
      CELL * rows
    );
    const ctx = texture.getContext();
    POSES.forEach((pose, i) => {
      const x = (i % COLS) * CELL;
      const y = Math.floor(i / COLS) * CELL;
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.rect(0, 0, CELL, CELL);
      ctx.clip();
      drawCharacter(ctx, character, pose);
      ctx.restore();
      texture.add(i, 0, x, y, CELL, CELL);
    });
    texture.refresh();
  });
}

export function createCharacterAnimations(scene) {
  CHARACTERS.filter((c) => c.type === "procedural").forEach((character) => {
    ANIMATIONS.forEach(({ name, frames, frameRate, repeat }) => {
      const key = `${character.id}-${name}`;
      if (scene.anims.exists(key)) return;
      scene.anims.create({
        key,
        frames: frames.map((frame) => ({ key: character.texture, frame })),
        frameRate,
        repeat,
      });
    });
  });
}

/* ---------- Mémorisation du choix ---------- */
export function loadCharacterIndex() {
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    const index = CHARACTERS.findIndex((c) => c.id === id);
    return index >= 0 ? index : 0;
  } catch {
    return 0;
  }
}

export function saveCharacterId(id) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* stockage indisponible : on ignore */
  }
}
