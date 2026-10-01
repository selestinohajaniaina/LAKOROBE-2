import Phaser from "phaser";

const assetUrl = (path) => new URL(path, import.meta.url).href;
const COLORS = {
  normal: 0x6f321b,
  hover: 0x934821,
  pressed: 0x4c2116,
  selected: 0x3f7d32,
  border: 0xf2bd55,
};

const MENU_ITEMS = [
  ["JOUER", "L'aventure arrive bientôt !"],
  ["RÉGLAGES", "Réglages — bientôt disponibles"],
  ["CRÉDITS", "Crédits — bientôt disponibles"],
  ["CLASSEMENT", "Classement — bientôt disponibles"],
];

const BUTTON_HEIGHT = 56;

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

    // font
    this.load.font(
      "SuperPixel",
      assetUrl("../assets/fonts/SuperPixel.ttf"),
      "truetype"
    );

    // audio
    this.load.audio("menu-click", assetUrl("../assets/song/click.mp3"));
    this.load.audio("menu-popup", assetUrl("../assets/song/popup.mp3"));

    // sprites
    this.load.spritesheet(
      "startup-maki",
      assetUrl("../assets/lakorobe/maki-3.png"),
      { frameWidth: 480, frameHeight: 469 }
    );
    this.load.spritesheet(
      "startup-bamboo",
      assetUrl("../assets/lakorobe/litle-bamboo.png"),
      { frameWidth: 335, frameHeight: 480 }
    );
    this.load.spritesheet(
      "startup-leaves",
      assetUrl("../assets/lakorobe/feuille.png"),
      { frameWidth: 480, frameHeight: 480 }
    );
  }

  create() {
    this.buttons = [];
    this.selectedIndex = null;
    this.modal = null;
    this.createAnimations();

    this.background = this.add.image(0, 0, "startup-background");
    this.shade = this.add.rectangle(0, 0, 1, 1, 0x102f20, 0.32).setOrigin(0);
    this.glow = this.add.ellipse(0, 0, 1, 1, 0xffefac, 0.13);

    this.leftLeaves = this.add
      .sprite(0, 0, "startup-leaves")
      .setOrigin(0, 1)
      .setDepth(2)
      .play("startup-leaves-sway");
    this.rightLeaves = this.add
      .sprite(0, 0, "startup-leaves")
      .setOrigin(0, 1)
      .setFlipX(true)
      .setDepth(2)
      .play("startup-leaves-sway");
    this.bamboo = this.add
      .sprite(0, 0, "startup-bamboo")
      .setOrigin(0.5, 1)
      .setDepth(2)
      .play("startup-bamboo-sway");
    this.maki = this.add
      .sprite(0, 0, "startup-maki")
      .setOrigin(0.5, 1)
      .setDepth(3)
      .play("startup-maki-idle");

    this.menuPanel = this.add.graphics().setDepth(9).setAlpha(0.72);
    this.logo = this.add
      .image(0, 0, "startup-logo")
      .setDepth(10)
      .setAlpha(0.82);

    // create all bouton
    MENU_ITEMS.forEach((item, index) => this.createButton(item, index));

    // alert
    this.hint = this.add
      .text(0, 0, "CLIQUEZ, TOUCHEZ OU UTILISEZ ↑ ↓ + ENTRÉE", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#fff4c9",
        stroke: "#12351f",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(10)
      .setAlpha(0.55);

    this.input.keyboard.on("keydown-UP", () => this.moveSelection(-1));
    this.input.keyboard.on("keydown-DOWN", () => this.moveSelection(1));
    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.modal) this.closePanel();
      else this.activateButton(this.selectedIndex ?? 0);
    });
    this.scale.on("resize", this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
      this.scale.off("resize", this.layout, this)
    );
    this.layout({ width: this.scale.width, height: this.scale.height });
    this.playIntro();
  }

  createAnimations() {
    const animations = [
      ["startup-maki-idle", "startup-maki", 40, 10],
      ["startup-bamboo-sway", "startup-bamboo", 3, 3],
      ["startup-leaves-sway", "startup-leaves", 5, 4],
    ];
    animations.forEach(([key, texture, end, frameRate]) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(texture, { start: 0, end }),
        frameRate,
        repeat: -1,
        yoyo: texture !== "startup-maki",
      });
    });
  }

  createButton([labelText, message], index) {
    const button = this.add.container(0, 0).setDepth(10).setAlpha(0.72);
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
    button.setSize(320, BUTTON_HEIGHT).setInteractive({ useHandCursor: true });
    button.state = "normal";
    button.message = message;
    button.on("pointerover", () => this.selectButton(index, "hover"));
    button.on("pointerout", () => this.setButtonState(button, "normal"));
    button.on("pointerdown", () => this.selectButton(index, "pressed"));
    button.on("pointerup", (pointer) => {
      if (button.getBounds().contains(pointer.x, pointer.y))
        this.activateButton(index);
    });
    this.buttons.push(button);
    this.drawButton(button);
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

  selectButton(index, state = "selected") {
    this.selectedIndex = index;
    this.buttons.forEach((button, i) =>
      this.setButtonState(button, i === index ? state : "normal")
    );
  }

  setButtonState(button, state) {
    button.state = state;
    this.drawButton(button);
    this.tweens.killTweensOf(button);
    const scale = state === "pressed" ? 0.96 : state === "hover" ? 1.035 : 1;
    this.tweens.add({ targets: button, scale, duration: 90, ease: "Quad.Out" });
  }

  moveSelection(direction) {
    if (this.modal) return;
    const current = this.selectedIndex ?? (direction > 0 ? -1 : 0);
    this.selectButton(
      Phaser.Math.Wrap(current + direction, 0, this.buttons.length)
    );
  }

  activateButton(index) {
    this.selectButton(index, "selected");
    this.sound.play("menu-click", { volume: 0.45 });
    this.time.delayedCall(100, () =>
      this.showPanel(this.buttons[index].message)
    );
  }

  showPanel(message) {
    if (this.modal) this.modal.destroy(true);
    const width = Math.min(this.scale.width - 36, 520);
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x06150e, 0.7)
      .setOrigin(0)
      .setInteractive();
    const panel = this.add.graphics();
    panel
      .fillStyle(0x143c28, 0.98)
      .fillRoundedRect(-width / 2, -95, width, 190, 24);
    panel
      .lineStyle(4, COLORS.border, 1)
      .strokeRoundedRect(-width / 2, -95, width, 190, 24);
    const text = this.add
      .text(0, -20, message, {
        fontFamily: "SuperPixel, Arial, sans-serif",
        fontSize: this.scale.width < 480 ? "20px" : "24px",
        color: "#fff0b5",
        stroke: "#071b10",
        strokeThickness: 5,
        align: "center",
        wordWrap: { width: width - 50 },
      })
      .setOrigin(0.5);
    const close = this.add
      .text(0, 55, "TOUCHER POUR FERMER", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#d7e9b8",
      })
      .setOrigin(0.5);
    this.modal = this.add
      .container(this.scale.width / 2, this.scale.height / 2, [
        overlay,
        panel,
        text,
        close,
      ])
      .setDepth(50)
      .setScale(0.86)
      .setAlpha(0);
    overlay.setPosition(-this.scale.width / 2, -this.scale.height / 2);
    overlay.on("pointerup", () => this.closePanel());
    this.input.keyboard.once("keydown-ESC", () => this.closePanel());
    this.sound.play("menu-popup", { volume: 0.25 });
    this.tweens.add({
      targets: this.modal,
      alpha: 1,
      scale: 1,
      duration: 220,
      ease: "Back.Out",
    });
  }

  closePanel() {
    if (!this.modal) return;
    const modal = this.modal;
    this.modal = null;
    this.tweens.add({
      targets: modal,
      alpha: 0,
      scale: 0.94,
      duration: 150,
      onComplete: () => modal.destroy(true),
    });
  }

  layout({ width, height }) {
    const portrait = height > width;
    const compact = width < 600 || height < 650;
    this.background
      .setPosition(width / 2, height / 2)
      .setScale(
        Math.max(width / this.background.width, height / this.background.height)
      );
    this.shade.setSize(width, height);
    this.glow
      .setPosition(width / 2, height * 0.2)
      .setDisplaySize(width * 0.72, height * 0.72);
    const logoScale = Math.min(
      (portrait ? width * 0.92 : Math.min(width * 0.55, 640)) / this.logo.width,
      (portrait ? height * 0.29 : height * 0.36) / this.logo.height
    );
    const logoY = height * (portrait ? 0.2 : 0.22);
    this.logo.setPosition(width / 2, logoY).setScale(logoScale);
    const buttonWidth = Math.min(Math.max(width * 0.68, 250), 350);
    const buttonHeight = compact ? 50 : BUTTON_HEIGHT;
    const gap = compact ? 8 : 12;
    const startY = Math.max(
      height * (portrait ? 0.45 : 0.47),
      logoY + this.logo.displayHeight / 2 + 18
    );
    this.buttons.forEach((button, index) => {
      button
        .setPosition(width / 2, startY + index * (buttonHeight + gap))
        .setSize(buttonWidth, buttonHeight);
      button.label.setFontSize(compact ? 20 : 24);
      this.drawButton(button);
    });
    const padding = 18;
    const panelHeight =
      this.buttons.length * buttonHeight +
      (this.buttons.length - 1) * gap +
      padding * 2;
    this.menuPanel
      .clear()
      .fillStyle(0x0b2b1b, 0.5)
      .fillRoundedRect(
        width / 2 - buttonWidth / 2 - padding,
        startY - buttonHeight / 2 - padding,
        buttonWidth + padding * 2,
        panelHeight,
        24
      );
    this.menuPanel
      .lineStyle(2, COLORS.border, 0.3)
      .strokeRoundedRect(
        width / 2 - buttonWidth / 2 - padding,
        startY - buttonHeight / 2 - padding,
        buttonWidth + padding * 2,
        panelHeight,
        24
      );
    const bottom =
      startY +
      (this.buttons.length - 1) * (buttonHeight + gap) +
      buttonHeight / 2;
    this.hint
      .setPosition(width / 2, Math.min(bottom + 36, height - 20))
      .setFontSize(width < 440 ? 10 : 13)
      .setWordWrapWidth(width - 28);
    const decorScale = Phaser.Math.Clamp(
      Math.min(width, height) / 850,
      0.38,
      0.72
    );
    this.leftLeaves.setPosition(0, height + 18).setScale(decorScale);
    this.rightLeaves.setPosition(width, height + 18).setScale(decorScale);
    this.bamboo
      .setPosition(width * 0.12, height + 10)
      .setScale(decorScale * 0.72)
      .setVisible(width > 520);
    this.maki
      .setPosition(width * 0.88, height + 8)
      .setScale(decorScale * 0.7)
      .setVisible(!portrait || width > 520);
    if (this.modal) this.closePanel();
  }

  playIntro() {
    this.tweens.add({
      targets: this.logo,
      alpha: 1,
      y: "+=8",
      duration: 720,
      ease: "Back.Out",
      onComplete: () => {
        this.tweens.add({
          targets: this.logo,
          scaleX: this.logo.scaleX * 1.025,
          scaleY: this.logo.scaleY * 1.025,
          duration: 2200,
          yoyo: true,
          repeat: -1,
          ease: "Sine.InOut",
        });
      },
    });
    this.tweens.add({
      targets: this.menuPanel,
      alpha: 1,
      duration: 500,
      delay: 250,
    });
    this.tweens.add({
      targets: [...this.buttons, this.hint],
      alpha: 1,
      duration: 420,
      delay: this.tweens.stagger(110, { start: 320 }),
    });
    this.tweens.add({
      targets: this.hint,
      alpha: { from: 0.45, to: 0.95 },
      duration: 1200,
      delay: 1200,
      yoyo: true,
      repeat: -1,
    });
  }
}
