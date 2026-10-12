import Phaser from "phaser";

const assetUrl = (path) => new URL(path, import.meta.url).href;
const BUTTON_HEIGHT = 50;
const BUTTON_COUNT = 4;
const COLORS = {
  normal: 0x6f321b,
  hover: 0x934821,
  pressed: 0x4c2116,
  selected: 0x3f7d32,
  border: 0xf2bd55,
};

export default class Startup extends Phaser.Scene {
  constructor() {
    super("Startup");
  }

  preload() {
    // image
    this.load.image(
      "startup-background",
      assetUrl("../assets/lakorobe/backgroundBamboo.png")
    );
    this.load.image(
      "startup-logo",
      assetUrl("../assets/lakorobe/lakorobe.png")
    );
    this.load.spritesheet(
      "litle-bamboo",
      assetUrl("../assets/lakorobe/litle-bamboo.png"),
      {
        frameWidth: 335,
        frameHeight: 480,
      }
    );

    this.load.spritesheet(
      "bararata",
      assetUrl("../assets/lakorobe/bararata.png"),
      {
        frameWidth: 480,
        frameHeight: 480,
      }
    );

    this.load.spritesheet(
      "feuille",
      assetUrl("../assets/lakorobe/feuille.png"),
      {
        frameWidth: 480,
        frameHeight: 480,
      }
    );

    this.load.audio("startup", assetUrl("../assets/song/startup1.mp3"));

    // font
    this.load.font(
      "SuperPixel",
      assetUrl("../assets/fonts/SuperPixel.ttf"),
      "truetype"
    );
  }

  create() {
    this.background = this.add.image(0, 0, "startup-background");
    this.logo = this.add.image(0, 0, "startup-logo").setDepth(10); // z-index

    this.bamboo = this.showAnimations(
      "bamboo",
      "litle-bamboo",
      20,
      this.scale.height,
      0,
      3,
      3,
      1
    );
    this.bararata = this.showAnimations(
      "bararata",
      "bararata",
      (2 * this.scale.width) / 3 + 60,
      this.scale.height + 20,
      0,
      120,
      11
    );
    this.feuille = this.showAnimations(
      "feuille",
      "feuille",
      0,
      this.scale.height / 2 - 80,
      0,
      5,
      7
    );
    this.setResize();
    this.startupSong = this.sound.add("startup", {
      loop: true,
    });

    this.startupSong.play();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.startupSong.stop();
      this.startupSong.destroy();
    });

    this.buttons = [];
    this.createButton(["Play", "Movement"], 0);
    this.createButton(["Mission", "hello"], 1);
    this.createButton(["Level", "hello"], 2);
    this.createButton(["Setting", "hello"], 3);
  }

  setResize() {
    this.scale.on("resize", this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
      this.scale.off("resize", this.layout, this)
    );
    this.layout({
      width: this.scale.width,
      height: this.scale.height,
    });
  }

  layout({ width, height }) {
    this.layoutBackground({
      width: this.scale.width,
      height: this.scale.height,
    });
    this.layoutLogo({
      width: this.scale.width,
      height: this.scale.height,
    });
    this.layoutBamboo({
      width: this.scale.width,
      height: this.scale.height,
    });
    this.layoutBararata({
      width: this.scale.width,
      height: this.scale.height,
    });
    this.layoutFeuille({
      width: this.scale.width,
      height: this.scale.height,
    });
    this.layoutButtons({
      width: this.scale.width,
      height: this.scale.height,
    });
  }

  layoutBackground({ width, height }) {
    this.background
      .setPosition(width / 2, height / 2)
      .setScale(
        Math.max(width / this.background.width, height / this.background.height)
      );
  }

  layoutLogo({ width, height }) {
    const portrait = height > width;
    const compact = width < 600 || height < 650;
    const percent = 0.9;
    const logoScale = Math.min(
      (portrait ? width * percent : Math.min(width * percent, 640)) /
        this.logo.width,
      (portrait ? height * percent : height * percent) / this.logo.height
    );
    const logoY = height * (portrait ? 0.3 : 0.3);
    this.logo.setPosition(width / 2, logoY).setScale(logoScale);
  }

  layoutBamboo({ width, height }) {
    const portrait = height > width;
    const compact = width < 600 || height < 650;
    const percent = 0.3;
    const bambooScale = Math.min(
      (portrait ? width * percent : Math.min(width * percent, 640)) /
        this.bamboo.width,
      (portrait ? height * percent : height * percent) / this.bamboo.height
    );
    this.bamboo.setOrigin(0, 1).setScale(bambooScale);
  }

  layoutBararata({ width, height }) {
    const portrait = height > width;
    const compact = width < 600 || height < 650;
    const percent = 0.4;
    const bararataScale = Math.min(
      (portrait ? width * percent : Math.min(width * percent, 640)) /
        this.bararata.width,
      (portrait ? height * percent : height * percent) / this.bararata.height
    );
    this.bararata.setOrigin(0, 1).setScale(bararataScale);
    this.bararata.setPosition(
      (2 * this.scale.width) / 3 + 60,
      this.scale.height + 20
    );
  }

  layoutFeuille({ width, height }) {
    const portrait = height > width;
    const compact = width < 600 || height < 650;
    const percent = 0.4;
    const feuilleScale = Math.min(
      (portrait ? width * percent : Math.min(width * percent, 640)) /
        this.feuille.width,
      (portrait ? height * percent : height * percent) / this.feuille.height
    );
    this.feuille.setOrigin(0, 1).setScale(feuilleScale);
  }

  layoutButtons({ width, height }) {
    console.log("buttons", this.buttons);
    
    this.buttons?.map((e, i) => {
      const { x, y, w } = this.getButtonPosition(BUTTON_COUNT, i);
      e.setPosition(x, y);
      e.setSize(w, BUTTON_HEIGHT).setInteractive({ useHandCursor: true });
      this.drawButton(e);
    });
  }

  showAnimations(
    key,
    name,
    x,
    y,
    start = 0,
    end = 44,
    frameRate = 12,
    scale = 0.5
  ) {
    this.anims.create({
      key: key,
      frames: this.anims.generateFrameNumbers(name, {
        start: start,
        end: end,
      }),
      frameRate: frameRate,
      repeat: -1,
    });

    const anim = this.add.sprite(x, y, name);
    anim.setScale(scale);
    anim.setOrigin(0, 1);
    anim.play(key);
    return anim;
  }

  createButton([labelText, message], index) {
    const { x, y, w } = this.getButtonPosition(BUTTON_COUNT, index);
    const button = this.add.container(x, y).setDepth(10).setAlpha(1);
    button.background = this.add.graphics();
    button.label = this.add
      .text(0, -3, labelText, {
        fontFamily: "SuperPixel, Arial, sans-serif",
        fontSize: "24px",
        color: "#fff0b5",
        stroke: "#35160e",
        strokeThickness: 5,
      })
      .setOrigin(0.5);
    button.add([button.background, button.label]);
    button.setSize(w, BUTTON_HEIGHT).setInteractive({ useHandCursor: true });
    button.state = "normal";
    button.message = message;
    button.on("pointerover", () => this.setButtonState(button, "hover"));
    button.on("pointerout", () => this.setButtonState(button, "normal"));
    button.on("pointerdown", () => this.setButtonState(button, "pressed"));
    button.on("pointerup", (pointer) => {
      if (!button.getBounds().contains(pointer.x, pointer.y)) return;
      this.setButtonState(button, "hover");
      if (button.message === "Movement") this.scene.start(button.message);
    });
    this.drawButton(button);
    this.buttons.push(button);
  }

  drawButton(button) {
    const width = button.width;
    const height = button.height;
    button.background.clear();
    button.background.fillStyle(0x091d12, 0.4);
    button.background.fillRoundedRect(
      -width / 2 + 4,
      -height / 2 + 6,
      width - 8,
      height - 2,
      15
    );
    button.background.fillStyle(COLORS[button.state], 0.98);
    button.background.fillRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height - 6,
      15
    );
    button.background.lineStyle(
      button.state === "selected" ? 4 : 3,
      COLORS.border,
      1
    );
    button.background.strokeRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height - 6,
      15
    );
    button.background.lineStyle(2, 0xffd77b, 0.4);
    button.background.lineBetween(
      -width / 2 + 22,
      -height / 2 + 9,
      width / 2 - 22,
      -height / 2 + 9
    );
  }

  setButtonState(button, state) {
    button.state = state;
    this.drawButton(button);
    this.tweens.killTweensOf(button);
    const scale = state === "pressed" ? 0.96 : state === "hover" ? 1.035 : 1;
    this.tweens.add({ targets: button, scale, duration: 90, ease: "Quad.Out" });
  }

  getButtonPosition(nomberOfButton, position) {
    const W = this.scale.width;
    const H = this.scale.height;
    const gap = 10;

    let x = W / 2;
    let y = H / 2 + BUTTON_HEIGHT * 2;
    y = y + gap * position + position * BUTTON_HEIGHT;

    if (nomberOfButton > 4) {
      x /= 2;
    }

    let w = Math.min(320, W / 2);
    w = Math.max(160, w);
    return { x, y, w };
  }
}
