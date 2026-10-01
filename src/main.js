import Phaser from "phaser";
import Startup from "./scenes/startup";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#102f20",
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: "100%",
    height: "100%",
  },
  scene: Startup,
};

new Phaser.Game(config);
