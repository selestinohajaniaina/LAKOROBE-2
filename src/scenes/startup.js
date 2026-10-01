import Phaser from "phaser";

const assetUrl = (path) => new URL(path, import.meta.url).href;

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
}
