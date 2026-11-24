import Phaser from "phaser";

const DEFAULT_TARGET = "Startup";

// Overlay commun : la scène cible effectue son preload derrière cet écran.
// Cela évite une page vide au lancement et lors de l'entrée dans Travel.
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("Loading");
  }

  init(data) {
    this.target =
      data?.target ??
      (new URLSearchParams(window.location.search).get("scene") === "movement"
        ? "Movement"
        : DEFAULT_TARGET);
    this.targetData = data?.data;
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor(0x0e2a1a);

    this.backdrop = this.add
      .rectangle(width / 2, height / 2, width, height, 0x0e2a1a)
      .setDepth(100);
    this.title = this.add
      .text(width / 2, height / 2 - 28, "LAKOROBE", {
        fontFamily: "SuperPixel, Arial, sans-serif",
        fontSize: "30px",
        color: "#fff0b5",
        stroke: "#35160e",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(101);
    this.status = this.add
      .text(width / 2, height / 2 + 28, "LOADING", {
        fontFamily: "SuperPixel, Arial, sans-serif",
        fontSize: "17px",
        color: "#9ce8a4",
      })
      .setOrigin(0.5)
      .setDepth(101);

    this.dots = 0;
    this.dotTimer = this.time.addEvent({
      delay: 260,
      loop: true,
      callback: () => {
        this.dots = (this.dots + 1) % 4;
        this.status.setText(`LOADING${".".repeat(this.dots)}`);
      },
    });

    this.scale.once("resize", this.layout, this);
    const targetScene = this.scene.get(this.target);
    targetScene.events.once(Phaser.Scenes.Events.CREATE, this.finish, this);
    this.scene.launch(this.target, this.targetData);
  }

  layout({ width, height }) {
    this.backdrop.setPosition(width / 2, height / 2).setSize(width, height);
    this.title.setPosition(width / 2, height / 2 - 28);
    this.status.setPosition(width / 2, height / 2 + 28);
  }

  finish() {
    this.dotTimer?.remove();
    this.tweens.add({
      targets: [this.backdrop, this.title, this.status],
      alpha: 0,
      duration: 180,
      onComplete: () => this.scene.stop(),
    });
  }
}
