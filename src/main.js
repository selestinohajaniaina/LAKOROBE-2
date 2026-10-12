import Phaser from "phaser";
import Startup from "./scenes/startup";
import MovementScene from "./scenes/MovementScene";

const movementTestRequested =
  new URLSearchParams(window.location.search).get("scene") === "movement";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#102f20",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: "100%",
    height: "100%",
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 1400 },
      debug: false,
    },
  },
  scene: movementTestRequested
    ? [MovementScene, Startup]
    : [Startup, MovementScene],
};

new Phaser.Game(config);
