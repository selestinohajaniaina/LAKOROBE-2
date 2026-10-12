const createTexture = (scene, key, width, height, draw) => {
  if (scene.textures.exists(key)) return;
  const graphics = scene.make.graphics({ add: false });
  draw(graphics);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
};

export default function createCourseTextures(scene) {
  createTexture(scene, "course-ground", 256, 96, (g) => {
    g.fillStyle(0x9f4728).fillRect(0, 0, 256, 96);
    g.fillStyle(0xc96535).fillRect(0, 0, 256, 12);
    g.fillStyle(0x7d351f);
    g.fillRect(18, 31, 18, 5).fillRect(116, 66, 25, 5);
    g.fillRect(211, 39, 12, 4).fillRect(65, 83, 9, 4);
    g.fillStyle(0xe18a4f);
    g.fillRect(54, 24, 8, 4).fillRect(170, 48, 13, 4);
  });

  createTexture(scene, "course-distant-plants", 640, 170, (g) => {
    g.fillStyle(0x416f36);
    g.fillTriangle(0, 170, 110, 55, 230, 170);
    g.fillTriangle(155, 170, 330, 25, 510, 170);
    g.fillTriangle(405, 170, 560, 70, 640, 170);
    g.fillStyle(0x5e8d42);
    g.fillCircle(65, 144, 44).fillCircle(137, 139, 55);
    g.fillCircle(425, 142, 52).fillCircle(530, 145, 43);
  });

  createTexture(scene, "course-grass", 512, 80, (g) => {
    g.fillStyle(0x355c2b);
    for (let x = 0; x < 512; x += 64) {
      g.fillTriangle(x, 80, x + 18, 20, x + 29, 80);
      g.fillTriangle(x + 20, 80, x + 43, 38, x + 54, 80);
    }
    g.fillStyle(0x6b913d).fillRect(0, 72, 512, 8);
  });

  createTexture(scene, "course-house", 210, 120, (g) => {
    g.fillStyle(0x6b321f).fillRect(20, 48, 170, 72);
    g.fillStyle(0xc4773f).fillRect(28, 54, 154, 66);
    g.fillStyle(0xf1b552).fillTriangle(4, 54, 105, 3, 206, 54);
    g.fillStyle(0x7b3d24).fillTriangle(18, 51, 105, 11, 192, 51);
    g.fillStyle(0x42271e).fillRect(83, 81, 44, 39);
    g.fillStyle(0x9ed3cf).fillRect(42, 72, 27, 25).fillRect(141, 72, 27, 25);
    g.lineStyle(4, 0x4d3525).strokeRect(42, 72, 27, 25).strokeRect(141, 72, 27, 25);
  });

  createTexture(scene, "course-roof", 210, 38, (g) => {
    g.fillStyle(0x5c2b1b).fillRect(4, 0, 202, 10);
    g.fillStyle(0xd59035).fillTriangle(4, 10, 105, 37, 206, 10);
    g.fillStyle(0x8e4a25).fillTriangle(18, 11, 105, 32, 192, 11);
    g.fillStyle(0xf1bd55).fillRect(4, 0, 202, 5);
  });

  createTexture(scene, "course-tree", 190, 250, (g) => {
    g.fillStyle(0x5b321f).fillRect(79, 86, 34, 164);
    g.fillStyle(0x774728).fillRect(88, 91, 12, 159);
    g.fillStyle(0x2e622f);
    g.fillCircle(48, 84, 45).fillCircle(96, 54, 54).fillCircle(145, 82, 43);
    g.fillStyle(0x4b873b);
    g.fillCircle(63, 56, 27).fillCircle(123, 45, 30).fillCircle(135, 92, 25);
  });

  createTexture(scene, "course-branch", 190, 24, (g) => {
    g.fillStyle(0x4b291b).fillRoundedRect(0, 0, 190, 18, 6);
    g.fillStyle(0x80502a).fillRect(7, 2, 173, 7);
    g.fillStyle(0x315d2b).fillTriangle(25, 7, 42, 0, 52, 7);
    g.fillTriangle(132, 7, 152, 0, 162, 7);
  });

  createTexture(scene, "course-fence", 72, 58, (g) => {
    g.fillStyle(0x684227).fillRect(6, 0, 10, 58).fillRect(56, 0, 10, 58);
    g.fillStyle(0xa16d37).fillRect(0, 13, 72, 10).fillRect(0, 37, 72, 10);
    g.fillStyle(0xd19a50).fillRect(4, 15, 64, 4).fillRect(4, 39, 64, 4);
  });

  createTexture(scene, "course-rock", 54, 36, (g) => {
    g.fillStyle(0x543e35).fillTriangle(2, 34, 20, 8, 34, 34);
    g.fillTriangle(19, 34, 36, 3, 52, 34);
    g.fillStyle(0x8f7868).fillTriangle(8, 30, 21, 11, 28, 30);
    g.fillStyle(0xb19a80).fillTriangle(27, 27, 36, 8, 43, 27);
  });

  createTexture(scene, "course-bush", 64, 47, (g) => {
    g.fillStyle(0x27582b).fillCircle(18, 29, 18).fillCircle(39, 21, 22);
    g.fillCircle(53, 31, 14);
    g.fillStyle(0x4f8a3d).fillCircle(20, 23, 10).fillCircle(41, 14, 12);
    g.fillStyle(0xf0bd4f).fillRect(29, 20, 5, 5).fillRect(48, 28, 5, 5);
  });

  createTexture(scene, "course-hay", 72, 50, (g) => {
    g.fillStyle(0x8e5a25).fillRoundedRect(2, 6, 68, 44, 8);
    g.fillStyle(0xe2a83c).fillRoundedRect(5, 2, 62, 43, 7);
    g.lineStyle(4, 0x9d6427).strokeRect(31, 4, 10, 40);
    g.fillStyle(0xf1c75b).fillRect(10, 10, 48, 5).fillRect(8, 29, 53, 4);
  });

  createTexture(scene, "course-zebu", 104, 66, (g) => {
    g.fillStyle(0xefe0bd).fillRoundedRect(14, 20, 67, 35, 12);
    g.fillStyle(0xc7ad7e).fillCircle(82, 28, 17).fillTriangle(69, 17, 75, 2, 82, 19);
    g.fillTriangle(84, 18, 95, 3, 93, 22);
    g.fillStyle(0x5d402d).fillRect(23, 49, 8, 17).fillRect(65, 49, 8, 17);
    g.fillStyle(0x694a31).fillCircle(86, 28, 3);
    g.fillStyle(0xd8c69f).fillCircle(43, 18, 13);
  });

  createTexture(scene, "course-chicken", 42, 38, (g) => {
    g.fillStyle(0xf3e4bf).fillCircle(20, 22, 14).fillCircle(30, 13, 9);
    g.fillStyle(0xd84e32).fillCircle(31, 4, 4);
    g.fillStyle(0xe2a52d).fillTriangle(38, 12, 42, 15, 37, 17);
    g.fillStyle(0x5b3824).fillRect(17, 33, 3, 5).fillRect(25, 33, 3, 5);
    g.fillCircle(33, 12, 2);
  });

  createTexture(scene, "course-trough", 86, 40, (g) => {
    g.fillStyle(0x4d2e20).fillRect(8, 25, 8, 15).fillRect(70, 25, 8, 15);
    g.fillStyle(0x875334).fillRoundedRect(0, 7, 86, 25, 7);
    g.fillStyle(0x4d8b8a).fillRect(8, 9, 70, 6);
  });
}
