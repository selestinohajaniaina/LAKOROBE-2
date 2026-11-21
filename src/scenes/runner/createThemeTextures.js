const make = (scene, key, w, h, draw) => {
  if (scene.textures.exists(key)) return;
  const g = scene.make.graphics({ add: false });
  draw(g);
  g.generateTexture(key, w, h);
  g.destroy();
};

const wheel = (g, x, y) =>
  g
    .fillStyle(0x1c1c1c)
    .fillCircle(x, y, 8)
    .fillStyle(0xaaaaaa)
    .fillCircle(x, y, 3);

function desert(s) {
  make(s, "desert-cactus", 44, 70, (g) => {
    g.fillStyle(0x2f7a3a).fillRoundedRect(15, 2, 14, 68, 7);
    g.fillRoundedRect(1, 34, 18, 8, 4).fillRoundedRect(1, 18, 9, 24, 4);
    g.fillRoundedRect(25, 26, 18, 8, 4).fillRoundedRect(34, 12, 9, 22, 4);
    g.fillStyle(0x56a352).fillRect(19, 8, 4, 58);
    g.fillStyle(0xf3e7a0)
      .fillRect(12, 20, 2, 2)
      .fillRect(30, 30, 2, 2)
      .fillRect(16, 50, 2, 2);
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
    g.fillStyle(0xa8794a)
      .fillTriangle(2, 32, 22, 6, 36, 32)
      .fillTriangle(20, 32, 40, 2, 54, 32);
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
    g.fillTriangle(66, 58, 8, 104, 28, 66).fillTriangle(
      66,
      58,
      124,
      104,
      104,
      66
    );
    g.fillTriangle(66, 58, 54, 6, 78, 6);
    g.fillStyle(0x58b04a)
      .fillTriangle(66, 58, 40, 36, 58, 56)
      .fillTriangle(66, 58, 92, 36, 74, 56);
    g.fillStyle(0x5a3a22).fillCircle(60, 64, 5).fillCircle(72, 64, 5);
  });
  make(s, "desert-tent", 160, 96, (g) => {
    g.fillStyle(0xd9b27a).fillTriangle(80, 4, 4, 96, 156, 96);
    g.fillStyle(0xb5453a)
      .fillTriangle(80, 4, 40, 96, 60, 96)
      .fillTriangle(80, 4, 100, 96, 120, 96);
    g.fillStyle(0x4a2c1a).fillTriangle(80, 38, 56, 96, 104, 96);
    g.fillStyle(0x6b4a2a).fillRect(79, 0, 3, 12);
  });
  make(s, "desert-bush", 56, 30, (g) => {
    g.fillStyle(0xb59a4a)
      .fillTriangle(2, 30, 10, 8, 18, 30)
      .fillTriangle(14, 30, 26, 2, 38, 30);
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
    g.fillTriangle(65, 56, 16, 140, 114, 140).fillTriangle(
      65,
      104,
      4,
      188,
      126,
      188
    );
    g.fillStyle(0x2e7d62).fillTriangle(65, 24, 46, 80, 84, 80);
    g.fillStyle(0xf4faff).fillTriangle(65, 8, 50, 38, 80, 38);
    g.fillTriangle(65, 56, 44, 90, 86, 90).fillTriangle(
      65,
      104,
      36,
      142,
      94,
      142
    );
    g.fillCircle(24, 186, 10).fillCircle(106, 186, 10);
  });
  make(s, "snow-snowman", 56, 86, (g) => {
    g.fillStyle(0x6b4a2a).fillRect(2, 34, 14, 3).fillRect(40, 32, 14, 3);
    g.fillStyle(0xf7fbff)
      .fillCircle(28, 64, 22)
      .fillCircle(28, 36, 16)
      .fillCircle(28, 16, 12);
    g.fillStyle(0xd84e32).fillRect(16, 27, 24, 5);
    g.fillStyle(0x222222)
      .fillCircle(24, 14, 2)
      .fillCircle(32, 14, 2)
      .fillCircle(28, 44, 2)
      .fillCircle(28, 54, 2);
    g.fillStyle(0xf08a24).fillTriangle(28, 17, 44, 19, 28, 21);
  });
  make(s, "snow-igloo", 150, 84, (g) => {
    g.fillStyle(0xeaf6ff).fillCircle(75, 84, 68);
    g.lineStyle(2, 0xb7d4ea)
      .lineBetween(20, 60, 130, 60)
      .lineBetween(34, 38, 116, 38)
      .lineBetween(55, 18, 95, 18);
    g.lineBetween(50, 60, 50, 38)
      .lineBetween(100, 60, 100, 38)
      .lineBetween(75, 38, 75, 18);
    g.fillStyle(0xd7ebfa).fillRoundedRect(46, 52, 58, 32, 12);
    g.fillStyle(0x3b4b63).fillRoundedRect(58, 56, 34, 28, 12);
  });
  make(s, "snow-husky", 84, 52, (g) => {
    g.fillStyle(0xdfe5ea).fillTriangle(12, 18, 0, 6, 8, 24);
    g.fillStyle(0x8d97a3)
      .fillRect(18, 36, 7, 16)
      .fillRect(30, 36, 7, 16)
      .fillRect(44, 36, 7, 16)
      .fillRect(54, 36, 7, 16);
    g.fillRoundedRect(12, 14, 50, 24, 10).fillCircle(68, 18, 12);
    g.fillTriangle(60, 12, 62, 0, 68, 8).fillTriangle(68, 8, 74, 0, 76, 12);
    g.fillStyle(0xf2f5f8)
      .fillRoundedRect(18, 28, 40, 10, 5)
      .fillCircle(72, 22, 7)
      .fillRoundedRect(72, 19, 12, 8, 3);
    g.fillStyle(0x222222).fillRect(81, 19, 3, 3).fillCircle(70, 15, 2);
  });
  make(s, "snow-spikes", 52, 46, (g) => {
    g.fillStyle(0x9fd8f2)
      .fillTriangle(4, 46, 16, 12, 28, 46)
      .fillTriangle(22, 46, 32, 2, 44, 46);
    g.fillTriangle(38, 46, 46, 18, 52, 46);
    g.fillStyle(0xdff4ff)
      .fillTriangle(14, 40, 16, 18, 20, 40)
      .fillTriangle(30, 40, 32, 10, 35, 40);
  });
  make(s, "snow-rock", 60, 34, (g) => {
    g.fillStyle(0x6d7a96)
      .fillTriangle(2, 32, 22, 6, 38, 32)
      .fillTriangle(20, 32, 40, 2, 58, 32);
    g.fillStyle(0xf4faff)
      .fillTriangle(15, 16, 22, 6, 30, 16)
      .fillTriangle(34, 12, 40, 2, 47, 14);
  });
  make(s, "snow-ledge", 190, 24, (g) => {
    g.fillStyle(0xa5d8f0).fillRoundedRect(0, 0, 190, 18, 7);
    g.fillStyle(0xe9f8ff).fillRect(6, 0, 178, 6);
    g.fillStyle(0xcdeeff);
    for (let x = 12; x < 180; x += 30)
      g.fillTriangle(x, 16, x + 9, 16, x + 4, 24);
  });
}

function newYork(s) {
  make(s, "ny-taxi", 108, 50, (g) => {
    g.fillStyle(0xf5c518)
      .fillRoundedRect(4, 22, 100, 20, 6)
      .fillRoundedRect(24, 8, 58, 18, 6);
    g.fillStyle(0x8fd3ee).fillRect(30, 12, 22, 11).fillRect(56, 12, 22, 11);
    g.fillStyle(0x222222).fillRect(4, 30, 100, 3);
    g.fillStyle(0xffffff).fillRect(46, 2, 18, 6);
    wheel(g, 26, 42);
    wheel(g, 84, 42);
  });
  make(s, "ny-hydrant", 30, 46, (g) => {
    g.fillStyle(0xd62828)
      .fillRect(8, 14, 14, 32)
      .fillRoundedRect(6, 8, 18, 8, 3)
      .fillRect(11, 2, 8, 8);
    g.fillRect(2, 22, 8, 8).fillRect(20, 22, 8, 8).fillRect(5, 40, 20, 6);
    g.fillStyle(0xf28482).fillRect(11, 16, 3, 22);
  });
  make(s, "ny-cart", 90, 66, (g) => {
    g.fillStyle(0xb8bcc4).fillRoundedRect(8, 28, 68, 24, 4);
    g.fillStyle(0xd84e32)
      .fillRect(8, 40, 68, 4)
      .fillTriangle(6, 24, 44, 4, 84, 24);
    g.fillStyle(0xffffff).fillTriangle(30, 24, 44, 4, 58, 24);
    g.fillStyle(0x555555).fillRect(43, 4, 3, 26).fillRect(76, 34, 12, 3);
    wheel(g, 28, 58);
  });
  make(s, "ny-trash", 34, 42, (g) => {
    g.fillStyle(0x6b7078).fillRoundedRect(4, 8, 26, 34, 3);
    g.fillStyle(0x8a8f98).fillRoundedRect(2, 2, 30, 8, 3);
    g.lineStyle(2, 0x4d5158)
      .lineBetween(11, 12, 11, 40)
      .lineBetween(17, 12, 17, 40)
      .lineBetween(23, 12, 23, 40);
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
    g.fillStyle(0x7d8fa3)
      .fillRect(20, 80, 50, 180)
      .fillRect(30, 44, 30, 40)
      .fillRect(38, 16, 14, 32);
    g.fillStyle(0x93a7bb).fillRect(20, 80, 12, 180).fillRect(44, 0, 3, 18);
    g.fillStyle(0xf6e08a);
    for (let y = 92; y < 250; y += 20)
      g.fillRect(38, y, 6, 8).fillRect(52, y, 6, 8);
  });
  make(s, "ny-fireescape", 190, 24, (g) => {
    g.fillStyle(0x30343c).fillRect(0, 0, 190, 6);
    g.lineStyle(3, 0x30343c);
    for (let x = 0; x < 190; x += 24)
      g.lineBetween(x, 6, x + 12, 22).lineBetween(x + 12, 22, x + 24, 6);
  });
  make(s, "ny-awning", 190, 26, (g) => {
    for (let i = 0; i < 10; i += 1)
      g.fillStyle(i % 2 ? 0xf4f1e8 : 0xc0392b).fillRect(i * 19, 0, 19, 16);
    g.fillStyle(0xc0392b);
    for (let i = 0; i < 10; i += 2)
      g.fillTriangle(i * 19, 16, i * 19 + 19, 16, i * 19 + 9, 26);
  });
}

function washington(s) {
  make(s, "dc-police", 112, 50, (g) => {
    g.fillStyle(0xf2f2f2)
      .fillRoundedRect(4, 22, 104, 20, 6)
      .fillRoundedRect(26, 8, 58, 18, 6);
    g.fillStyle(0x1d2433).fillRect(4, 30, 104, 8);
    g.fillStyle(0x8fd3ee).fillRect(32, 12, 22, 11).fillRect(58, 12, 22, 11);
    g.fillStyle(0xe63946).fillRect(48, 2, 10, 6);
    g.fillStyle(0x2a6fdb).fillRect(58, 2, 10, 6);
    wheel(g, 28, 42);
    wheel(g, 86, 42);
  });
  make(s, "dc-cone", 30, 40, (g) => {
    g.fillStyle(0xf26b21)
      .fillTriangle(15, 2, 3, 36, 27, 36)
      .fillRect(0, 34, 30, 6);
    g.fillStyle(0xffffff).fillRect(9, 16, 12, 6);
  });
  make(s, "dc-bench", 76, 40, (g) => {
    g.fillStyle(0x3a3a3a).fillRect(8, 26, 6, 14).fillRect(62, 26, 6, 14);
    g.fillStyle(0x8a5a2b)
      .fillRect(4, 6, 68, 5)
      .fillRect(4, 14, 68, 4)
      .fillRect(4, 20, 68, 6);
  });
  make(s, "dc-barrier", 84, 44, (g) => {
    g.fillStyle(0x9a9a9a).fillRoundedRect(2, 10, 80, 34, 6);
    g.fillStyle(0xd62828);
    for (let x = 8; x < 76; x += 24) g.fillRect(x, 14, 10, 8);
    g.fillStyle(0xf2f2f2)
      .fillRect(14, 14, 10, 8)
      .fillRect(38, 14, 10, 8)
      .fillRect(62, 14, 10, 8);
  });
  make(s, "dc-columns", 170, 130, (g) => {
    g.fillStyle(0xf1f1ea)
      .fillTriangle(85, 2, 4, 36, 166, 36)
      .fillRect(4, 36, 162, 10);
    g.fillStyle(0xc7c7bd).fillTriangle(85, 12, 24, 34, 146, 34);
    for (let i = 0; i < 6; i += 1) {
      const x = 14 + i * 28;
      g.fillStyle(0xf1f1ea)
        .fillRect(x, 46, 14, 70)
        .fillRect(x - 2, 46, 18, 5)
        .fillRect(x - 2, 112, 18, 6);
    }
    g.fillRect(0, 118, 170, 12);
  });
  make(s, "dc-obelisk", 44, 270, (g) => {
    g.fillStyle(0xe8e8e0).fillTriangle(22, 0, 4, 24, 40, 24);
    g.fillTriangle(4, 24, 40, 24, 10, 262).fillTriangle(
      40,
      24,
      34,
      262,
      10,
      262
    );
    g.fillStyle(0xc9c9c0)
      .fillTriangle(22, 24, 40, 24, 34, 262)
      .fillRect(0, 262, 44, 8);
  });
  make(s, "dc-dome", 200, 150, (g) => {
    g.fillStyle(0xdcdce6).fillCircle(100, 62, 40);
    g.fillStyle(0xf2f2ee)
      .fillRect(64, 60, 72, 44)
      .fillRect(94, 8, 12, 22)
      .fillTriangle(100, 0, 94, 10, 106, 10);
    g.fillRect(8, 104, 184, 46);
    g.fillStyle(0xc7c7d0);
    for (let x = 20; x < 188; x += 18) g.fillRect(x, 112, 6, 34);
    g.fillStyle(0x7d8aa0);
    for (let x = 74; x < 124; x += 20) g.fillRect(x, 70, 8, 22);
  });
  make(s, "dc-flag", 60, 190, (g) => {
    g.fillStyle(0x9a9a9a).fillRect(4, 0, 4, 190);
    for (let i = 0; i < 5; i += 1)
      g.fillStyle(i % 2 ? 0xf2f2f2 : 0xc0392b).fillRect(8, 6 + i * 6, 48, 6);
    g.fillStyle(0x2a3f7a).fillRect(8, 6, 20, 18);
  });
  make(s, "dc-slab", 190, 24, (g) => {
    g.fillStyle(0xc9c9c0).fillRoundedRect(0, 0, 190, 20, 4);
    g.fillStyle(0xf1f1ea).fillRect(4, 0, 182, 7);
    g.fillStyle(0xa9a9a0).fillRect(60, 8, 2, 10).fillRect(128, 8, 2, 10);
  });
}

const palmTree = (s, key, c) =>
  make(s, key, 130, 230, (g) => {
    g.fillStyle(c.trunk).fillRect(60, 64, 12, 166);
    g.fillStyle(c.ring);
    for (let y = 84; y < 224; y += 22) g.fillRect(60, y, 12, 3);
    g.fillStyle(c.frond);
    g.fillTriangle(66, 58, 2, 78, 36, 40).fillTriangle(66, 58, 128, 78, 96, 40);
    g.fillTriangle(66, 58, 8, 104, 28, 66).fillTriangle(
      66,
      58,
      124,
      104,
      104,
      66
    );
    g.fillTriangle(66, 58, 54, 6, 78, 6);
    g.fillStyle(c.tip)
      .fillTriangle(66, 58, 40, 36, 58, 56)
      .fillTriangle(66, 58, 92, 36, 74, 56);
    g.fillStyle(c.ring).fillCircle(60, 64, 5).fillCircle(72, 64, 5);
  });

function beach(s) {
  palmTree(s, "beach-palm", {
    trunk: 0x3a2a2a,
    ring: 0x5a3a3a,
    frond: 0x6b7a2a,
    tip: 0xc0392b,
  });
  make(s, "beach-convertible", 112, 48, (g) => {
    g.fillStyle(0x2aa6d6)
      .fillRoundedRect(4, 22, 104, 18, 6)
      .fillRoundedRect(14, 14, 60, 12, 5);
    g.fillStyle(0xf5e6c8).fillRect(36, 10, 30, 14);
    g.fillStyle(0x9fe0f5).fillTriangle(70, 24, 78, 8, 82, 24);
    g.fillStyle(0xdddddd).fillRect(100, 30, 10, 6).fillRect(0, 30, 8, 6);
    g.fillStyle(0xf2f2f2).fillRect(10, 30, 90, 2);
    wheel(g, 28, 40);
    wheel(g, 86, 40);
  });
  make(s, "beach-flamingo", 36, 70, (g) => {
    g.fillStyle(0xe8527f).fillRect(12, 48, 2, 22).fillRect(20, 48, 2, 22);
    g.fillStyle(0xff6fa5)
      .fillCircle(16, 38, 13)
      .fillRoundedRect(22, 10, 6, 28, 3)
      .fillCircle(26, 10, 6);
    g.fillStyle(0xffb3cf).fillCircle(12, 36, 6);
    g.fillStyle(0x222222).fillTriangle(30, 8, 36, 12, 30, 14);
  });
  make(s, "beach-surf", 50, 64, (g) => {
    g.fillStyle(0xffd23f).fillRoundedRect(8, 2, 16, 62, 8);
    g.fillStyle(0x2ec4b6).fillRoundedRect(26, 8, 16, 56, 8);
    g.fillStyle(0xffffff).fillRect(14, 10, 4, 40).fillRect(32, 16, 4, 34);
    g.fillStyle(0x6b4a2a).fillRect(2, 52, 46, 6);
  });
  make(s, "beach-hotel", 170, 240, (g) => {
    g.fillStyle(0xe9e4f2).fillRect(20, 30, 130, 210);
    g.fillStyle(0x4fa8e8).fillRect(70, 0, 30, 240);
    g.fillStyle(0xff6fa5).fillRect(20, 30, 130, 8);
    g.fillStyle(0x2b4fa0);
    for (let y = 50; y < 220; y += 30) {
      g.fillRect(32, y, 22, 16).fillRect(116, y, 22, 16);
      g.fillStyle(0xffffff).fillRect(78, y, 4, 16).fillRect(88, y, 4, 16);
      g.fillStyle(0x2b4fa0);
    }
    g.fillStyle(0xffffff).fillCircle(78, 14, 4).fillCircle(92, 14, 4);
    g.fillStyle(0x2a2a4a).fillRect(66, 204, 38, 36);
  });
  make(s, "beach-umbrella", 90, 80, (g) => {
    g.fillStyle(0x6b4a2a).fillRect(44, 6, 3, 74);
    g.fillStyle(0xff6fa5).fillTriangle(45, 4, 2, 36, 88, 36);
    g.fillStyle(0xffffff).fillTriangle(45, 4, 28, 36, 60, 36);
    g.fillStyle(0x2ec4b6)
      .fillTriangle(45, 4, 2, 36, 18, 36)
      .fillTriangle(45, 4, 72, 36, 88, 36);
  });
  make(s, "beach-awning", 190, 26, (g) => {
    for (let i = 0; i < 10; i += 1)
      g.fillStyle(i % 2 ? 0xf4f1e8 : 0x2ec4b6).fillRect(i * 19, 0, 19, 16);
    g.fillStyle(0x2ec4b6);
    for (let i = 0; i < 10; i += 2)
      g.fillTriangle(i * 19, 16, i * 19 + 19, 16, i * 19 + 9, 26);
  });
  make(s, "beach-balcony", 190, 24, (g) => {
    g.fillStyle(0xff8fb8).fillRoundedRect(0, 0, 190, 20, 4);
    g.fillStyle(0xffd1e3).fillRect(4, 0, 182, 7);
    g.fillStyle(0x4fa8e8);
    for (let x = 14; x < 180; x += 30) g.fillRect(x, 11, 14, 5);
  });
}

function sunset(s) {
  palmTree(s, "sunset-palm", {
    trunk: 0x2d0a24,
    ring: 0x4a1a3a,
    frond: 0x3a0f2e,
    tip: 0x5a1a44,
  });
  make(s, "sunset-house", 160, 150, (g) => {
    g.fillStyle(0x8b7fd0).fillRect(20, 66, 120, 84);
    g.fillStyle(0x1f5f6b).fillTriangle(8, 68, 80, 8, 152, 68);
    g.fillStyle(0xc9c0f0).fillRect(34, 86, 92, 6);
    g.fillStyle(0xffb347).fillRect(34, 98, 20, 22).fillRect(106, 98, 20, 22);
    g.fillStyle(0xffffff).fillRect(30, 124, 100, 4);
    for (let x = 32; x < 130; x += 10) g.fillRect(x, 124, 2, 12);
    g.fillStyle(0x7a1f2a).fillRect(66, 100, 28, 50);
    g.fillStyle(0xffb347).fillRect(72, 50, 16, 16);
  });
  make(s, "sunset-hotel", 110, 210, (g) => {
    g.fillStyle(0x7a6ab0).fillRect(14, 40, 86, 170);
    g.fillStyle(0xc9c0f0).fillRect(10, 36, 94, 8).fillRect(10, 110, 94, 5);
    g.fillStyle(0x5a4a90).fillTriangle(14, 40, 57, 4, 100, 40);
    g.fillStyle(0xffb347);
    for (let y = 56; y < 190; y += 34)
      for (let x = 24; x < 90; x += 22) g.fillRect(x, y, 12, 18);
    g.fillStyle(0xf5f0e6).fillRect(2, 60, 8, 60);
    g.fillStyle(0x7a1f2a).fillRect(44, 180, 26, 30);
  });
  make(s, "sunset-truck", 120, 66, (g) => {
    g.fillStyle(0xf5f0e6).fillRoundedRect(4, 12, 100, 40, 6);
    g.fillStyle(0xd1d9e0).fillRoundedRect(84, 22, 32, 30, 5);
    g.fillStyle(0x2ec4b6).fillRect(4, 38, 100, 6);
    g.fillStyle(0x8fd3ee).fillRect(90, 26, 20, 12);
    g.fillStyle(0x333333).fillRect(18, 20, 52, 14);
    for (let i = 0; i < 6; i += 1)
      g.fillStyle(i % 2 ? 0xffffff : 0xd62828).fillRect(14 + i * 10, 14, 10, 6);
    wheel(g, 28, 58);
    wheel(g, 92, 58);
  });
  make(s, "sunset-mailbox", 30, 48, (g) => {
    g.fillStyle(0x4d4d4d).fillRect(11, 28, 8, 20).fillRect(6, 44, 18, 4);
    g.fillStyle(0x2a4fa0)
      .fillRoundedRect(2, 4, 26, 26, 10)
      .fillRect(2, 18, 26, 12);
    g.fillStyle(0xd62828).fillRect(26, 6, 3, 12).fillRect(26, 6, 6, 4);
    g.fillStyle(0xffffff).fillRect(8, 20, 14, 3);
  });
  make(s, "sunset-bike", 70, 46, (g) => {
    g.lineStyle(3, 0x222222).strokeCircle(14, 32, 12).strokeCircle(56, 32, 12);
    g.lineStyle(3, 0xd62828)
      .lineBetween(14, 32, 30, 14)
      .lineBetween(30, 14, 50, 14)
      .lineBetween(50, 14, 56, 32)
      .lineBetween(30, 14, 36, 32)
      .lineBetween(14, 32, 36, 32);
    g.lineStyle(3, 0x222222)
      .lineBetween(26, 10, 36, 10)
      .lineBetween(50, 14, 48, 6);
  });
  make(s, "sunset-balcony", 190, 24, (g) => {
    g.fillStyle(0xf5f0e6).fillRect(0, 0, 190, 6);
    g.fillStyle(0xe0d6c4).fillRect(0, 6, 190, 3);
    g.fillStyle(0xf5f0e6);
    for (let x = 6; x < 190; x += 14) g.fillRect(x, 9, 4, 15);
  });
}

function losAngeles(s) {
  make(s, "la-palm", 80, 260, (g) => {
    g.fillStyle(0x7a1f4d).fillRect(38, 44, 5, 216);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 7) {
      g.fillTriangle(
        40,
        44,
        40 + Math.cos(a - 0.12) * 36,
        44 + Math.sin(a - 0.12) * 30,
        40 + Math.cos(a + 0.12) * 36,
        44 + Math.sin(a + 0.12) * 30
      );
    }
    g.fillCircle(40, 44, 5);
  });
  make(s, "la-tower", 100, 250, (g) => {
    g.fillStyle(0xf2a07a)
      .fillRect(20, 60, 60, 190)
      .fillRect(32, 20, 36, 50)
      .fillRect(44, 0, 12, 24);
    g.fillStyle(0xd9825e).fillRect(20, 60, 10, 190);
    g.fillStyle(0xffd2a8);
    for (let y = 80; y < 240; y += 22)
      g.fillRect(40, y, 8, 10).fillRect(56, y, 8, 10);
  });
  make(s, "la-lamp", 70, 150, (g) => {
    g.fillStyle(0xfff0a0, 0.35).fillTriangle(47, 25, 28, 150, 66, 150);
    g.fillStyle(0x7a1f4d)
      .fillRect(8, 16, 4, 134)
      .fillRect(8, 16, 40, 4)
      .fillRect(3, 140, 14, 10);
    g.fillStyle(0xffe27a).fillRect(40, 20, 14, 5);
  });
  make(s, "la-lowrider", 112, 46, (g) => {
    g.fillStyle(0xd1306f)
      .fillRoundedRect(4, 22, 104, 16, 6)
      .fillRoundedRect(26, 8, 56, 18, 7);
    g.fillStyle(0xfce4a0).fillRect(32, 12, 22, 11).fillRect(58, 12, 20, 11);
    g.fillStyle(0xffd23f).fillRect(4, 30, 104, 2);
    g.fillStyle(0x7a1f4d).fillRect(8, 26, 96, 3);
    g.fillStyle(0x1c1c1c).fillCircle(28, 38, 8).fillCircle(86, 38, 8);
    g.fillStyle(0xffd23f).fillCircle(28, 38, 4).fillCircle(86, 38, 4);
  });
  make(s, "la-barrier", 84, 44, (g) => {
    g.fillStyle(0xc4b0c8)
      .fillRoundedRect(4, 0, 76, 44, 8)
      .fillRect(0, 36, 84, 8);
    g.fillStyle(0xf26b21).fillRect(16, 10, 14, 8).fillRect(54, 10, 14, 8);
    g.fillStyle(0xe8dced).fillRect(8, 4, 68, 3);
  });
  make(s, "la-skate", 60, 34, (g) => {
    g.fillStyle(0xb0a0b8).fillTriangle(2, 34, 58, 34, 58, 2);
    g.fillStyle(0x8a7a92).fillTriangle(12, 34, 58, 34, 58, 14);
    g.fillStyle(0xd0d0d8).fillRect(54, 0, 6, 34);
    g.fillStyle(0xff6fa5).fillRect(30, 28, 22, 3);
  });
  make(s, "la-ledge", 190, 24, (g) => {
    g.fillStyle(0xc2427f).fillRoundedRect(0, 0, 190, 20, 4);
    g.fillStyle(0xe0699f).fillRect(4, 0, 182, 7);
    g.fillStyle(0x7a1f4d);
    for (let x = 8; x < 190; x += 16) g.fillRect(x, 10, 3, 10);
  });
}

// ---------- Aides communes aux nouveaux thèmes ----------
const car = (s, key, body, glass, stripe, roofLight) =>
  make(s, key, 108, 50, (g) => {
    g.fillStyle(body)
      .fillRoundedRect(4, 22, 100, 20, 6)
      .fillRoundedRect(24, 8, 58, 18, 6);
    g.fillStyle(glass).fillRect(30, 12, 22, 11).fillRect(56, 12, 22, 11);
    g.fillStyle(stripe).fillRect(4, 30, 100, 3);
    if (roofLight) g.fillStyle(roofLight).fillRect(46, 2, 18, 6);
    wheel(g, 26, 42);
    wheel(g, 84, 42);
  });

const skyscraper = (s, key, w, h, body, shade, windows, top) =>
  make(s, key, w, h, (g) => {
    g.fillStyle(body).fillRect(0, 22, w, h - 22);
    g.fillStyle(shade)
      .fillRect(0, 22, w * 0.22, h - 22)
      .fillRect(w / 2 - 2, 0, 4, 24);
    g.fillStyle(top).fillRect(w * 0.15, 14, w * 0.7, 10);
    g.fillStyle(windows);
    for (let y = 38; y < h - 14; y += 18)
      for (let x = w * 0.3; x < w - 10; x += 16) g.fillRect(x, y, 8, 9);
  });

const ledgeTexture = (s, key, main, top, mark) =>
  make(s, key, 190, 24, (g) => {
    g.fillStyle(main).fillRoundedRect(0, 0, 190, 20, 5);
    g.fillStyle(top).fillRect(5, 0, 180, 7);
    g.fillStyle(mark);
    for (let x = 14; x < 180; x += 30) g.fillRect(x, 11, 14, 4);
  });

// ---------- BOSTON ----------
function boston(s) {
  make(s, "bo-brick", 180, 170, (g) => {
    g.fillStyle(0x8f2f2a).fillRect(10, 60, 160, 110);
    g.fillStyle(0xb8453a).fillRect(14, 64, 152, 106);
    g.fillStyle(0x3b3f4a).fillTriangle(4, 62, 90, 22, 176, 62);
    g.fillStyle(0xf3efe6).fillRect(80, 10, 20, 18);
    g.fillStyle(0xd8c36a).fillTriangle(90, 0, 76, 12, 104, 12);
    for (let r = 0; r < 2; r += 1)
      for (let c = 0; c < 5; c += 1) {
        g.fillStyle(0xf3efe6).fillRect(26 + c * 28, 76 + r * 34, 16, 22);
        g.fillStyle(0x2d3548).fillRect(28 + c * 28, 78 + r * 34, 12, 18);
      }
    g.fillStyle(0x3a2a24).fillRect(80, 138, 20, 32);
  });
  make(s, "bo-tree", 90, 150, (g) => {
    g.fillStyle(0x6b4a2a).fillRect(40, 70, 10, 80);
    g.fillStyle(0x2f7a3a)
      .fillCircle(45, 48, 34)
      .fillCircle(24, 66, 22)
      .fillCircle(66, 66, 22);
    g.fillStyle(0x58a64a).fillCircle(38, 38, 16).fillCircle(58, 54, 12);
  });
  skyscraper(s, "bo-tower", 90, 260, 0xdfe3ea, 0xb4bac6, 0x4b5870, 0x9aa3b4);
  car(s, "bo-taxi", 0xf5c518, 0x8fd3ee, 0x222222, 0xffffff);
  make(s, "bo-cannon", 80, 44, (g) => {
    g.fillStyle(0x4a2f1a).fillRoundedRect(8, 22, 40, 12, 3);
    g.fillStyle(0x2b2f36).fillRoundedRect(10, 10, 66, 16, 7);
    g.fillStyle(0x454b55).fillRect(16, 13, 52, 4);
    g.fillStyle(0x6b4a2a).fillCircle(30, 34, 10).fillCircle(58, 38, 6);
    g.fillStyle(0x2d1d10).fillCircle(30, 34, 4).fillCircle(58, 38, 2);
  });
  make(s, "bo-lobster", 48, 38, (g) => {
    g.fillStyle(0x8a5a2b).fillRoundedRect(2, 6, 44, 32, 4);
    g.fillStyle(0x5a3a1a)
      .fillRect(10, 8, 3, 28)
      .fillRect(22, 8, 3, 28)
      .fillRect(34, 8, 3, 28)
      .fillRect(2, 20, 44, 3);
    g.fillStyle(0xd62828).fillCircle(24, 8, 6);
  });
  ledgeTexture(s, "bo-ledge", 0x8f2f2a, 0xd9a28f, 0x5a1a18);
}

// ---------- MIAMI ----------
function miami(s) {
  skyscraper(s, "mi-tower", 100, 260, 0x2f7de0, 0x1f5fb8, 0xcfe6ff, 0xf0a58a);
  palmTree(s, "mi-palm", {
    trunk: 0x7a5a3a,
    ring: 0x9a7a52,
    frond: 0x3fa84a,
    tip: 0x9bdc4a,
  });
  make(s, "mi-hotel", 160, 110, (g) => {
    g.fillStyle(0x3b6fd8).fillRect(40, 0, 80, 26);
    g.fillStyle(0xf59ac0).fillRect(6, 24, 148, 86);
    g.fillStyle(0xffc7de).fillRect(6, 24, 148, 8);
    g.fillStyle(0x7a3a8a);
    for (let r = 0; r < 3; r += 1)
      for (let c = 0; c < 7; c += 1)
        g.fillRect(16 + c * 20, 42 + r * 22, 12, 12);
  });
  make(s, "mi-cooler", 44, 38, (g) => {
    g.fillStyle(0xe63946).fillRoundedRect(2, 8, 40, 30, 4);
    g.fillStyle(0xf5f0e6).fillRect(2, 8, 40, 10);
    g.fillStyle(0x333333).fillRect(14, 3, 16, 5);
  });
  make(s, "mi-scooter", 64, 48, (g) => {
    g.fillStyle(0x2ec4b6)
      .fillRoundedRect(10, 18, 42, 18, 8)
      .fillRoundedRect(36, 6, 8, 16, 3);
    g.fillStyle(0x222222).fillRect(34, 2, 18, 4);
    g.fillStyle(0xf5f0e6).fillRoundedRect(14, 12, 22, 8, 3);
    wheel(g, 14, 40);
    wheel(g, 50, 40);
  });
  make(s, "mi-gator", 100, 34, (g) => {
    g.fillStyle(0x3f6b2f).fillTriangle(0, 30, 14, 12, 26, 30);
    g.fillRoundedRect(6, 12, 70, 18, 8).fillRoundedRect(66, 14, 32, 12, 5);
    g.fillStyle(0x2f5224)
      .fillRect(14, 6, 6, 6)
      .fillRect(28, 4, 6, 8)
      .fillRect(42, 4, 6, 8)
      .fillRect(56, 6, 6, 6);
    g.fillStyle(0x3f6b2f).fillRect(18, 26, 8, 8).fillRect(52, 26, 8, 8);
    g.fillStyle(0xf5f0e6).fillRect(84, 24, 12, 2);
    g.fillStyle(0xffd23f).fillCircle(86, 14, 2);
  });
  ledgeTexture(s, "mi-ledge", 0xff8fb8, 0xffd1e3, 0x2f7de0);
}

// ---------- TEXAS ----------
function texas(s) {
  make(s, "tx-saloon", 170, 170, (g) => {
    g.fillStyle(0x9a5a2b).fillRect(10, 40, 150, 130);
    g.fillStyle(0xc4863f).fillRect(14, 44, 142, 126);
    g.fillStyle(0x7a4a22).fillRect(4, 24, 162, 22);
    g.fillStyle(0xf1d27a).fillRect(40, 28, 90, 12);
    g.fillStyle(0x2b4a5a).fillRect(24, 70, 32, 34).fillRect(114, 70, 32, 34);
    g.fillStyle(0x5a3a22)
      .fillRect(64, 96, 42, 74)
      .fillRect(8, 118, 6, 52)
      .fillRect(156, 118, 6, 52);
    g.fillStyle(0x7a4a22).fillRect(0, 110, 170, 8);
  });
  make(s, "tx-saguaro", 70, 160, (g) => {
    g.fillStyle(0x3f8f4a).fillRoundedRect(28, 4, 16, 156, 8);
    g.fillRoundedRect(4, 50, 12, 50, 6).fillRoundedRect(4, 88, 30, 12, 6);
    g.fillRoundedRect(56, 36, 12, 56, 6).fillRoundedRect(38, 80, 30, 12, 6);
    g.fillStyle(0x66b86a).fillRect(34, 10, 4, 144);
  });
  make(s, "tx-windmill", 100, 220, (g) => {
    g.fillStyle(0x7a7a7a).fillTriangle(50, 60, 24, 220, 76, 220);
    g.fillStyle(0x4a4a4a).fillTriangle(50, 90, 38, 220, 62, 220);
    g.fillStyle(0xdddddd);
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      g.fillTriangle(
        50,
        50,
        50 + Math.cos(a) * 40,
        50 + Math.sin(a) * 40,
        50 + Math.cos(a + 0.25) * 40,
        50 + Math.sin(a + 0.25) * 40
      );
    }
    g.fillStyle(0xc0392b).fillCircle(50, 50, 6);
  });
  make(s, "tx-barrel", 38, 44, (g) => {
    g.fillStyle(0x7a4a22).fillRoundedRect(3, 2, 32, 42, 10);
    g.fillStyle(0x3a3a3a).fillRect(3, 10, 32, 4).fillRect(3, 30, 32, 4);
    g.fillStyle(0xa8703a).fillRect(10, 4, 4, 38);
  });
  make(s, "tx-tumble", 44, 40, (g) => {
    g.lineStyle(2, 0x9a7a3a)
      .strokeCircle(22, 20, 18)
      .strokeCircle(22, 20, 12)
      .strokeCircle(22, 20, 6);
    g.lineBetween(4, 20, 40, 20)
      .lineBetween(22, 2, 22, 38)
      .lineBetween(8, 8, 36, 32)
      .lineBetween(8, 32, 36, 8);
  });
  make(s, "tx-bull", 96, 62, (g) => {
    g.fillStyle(0x5a3a22)
      .fillRect(16, 44, 8, 18)
      .fillRect(30, 44, 8, 18)
      .fillRect(52, 44, 8, 18)
      .fillRect(64, 44, 8, 18)
      .fillRect(4, 24, 4, 22);
    g.fillStyle(0x7a4a2a)
      .fillRoundedRect(8, 18, 68, 32, 12)
      .fillCircle(24, 22, 15);
    g.fillStyle(0x8a5a34).fillCircle(80, 32, 13);
    g.fillStyle(0xf5f0e6)
      .fillTriangle(72, 24, 66, 8, 78, 22)
      .fillTriangle(86, 24, 94, 10, 90, 26);
    g.fillStyle(0x111111).fillCircle(82, 30, 2);
  });
  ledgeTexture(s, "tx-ledge", 0x9a5a2b, 0xd8a35a, 0x5a3a22);
}

// ---------- CHICAGO ----------
function chicago(s) {
  skyscraper(s, "ch-willis", 96, 270, 0x3a2a24, 0x24180f, 0xc49a7a, 0x7a6a60);
  skyscraper(s, "ch-glass", 90, 230, 0x2f7de0, 0x1f5fb8, 0xcfe6ff, 0x8fb8f0);
  make(s, "ch-hancock", 100, 260, (g) => {
    g.fillStyle(0x1c1c20)
      .fillTriangle(14, 24, 86, 24, 100, 260)
      .fillTriangle(14, 24, 0, 260, 100, 260);
    g.fillRect(30, 0, 4, 26).fillRect(66, 0, 4, 26);
    g.fillStyle(0xd62828).fillRect(30, 0, 4, 6).fillRect(66, 0, 4, 6);
    g.lineStyle(3, 0x4a4a55)
      .lineBetween(14, 24, 96, 140)
      .lineBetween(86, 24, 4, 140)
      .lineBetween(8, 140, 98, 260)
      .lineBetween(92, 140, 2, 260);
  });
  make(s, "ch-bike", 70, 46, (g) => {
    g.lineStyle(3, 0x222222).strokeCircle(14, 32, 12).strokeCircle(56, 32, 12);
    g.lineStyle(3, 0x2f7de0)
      .lineBetween(14, 32, 30, 14)
      .lineBetween(30, 14, 50, 14)
      .lineBetween(50, 14, 56, 32)
      .lineBetween(30, 14, 36, 32)
      .lineBetween(14, 32, 36, 32);
    g.lineStyle(3, 0x222222)
      .lineBetween(26, 10, 36, 10)
      .lineBetween(50, 14, 48, 6);
  });
  make(s, "ch-cart", 90, 66, (g) => {
    g.fillStyle(0xb8bcc4).fillRoundedRect(8, 28, 68, 24, 4);
    g.fillStyle(0xf2c500)
      .fillRect(8, 40, 68, 4)
      .fillTriangle(6, 24, 44, 4, 84, 24);
    g.fillStyle(0xd62828).fillTriangle(30, 24, 44, 4, 58, 24);
    g.fillStyle(0x555555).fillRect(43, 4, 3, 26).fillRect(76, 34, 12, 3);
    wheel(g, 28, 58);
  });
  make(s, "ch-bean", 90, 46, (g) => {
    g.fillStyle(0x9aa3ad).fillRoundedRect(2, 6, 86, 40, 20);
    g.fillStyle(0xdfe5ea).fillRoundedRect(8, 8, 60, 16, 8);
    g.fillStyle(0x4a525c).fillRoundedRect(34, 32, 22, 14, 6);
  });
  ledgeTexture(s, "ch-ledge", 0x4a4f58, 0x8a909a, 0xd9a441);
}

// ---------- LAS VEGAS ----------
function vegas(s) {
  make(s, "lv-sign", 110, 150, (g) => {
    g.fillStyle(0x5a5a66).fillRect(52, 70, 6, 80);
    g.fillStyle(0xf5f0e6).fillRoundedRect(4, 4, 102, 66, 20);
    g.fillStyle(0xd62828).fillRoundedRect(10, 10, 90, 54, 14);
    g.fillStyle(0xf5f0e6).fillRect(20, 24, 70, 4).fillRect(20, 34, 70, 10);
    g.fillStyle(0xffd23f)
      .fillCircle(20, 16, 3)
      .fillCircle(55, 14, 3)
      .fillCircle(90, 16, 3);
  });
  make(s, "lv-eiffel", 90, 240, (g) => {
    g.fillStyle(0x2f4f4a).fillTriangle(45, 0, 22, 240, 68, 240);
    g.fillStyle(0x1c2f2b).fillTriangle(45, 150, 36, 240, 54, 240);
    g.lineStyle(2, 0xf6e08a)
      .lineBetween(38, 90, 52, 90)
      .lineBetween(32, 150, 58, 150)
      .lineBetween(27, 210, 63, 210);
  });
  make(s, "lv-wheel", 150, 180, (g) => {
    g.lineStyle(5, 0x4a2f6a)
      .lineBetween(75, 80, 42, 180)
      .lineBetween(75, 80, 108, 180);
    g.lineStyle(4, 0xff6fa5).strokeCircle(75, 80, 70);
    g.lineStyle(2, 0xf6e08a);
    for (let i = 0; i < 12; i += 1) {
      const a = (i * Math.PI) / 6;
      g.lineBetween(75, 80, 75 + Math.cos(a) * 70, 80 + Math.sin(a) * 70);
      g.fillStyle(0xffd23f).fillCircle(
        75 + Math.cos(a) * 70,
        80 + Math.sin(a) * 70,
        4
      );
    }
  });
  make(s, "lv-dice", 44, 44, (g) => {
    g.fillStyle(0xf5f0e6).fillRoundedRect(2, 2, 40, 40, 8);
    g.fillStyle(0xd62828)
      .fillCircle(12, 12, 4)
      .fillCircle(32, 12, 4)
      .fillCircle(22, 22, 4)
      .fillCircle(12, 32, 4)
      .fillCircle(32, 32, 4);
  });
  make(s, "lv-slot", 44, 70, (g) => {
    g.fillStyle(0xd62828).fillRoundedRect(2, 2, 40, 68, 6);
    g.fillStyle(0xffd23f).fillRect(2, 2, 40, 10);
    g.fillStyle(0xf5f0e6).fillRect(8, 18, 28, 18);
    g.fillStyle(0x222222)
      .fillRect(18, 18, 2, 18)
      .fillRect(26, 18, 2, 18)
      .fillRect(10, 44, 24, 8);
  });
  make(s, "lv-limo", 120, 46, (g) => {
    g.fillStyle(0x1c1c24)
      .fillRoundedRect(2, 18, 116, 20, 6)
      .fillRoundedRect(24, 8, 64, 14, 5);
    g.fillStyle(0x8fd3ee)
      .fillRect(30, 12, 16, 8)
      .fillRect(50, 12, 16, 8)
      .fillRect(70, 12, 14, 8);
    g.fillStyle(0xffd23f).fillRect(2, 28, 116, 2);
    wheel(g, 24, 38);
    wheel(g, 70, 38);
    wheel(g, 100, 38);
  });
  ledgeTexture(s, "lv-ledge", 0x3a1f6a, 0xff4fa0, 0xffd23f);
}

// ---------- SAN FRANCISCO ----------
function sanFrancisco(s) {
  make(s, "sf-victorian", 120, 150, (g) => {
    g.fillStyle(0xd9c8b0).fillRect(14, 50, 92, 100);
    g.fillStyle(0x7a8aa8).fillTriangle(6, 52, 60, 10, 114, 52);
    g.fillStyle(0xf0e6d2).fillRect(14, 50, 92, 6);
    g.fillStyle(0xc0392b).fillTriangle(40, 52, 60, 26, 80, 52);
    g.fillStyle(0x3b4a66).fillRect(26, 70, 18, 28).fillRect(76, 70, 18, 28);
    g.fillStyle(0x7a2418).fillRect(50, 110, 20, 40);
    g.fillStyle(0xf0e6d2).fillRect(44, 146, 32, 4);
  });
  make(s, "sf-tower", 70, 270, (g) => {
    g.fillStyle(0xc0392b).fillRect(6, 0, 16, 270).fillRect(46, 0, 16, 270);
    g.fillStyle(0xe05a48).fillRect(8, 0, 4, 270).fillRect(48, 0, 4, 270);
    g.fillStyle(0xc0392b)
      .fillRect(6, 40, 56, 10)
      .fillRect(6, 110, 56, 10)
      .fillRect(6, 180, 56, 10);
  });
  make(s, "sf-pyramid", 90, 250, (g) => {
    g.fillStyle(0xe8ecf2)
      .fillTriangle(45, 0, 22, 250, 68, 250)
      .fillRect(12, 90, 12, 160)
      .fillRect(66, 90, 12, 160);
    g.lineStyle(1, 0xaab4c4);
    for (let y = 40; y < 250; y += 18) g.lineBetween(30, y, 60, y);
  });
  make(s, "sf-crab", 52, 34, (g) => {
    g.fillStyle(0xe0642a)
      .fillRoundedRect(10, 10, 32, 18, 8)
      .fillCircle(8, 10, 7)
      .fillCircle(44, 10, 7);
    g.fillStyle(0xb0471a)
      .fillRect(12, 26, 3, 8)
      .fillRect(20, 26, 3, 8)
      .fillRect(30, 26, 3, 8)
      .fillRect(38, 26, 3, 8);
    g.fillStyle(0x222222).fillCircle(20, 8, 2).fillCircle(32, 8, 2);
  });
  make(s, "sf-sealion", 80, 36, (g) => {
    g.fillStyle(0x6b4a32)
      .fillTriangle(0, 36, 14, 18, 18, 36)
      .fillRoundedRect(6, 16, 56, 20, 10)
      .fillCircle(66, 12, 10);
    g.fillStyle(0x7a5a40).fillRoundedRect(60, 8, 18, 8, 4);
    g.fillStyle(0x111111).fillCircle(66, 10, 2);
  });
  make(s, "sf-cable", 110, 62, (g) => {
    g.fillStyle(0x7a2418).fillRoundedRect(4, 16, 102, 32, 6);
    g.fillStyle(0x2d2d2d).fillRect(2, 8, 106, 8);
    g.fillStyle(0xf0e6d2).fillRect(4, 16, 102, 6);
    g.fillStyle(0xfff0a0)
      .fillRect(14, 26, 14, 14)
      .fillRect(36, 26, 14, 14)
      .fillRect(58, 26, 14, 14)
      .fillRect(80, 26, 14, 14);
    g.fillStyle(0x222222).fillRect(10, 48, 90, 6);
    wheel(g, 26, 54);
    wheel(g, 84, 54);
  });
  ledgeTexture(s, "sf-ledge", 0xc0392b, 0xe8705f, 0x7a2418);
}

export default function createThemeTextures(scene) {
  desert(scene);
  snow(scene);
  newYork(scene);
  washington(scene);
  beach(scene);
  sunset(scene);
  losAngeles(scene);
  boston(scene);
  miami(scene);
  texas(scene);
  chicago(scene);
  vegas(scene);
  sanFrancisco(scene);
  make(scene, "city-lamp", 26, 150, (g) => {
    g.fillStyle(0x2d3a2f)
      .fillRect(11, 20, 4, 130)
      .fillRect(7, 140, 12, 10)
      .fillRect(11, 16, 14, 3);
    g.fillStyle(0xffe9a0).fillRoundedRect(16, 14, 10, 8, 2);
  });
}
