const HAZARD_X_OFFSET = 55;

const SEQUENCES = [
  {
    name: "chemin-du-village",
    length: 900,
    elements: [
      { role: "decor", texture: "course-house", x: 260 },
      { role: "decor", texture: "course-fence", x: 390 },
      { role: "hazard", texture: "course-rock", x: 520 },
      { role: "decor", texture: "course-bush", x: 650 },
      { role: "decor", texture: "course-fence", x: 790 },
    ],
  },
  {
    name: "toits-doubles",
    length: 980,
    elements: [
      { role: "decor", texture: "course-house", x: 220 },
      { role: "decor", texture: "course-house", x: 545 },
      { role: "hazard", texture: "course-bush", x: 820 },
    ],
  },
  {
    name: "arbres-et-branches",
    length: 1100,
    elements: [
      { role: "decor", texture: "course-tree", x: 180 },
      { role: "platform", texture: "course-branch", x: 185, height: 90 },
      { role: "decor", texture: "course-tree", x: 440 },
      { role: "platform", texture: "course-branch", x: 445, height: 108 },
      { role: "decor", texture: "course-tree", x: 700 },
      { role: "platform", texture: "course-branch", x: 705, height: 120 },
      { role: "hazard", texture: "course-rock", x: 960 },
    ],
  },
  {
    name: "ferme",
    length: 1180,
    elements: [
      { role: "decor", texture: "course-house", x: 170, tint: 0xe8c794 },
      { role: "decor", texture: "course-fence", x: 300 },
      { role: "hazard", texture: "course-zebu", x: 430 },
      { role: "decor", texture: "course-trough", x: 620 },
      { role: "hazard", texture: "course-chicken", x: 960, dynamic: true },
      { role: "decor", texture: "course-fence", x: 900 },
      { role: "hazard", texture: "course-hay", x: 1520 },
    ],
  },
  {
    name: "branche-vers-toit",
    length: 1120,
    elements: [
      { role: "decor", texture: "course-tree", x: 170 },
      { role: "platform", texture: "course-branch", x: 175, height: 92 },
      { role: "decor", texture: "course-tree", x: 430 },
      { role: "platform", texture: "course-branch", x: 435, height: 112 },
      { role: "decor", texture: "course-house", x: 700 },
      { role: "decor", texture: "course-fence", x: 835 },
      { role: "hazard", texture: "course-bush", x: 980 },
    ],
  },
  {
    name: "branches-hautes",
    length: 1180,
    elements: [
      { role: "decor", texture: "course-tree", x: 165 },
      { role: "platform", texture: "course-branch", x: 170, height: 96 },
      { role: "decor", texture: "course-tree", x: 400 },
      { role: "platform", texture: "course-branch", x: 405, height: 116 },
      { role: "decor", texture: "course-tree", x: 635 },
      { role: "platform", texture: "course-branch", x: 640, height: 106 },
      { role: "decor", texture: "course-tree", x: 870 },
      { role: "platform", texture: "course-branch", x: 875, height: 122 },
      { role: "hazard", texture: "course-rock", x: 1060 },
    ],
  },
];

const HITBOXES = {
  "course-rock": [44, 27, 5, 8],
  "course-bush": [52, 34, 6, 13],
  "course-zebu": [86, 52, 10, 14],
  "course-chicken": [31, 31, 6, 7],
  "course-hay": [62, 42, 5, 8],
};

export default class RunnerCourse {
  constructor(scene) {
    this.scene = scene;
    this.hazards = scene.physics.add.group({ allowGravity: false, immovable: true });
    this.platforms = scene.physics.add.group({ allowGravity: false, immovable: true });
    this.decorations = scene.add.group();
    this.createPools();
  }

  createPools() {
    for (let index = 0; index < 24; index += 1) {
      const hazard = this.hazards.create(-300, -300, "course-rock");
      hazard.setOrigin(0.5, 1).setDepth(5).disableBody(true, true);
    }
    for (let index = 0; index < 18; index += 1) {
      const platform = this.platforms.create(-300, -300, "course-roof");
      platform.setOrigin(0.5, 0).setDepth(4).disableBody(true, true);
    }
    for (let index = 0; index < 36; index += 1) {
      const decoration = this.scene.add.image(-300, -300, "course-bush");
      decoration.setOrigin(0.5, 1).setDepth(2).setActive(false).setVisible(false);
      this.decorations.add(decoration);
    }
  }

  reset(groundY, width) {
    this.groundY = groundY;
    this.sequenceIndex = 0;
    this.cursorX = width + 330;
    this.elapsed = 0;
    this.hazards.getChildren().forEach((item) => item.disableBody(true, true));
    this.platforms.getChildren().forEach((item) => item.disableBody(true, true));
    this.decorations.getChildren().forEach((item) => {
      item.setActive(false).setVisible(false).clearTint();
    });
    this.fillAhead(width);
  }

  fillAhead(width) {
    while (this.cursorX < width + 1300) {
      const sequence = this.pickSequence();
      this.spawnSequence(sequence, this.cursorX);
      this.cursorX += sequence.length;
    }
  }

  pickSequence() {
    if (this.sequenceIndex < SEQUENCES.length) {
      return SEQUENCES[this.sequenceIndex++];
    }
    const previous = this.lastRandomIndex;
    let index = this.scene.rng.between(0, SEQUENCES.length - 1);
    if (index === previous) index = (index + 1) % SEQUENCES.length;
    this.lastRandomIndex = index;
    return SEQUENCES[index];
  }

  spawnSequence(sequence, startX) {
    sequence.elements.forEach((definition) => {
      if (definition.role === "hazard") this.spawnHazard(definition, startX);
      else if (definition.role === "platform") this.spawnPlatform(definition, startX);
      else this.spawnDecoration(definition, startX);
    });
  }

  spawnHazard(definition, startX) {
    const hazard = this.hazards.getFirstDead(false);
    if (!hazard) return;
    hazard.setTexture(definition.texture).setOrigin(0.5, 1);
    hazard.enableBody(
      true,
      startX + definition.x + HAZARD_X_OFFSET,
      this.groundY,
      true,
      true
    );
    hazard.body.setAllowGravity(false).setImmovable(true);
    const [width, height, offsetX, offsetY] = HITBOXES[definition.texture];
    hazard.body.setSize(width, height).setOffset(offsetX, offsetY);
    hazard.setDataEnabled();
    hazard.data.set({
      role: "hazard",
      groundOffset: 0,
      dynamic: Boolean(definition.dynamic),
      phase: this.scene.rng.realInRange(0, Math.PI * 2),
    });
  }

  spawnPlatform(definition, startX) {
    const platform = this.platforms.getFirstDead(false);
    if (!platform) return;
    platform.setTexture(definition.texture).setOrigin(0.5, 0);
    platform.enableBody(
      true,
      startX + definition.x,
      this.groundY - definition.height,
      true,
      true
    );
    platform.body.setAllowGravity(false).setImmovable(true);
    platform.body.setSize(platform.width, 12).setOffset(0, 0);
    platform.setDataEnabled();
    platform.data.set({ role: "platform", groundOffset: definition.height });
  }

  spawnDecoration(definition, startX) {
    const decoration = this.decorations.getFirstDead(false);
    if (!decoration) return;
    decoration
      .setTexture(definition.texture)
      .setPosition(startX + definition.x, this.groundY)
      .setActive(true)
      .setVisible(true);
    if (definition.tint) decoration.setTint(definition.tint);
    decoration.setDataEnabled();
    decoration.data.set({ role: "decor", groundOffset: 0 });
  }

  update(deltaSeconds, speed, width) {
    const movement = speed * deltaSeconds;
    this.elapsed += deltaSeconds;
    this.cursorX -= movement;

    this.hazards.getChildren().forEach((hazard) => {
      if (!hazard.active) return;
      hazard.x -= movement;
      if (hazard.data.get("dynamic")) {
        hazard.y = this.groundY - Math.abs(Math.sin(this.elapsed * 5 + hazard.data.get("phase"))) * 4;
      }
      hazard.body.updateFromGameObject();
      if (hazard.x < -160) hazard.disableBody(true, true);
    });

    this.platforms.getChildren().forEach((platform) => {
      if (!platform.active) return;
      platform.x -= movement;
      platform.body.updateFromGameObject();
      if (platform.x + platform.displayWidth / 2 < -100) {
        platform.disableBody(true, true);
      }
    });

    this.decorations.getChildren().forEach((decoration) => {
      if (!decoration.active) return;
      decoration.x -= movement;
      if (decoration.x + decoration.displayWidth / 2 < -120) {
        decoration.setActive(false).setVisible(false).clearTint();
      }
    });
    this.fillAhead(width);
  }

  relayout(groundY) {
    this.groundY = groundY;
    this.hazards.getChildren().forEach((item) => {
      if (!item.active) return;
      item.y = groundY;
      item.body.updateFromGameObject();
    });
    this.platforms.getChildren().forEach((item) => {
      if (!item.active) return;
      item.y = groundY - item.data.get("groundOffset");
      item.body.updateFromGameObject();
    });
    this.decorations.getChildren().forEach((item) => {
      if (item.active) item.y = groundY;
    });
  }

  stop() {
    // Movement is manual, so leaving update() is enough to freeze every pool.
  }
}

export { SEQUENCES };
