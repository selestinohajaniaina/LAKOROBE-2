const make = (scene, key, w, h, draw) => {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ add: false });
  draw(g);
  g.generateTexture(key, w, h);
  g.destroy();
};

const wheel = (g, x, y) =>
  g.fillStyle(0x1c1c1c).fillCircle(x, y, 8).fillStyle(0xaaaaaa).fillCircle(x, y, 3);

function desert(s) {
  make(s, "desert-cactus", 44, 70, (g) => {
    g.fillStyle(0x2f7a3a).fillRoundedRect(15, 2, 14, 68, 7);
    g.fillRoundedRect(1, 34, 18, 8, 4).fillRoundedRect(1, 18, 9, 24, 4);
    g.fillRoundedRect(25, 26, 18, 8, 4).fillRoundedRect(34, 12, 9, 22, 4);
    g.fillStyle(0x56a352).fillRect(19, 8, 4, 58);
    g.fillStyle(0xf3e7a0).fillRect(12, 20, 2, 2).fillRect(30, 30, 2, 2).fillRect(16, 50, 2, 2);
  });
  make(s, "desert-camel", 104, 76, (g) => {
    g.fillStyle(0xb98a45).fillRect(22, 48, 7, 28).fillRect(36, 48, 7, 28);
    g.fillRect(56, 48, 7, 28).fillRect(68, 48, 7, 28);
    g.fillStyle(0xd1a35c).fillRoundedRect(14, 26, 62, 28, 12);
    g.fillCircle(34, 24, 13).fillCircle(56, 24, 13);
    g.fillRoundedRect(70, 10, 12, 34, 6).fillRoundedRect(72, 6, 28, 15, 6);
    g.fillStyle(0xb98a45).fillRect(8, 30, 6, 22);
    g.fillStyle(0x3a2a1a).fillCircle(90, 11, 2);
  });
  make(s, "desert-rock", 56, 34, (g) => {
    g.fillStyle(0xa8794a).fillTriangle(2, 32, 22, 6, 36, 32).fillTriangle(20, 32, 40, 2, 54, 32);
    g.fillStyle(0xd1a46c).fillTriangle(8, 30, 22, 10, 28, 30);
    g.fillStyle(0xe6c28b).fillTriangle(30, 26, 40, 8, 46, 26);
  });
  make(s, "desert-palm", 130, 230, (g) => {
    g.fillStyle(0x7a4e2a).fillRect(60, 64, 12, 166);
    g.fillStyle(0x9a6a3c).fillRect(64, 66, 4, 164);
    g.fillStyle(0x4b3320);
    for (let y = 84; y < 224; y += 22) g.fillRect(60, y, 12, 3);
    g.fillStyle(0x2f8a3a);
    g.fillTriangle(66, 58, 2, 78, 36, 40).fillTriangle(66, 58, 128, 78, 96, 40);
    g.fillTriangle(66, 58, 8, 104, 28, 66).fillTriangle(66, 58, 124, 104, 104, 66);
    g.fillTriangle(66, 58, 54, 6, 78, 6);
    g.fillStyle(0x58b04a).fillTriangle(66, 58, 40, 36, 58, 56).fillTriangle(66, 58, 92, 36, 74, 56);
    g.fillStyle(0x5a3a22).fillCircle(60, 64, 5).fillCircle(72, 64, 5);
  });
  make(s, "desert-tent", 160, 96, (g) => {
    g.fillStyle(0xd9b27a).fillTriangle(80, 4, 4, 96, 156, 96);
    g.fillStyle(0xb5453a).fillTriangle(80, 4, 40, 96, 60, 96).fillTriangle(80, 4, 100, 96, 120, 96);
    g.fillStyle(0x4a2c1a).fillTriangle(80, 38, 56, 96, 104, 96);
    g.fillStyle(0x6b4a2a).fillRect(79, 0, 3, 12);
  });
  make(s, "desert-bush", 56, 30, (g) => {
    g.fillStyle(0xb59a4a).fillTriangle(2, 30, 10, 8, 18, 30).fillTriangle(14, 30, 26, 2, 38, 30);
    g.fillTriangle(32, 30, 44, 10, 54, 30);
  });
  make(s, "desert-ledge", 190, 24, (g) => {
    g.fillStyle(0xb9803a).fillRoundedRect(0, 0, 190, 20, 6);
    g.fillStyle(0xefc377).fillRect(6, 0, 178, 7);
    g.fillStyle(0x8f5f28).fillRect(30, 11, 18, 3).fillRect(110, 13, 26, 3);
  });
}

function snow(s) {
  make(s, "snow-pine", 130, 230, (g) => {
    g.fillStyle(0x5b3a22).fillRect(58, 176, 14, 54);
    g.fillStyle(0x1f5a4a).fillTriangle(65, 8, 28, 92, 102, 92);
    g.fillTriangle(65, 56, 16, 140, 114, 140).fillTriangle(65, 104, 4, 188, 126, 188);
    g.fillStyle(0x2e7d62).fillTriangle(65, 24, 46, 80, 84, 80);
    g.fillStyle(0xf4faff).fillTriangle(65, 8, 50, 38, 80, 38);
    g.fillTriangle(65, 56, 44, 90, 86, 90).fillTriangle(65, 104, 36, 142, 94, 142);
    g.fillCircle(24, 186, 10).fillCircle(106, 186, 10);
  });
  make(s, "snow-snowman", 56, 86, (g) => {
    g.fillStyle(0x6b4a2a).fillRect(2, 34, 14, 3).fillRect(40, 32, 14, 3);
    g.fillStyle(0xf7fbff).fillCircle(28, 64, 22).fillCircle(28, 36, 16).fillCircle(28, 16, 12);
    g.fillStyle(0xd84e32).fillRect(16, 27, 24, 5);
    g.fillStyle(0x222222).fillCircle(24, 14, 2).fillCircle(32, 14, 2).fillCircle(28, 44, 2).fillCircle(28, 54, 2);
    g.fillStyle(0xf08a24).fillTriangle(28, 17, 44, 19, 28, 21);
  });
  make(s, "snow-igloo", 150, 84, (g) => {
    g.fillStyle(0xeaf6ff).fillCircle(75, 84, 68);
    g.lineStyle(2, 0xb7d4ea).lineBetween(20, 60, 130, 60).lineBetween(34, 38, 116, 38).lineBetween(55, 18, 95, 18);
    g.lineBetween(50, 60, 50, 38).lineBetween(100, 60, 100, 38).lineBetween(75, 38, 75, 18);
    g.fillStyle(0xd7ebfa).fillRoundedRect(46, 52, 58, 32, 12);
    g.fillStyle(0x3b4b63).fillRoundedRect(58, 56, 34, 28, 12);
  });
  make(s, "snow-husky", 84, 52, (g) => {
    g.fillStyle(0xdfe5ea).fillTriangle(12, 18, 0, 6, 8, 24);
    g.fillStyle(0x8d97a3).fillRect(18, 36, 7, 16).fillRect(30, 36, 7, 16).fillRect(44, 36, 7, 16).fillRect(54, 36, 7, 16);
    g.fillRoundedRect(12, 14, 50, 24, 10).fillCircle(68, 18, 12);
    g.fillTriangle(60, 12, 62, 0, 68, 8).fillTriangle(68, 8, 74, 0, 76, 12);
    g.fillStyle(0xf2f5f8).fillRoundedRect(18, 28, 40, 10, 5).fillCircle(72, 22, 7).fillRoundedRect(72, 19, 12, 8, 3);
    g.fillStyle(0x222222).fillRect(81, 19, 3, 3).fillCircle(70, 15, 2);
  });
  make(s, "snow-spikes", 52, 46, (g) => {
    g.fillStyle(0x9fd8f2).fillTriangle(4, 46, 16, 12, 28, 46).fillTriangle(22, 46, 32, 2, 44, 46);
    g.fillTriangle(38, 46, 46, 18, 52, 46);
    g.fillStyle(0xdff4ff).fillTriangle(14, 40, 16, 18, 20, 40).fillTriangle(30, 40, 32, 10, 35, 40);
  });
  make(s, "snow-rock", 60, 34, (g) => {
    g.fillStyle(0x6d7a96).fillTriangle(2, 32, 22, 6, 38, 32).fillTriangle(20, 32, 40, 2, 58, 32);
    g.fillStyle(0xf4faff).fillTriangle(15, 16, 22, 6, 30, 16).fillTriangle(34, 12, 40, 2, 47, 14);
  });
  make(s, "snow-ledge", 190, 24, (g) => {
    g.fillStyle(0xa5d8f0).fillRoundedRect(0, 0, 190, 18, 7);
    g.fillStyle(0xe9f8ff).fillRect(6, 0, 178, 6);
    g.fillStyle(0xcdeeff);
    for (let x = 12; x < 180; x += 30) g.fillTriangle(x, 16, x + 9, 16, x + 4, 24);
  });
}

function newYork(s) {
  make(s, "ny-taxi", 108, 50, (g) => {
    g.fillStyle(0xf5c518).fillRoundedRect(4, 22, 100, 20, 6).fillRoundedRect(24, 8, 58, 18, 6);
    g.fillStyle(0x8fd3ee).fillRect(30, 12, 22, 11).fillRect(56, 12, 22, 11);
    g.fillStyle(0x222222).fillRect(4, 30, 100, 3);
    g.fillStyle(0xffffff).fillRect(46, 2, 18, 6);
    wheel(g, 26, 42);
    wheel(g, 84, 42);
  });
  make(s, "ny-hydrant", 30, 46, (g) => {
    g.fillStyle(0xd62828).fillRect(8, 14, 14, 32).fillRoundedRect(6, 8, 18, 8, 3).fillRect(11, 2, 8, 8);
    g.fillRect(2, 22, 8, 8).fillRect(20, 22, 8, 8).fillRect(5, 40, 20, 6);
    g.fillStyle(0xf28482).fillRect(11, 16, 3, 22);
  });
  make(s, "ny-cart", 90, 66, (g) => {
    g.fillStyle(0xb8bcc4).fillRoundedRect(8, 28, 68, 24, 4);
    g.fillStyle(0xd84e32).fillRect(8, 40, 68, 4).fillTriangle(6, 24, 44, 4, 84, 24);
    g.fillStyle(0xffffff).fillTriangle(30, 24, 44, 4, 58, 24);
    g.fillStyle(0x555555).fillRect(43, 4, 3, 26).fillRect(76, 34, 12, 3);
    wheel(g, 28, 58);
  });
  make(s, "ny-trash", 34, 42, (g) => {
    g.fillStyle(0x6b7078).fillRoundedRect(4, 8, 26, 34, 3);
    g.fillStyle(0x8a8f98).fillRoundedRect(2, 2, 30, 8, 3);
    g.lineStyle(2, 0x4d5158).lineBetween(11, 12, 11, 40).lineBetween(17, 12, 17, 40).lineBetween(23, 12, 23, 40);
  });
  make(s, "ny-building", 170, 240, (g) => {
    g.fillStyle(0x5b2f22).fillRect(6, 12, 158, 228);
    g.fillStyle(0xa8553a).fillRect(10, 24, 150, 216);
    g.fillStyle(0x6e3a2a).fillRect(2, 6, 166, 12);
    for (let r = 0; r < 4; r += 1)
      for (let c = 0; c < 3; c += 1) {
        const x = 24 + c * 46;
        const y = 40 + r * 38;
        g.fillStyle((r + c) % 2 ? 0xf6e08a : 0x2d3548).fillRect(x, y, 26, 26);
        g.lineStyle(3, 0x5b2f22).strokeRect(x, y, 26, 26);
      }
    g.fillStyle(0x3a2a24).fillRect(70, 206, 30, 34);
  });
  make(s, "ny-tower", 90, 260, (g) => {
    g.fillStyle(0x7d8fa3).fillRect(20, 80, 50, 180).fillRect(30, 44, 30, 40).fillRect(38, 16, 14, 32);
    g.fillStyle(0x93a7bb).fillRect(20, 80, 12, 180).fillRect(44, 0, 3, 18);
    g.fillStyle(0xf6e08a);
    for (let y = 92; y < 250; y += 20) g.fillRect(38, y, 6, 8).fillRect(52, y, 6, 8);
  });
  make(s, "ny-fireescape", 190, 24, (g) => {
    g.fillStyle(0x30343c).fillRect(0, 0, 190, 6);
    g.lineStyle(3, 0x30343c);
    for (let x = 0; x < 190; x += 24) g.lineBetween(x, 6, x + 12, 22).lineBetween(x + 12, 22, x + 24, 6);
  });
  make(s, "ny-awning", 190, 26, (g) => {
    for (let i = 0; i < 10; i += 1)
      g.fillStyle(i % 2 ? 0xf4f1e8 : 0xc0392b).fillRect(i * 19, 0, 19, 16);
    g.fillStyle(0xc0392b);
    for (let i = 0; i < 10; i += 2) g.fillTriangle(i * 19, 16, i * 19 + 19, 16, i * 19 + 9, 26);
  });
}

function washington(s) {
  make(s, "dc-police", 112, 50, (g) => {
    g.fillStyle(0xf2f2f2).fillRoundedRect(4, 22, 104, 20, 6).fillRoundedRect(26, 8, 58, 18, 6);
    g.fillStyle(0x1d2433).fillRect(4, 30, 104, 8);
    g.fillStyle(0x8fd3ee).fillRect(32, 12, 22, 11).fillRect(58, 12, 22, 11);
    g.fillStyle(0xe63946).fillRect(48, 2, 10, 6);
    g.fillStyle(0x2a6fdb).fillRect(58, 2, 10, 6);
    wheel(g, 28, 42);
    wheel(g, 86, 42);
  });
  make(s, "dc-cone", 30, 40, (g) => {
    g.fillStyle(0xf26b21).fillTriangle(15, 2, 3, 36, 27, 36).fillRect(0, 34, 30, 6);
    g.fillStyle(0xffffff).fillRect(9, 16, 12, 6);
  });
  make(s, "dc-bench", 76, 40, (g) => {
    g.fillStyle(0x3a3a3a).fillRect(8, 26, 6, 14).fillRect(62, 26, 6, 14);
    g.fillStyle(0x8a5a2b).fillRect(4, 6, 68, 5).fillRect(4, 14, 68, 4).fillRect(4, 20, 68, 6);
  });
  make(s, "dc-barrier", 84, 44, (g) => {
    g.fillStyle(0x9a9a9a).fillRoundedRect(2, 10, 80, 34, 6);
    g.fillStyle(0xd62828);
    for (let x = 8; x < 76; x += 24) g.fillRect(x, 14, 10, 8);
    g.fillStyle(0xf2f2f2).fillRect(14, 14, 10, 8).fillRect(38, 14, 10, 8).fillRect(62, 14, 10, 8);
  });
  make(s, "dc-columns", 170, 130, (g) => {
    g.fillStyle(0xf1f1ea).fillTriangle(85, 2, 4, 36, 166, 36).fillRect(4, 36, 162, 10);
    g.fillStyle(0xc7c7bd).fillTriangle(85, 12, 24, 34, 146, 34);
    for (let i = 0; i < 6; i += 1) {
      const x = 14 + i * 28;
      g.fillStyle(0xf1f1ea).fillRect(x, 46, 14, 70).fillRect(x - 2, 46, 18, 5).fillRect(x - 2, 112, 18, 6);
    }
    g.fillRect(0, 118, 170, 12);
  });
  make(s, "dc-obelisk", 44, 270, (g) => {
    g.fillStyle(0xe8e8e0).fillTriangle(22, 0, 4, 24, 40, 24);
    g.fillTriangle(4, 24, 40, 24, 10, 262).fillTriangle(40, 24, 34, 262, 10, 262);
    g.fillStyle(0xc9c9c0).fillTriangle(22, 24, 40, 24, 34, 262).fillRect(0, 262, 44, 8);
  });
  make(s, "dc-dome", 200, 150, (g) => {
    g.fillStyle(0xdcdce6).fillCircle(100, 62, 40);
    g.fillStyle(0xf2f2ee).fillRect(64, 60, 72, 44).fillRect(94, 8, 12, 22).fillTriangle(100, 0, 94, 10, 106, 10);
    g.fillRect(8, 104, 184, 46);
    g.fillStyle(0xc7c7d0);
    for (let x = 20; x < 188; x += 18) g.fillRect(x, 112, 6, 34);
    g.fillStyle(0x7d8aa0);
    for (let x = 74; x < 124; x += 20) g.fillRect(x, 70, 8, 22);
  });
  make(s, "dc-flag", 60, 190, (g) => {
    g.fillStyle(0x9a9a9a).fillRect(4, 0, 4, 190);
    for (let i = 0; i < 5; i += 1) g.fillStyle(i % 2 ? 0xf2f2f2 : 0xc0392b).fillRect(8, 6 + i * 6, 48, 6);
    g.fillStyle(0x2a3f7a).fillRect(8, 6, 20, 18);
  });
  make(s, "dc-slab", 190, 24, (g) => {
    g.fillStyle(0xc9c9c0).fillRoundedRect(0, 0, 190, 20, 4);
    g.fillStyle(0xf1f1ea).fillRect(4, 0, 182, 7);
    g.fillStyle(0xa9a9a0).fillRect(60, 8, 2, 10).fillRect(128, 8, 2, 10);
  });
}

export default function createThemeTextures(scene) {
  desert(scene);
  snow(scene);
  newYork(scene);
  washington(scene);
  make(scene, "city-lamp", 26, 150, (g) => {
    g.fillStyle(0x2d3a2f).fillRect(11, 20, 4, 130).fillRect(7, 140, 12, 10).fillRect(11, 16, 14, 3);
    g.fillStyle(0xffe9a0).fillRoundedRect(16, 14, 10, 8, 2);
  });
}