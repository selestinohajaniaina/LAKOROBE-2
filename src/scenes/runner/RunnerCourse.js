import { SEQUENCES_BY_THEME, HITBOXES } from "./courseSequences";

const HAZARD_X_OFFSET = 120; // plus grand = obstacles plus à droite
const SEQUENCE_GAP = 120; // pixels vides entre deux séquences

export default class RunnerCourse {
  constructor(scene) {
    this.scene = scene;
    this.hazards = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.platforms = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
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
      decoration
        .setOrigin(0.5, 1)
        .setDepth(2)
        .setActive(false)
        .setVisible(false);
      this.decorations.add(decoration);
    }
  }

  reset(groundY, width) {
    this.groundY = groundY;
    this.sequenceIndex = 0;
    this.cursorX = width + 330;
    this.elapsed = 0;
    this.hazards.getChildren().forEach((item) => item.disableBody(true, true));
    this.platforms
      .getChildren()
      .forEach((item) => item.disableBody(true, true));
    this.decorations.getChildren().forEach((item) => {
      item.setActive(false).setVisible(false).clearTint();
    });
    this.fillAhead(width);
    this.lastRandomIndex = undefined;
  }

  fillAhead(width) {
    while (this.cursorX < width + 1300) {
      const sequence = this.pickSequence();
      if (!sequence) return;
      this.spawnSequence(sequence, this.cursorX);
      this.cursorX += sequence.length + SEQUENCE_GAP;
    }
  }

  pickSequence() {
    const list = SEQUENCES_BY_THEME[this.scene.currentTheme.id];
    if (!Array.isArray(list) || list.length === 0) {
      console.warn(
        `No course sequences configured for theme "${this.scene.currentTheme.id}".`
      );
      return undefined;
    }
    if (this.sequenceIndex < list.length) return list[this.sequenceIndex++];
    let index = this.scene.rng.between(0, list.length - 1);
    if (index === this.lastRandomIndex) index = (index + 1) % list.length;
    this.lastRandomIndex = index;
    return list[index];
  }

  spawnSequence(sequence, startX) {
    if (!sequence?.elements) return;
    sequence.elements.forEach((definition) => {
      if (definition.role === "hazard") this.spawnHazard(definition, startX);
      else if (definition.role === "platform")
        this.spawnPlatform(definition, startX);
      else this.spawnDecoration(definition, startX);
    });
  }

  spawnHazard(definition, startX) {
    const hazard = this.hazards.getFirstDead(false);
    if (!hazard) return;
    hazard.setTexture(definition.texture).setOrigin(0.5, 1);
    hazard.enableBody(
      true,
      startX + definition.x + HAZARD_X_OFFSET + (definition.dx ?? 0),
      this.groundY,
      true,
      true
    );
    hazard.body.setAllowGravity(false).setImmovable(true);
    const [width, height, offsetX, offsetY] = HITBOXES[definition.texture] ?? [
      hazard.width,
      hazard.height,
      0,
      0,
    ];
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
        hazard.y =
          this.groundY -
          Math.abs(Math.sin(this.elapsed * 5 + hazard.data.get("phase"))) * 4;
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
