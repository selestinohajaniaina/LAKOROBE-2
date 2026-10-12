import Phaser from "phaser";
import backgroundUrl from "../assets/lakorobe/backgroundBamboo.png";
import fontUrl from "../assets/fonts/SuperPixel.ttf";
import personIdleUrl from "../assets/sprite/person-1/Idle.png";
import personJumpUrl from "../assets/sprite/person-1/Jump.png";
import personRunUrl from "../assets/sprite/person-1/Run.png";
import createCourseTextures from "./runner/createCourseTextures";
import RunnerCourse from "./runner/RunnerCourse";

const FRAME_SIZE = 512;
const PLAYER_SCALE = 0.18;
const JUMP_SPEED = 610;
// const BASE_SPEED = 310;
const BASE_SPEED = 150;
const MAX_SPEED = 560;
const PLAYER_X_RATIO = 0.23;
const GRASS_SCALE = 0.625;
const GRASS_HEIGHT = 50;
const STATE = { READY: "ready", RUNNING: "running", OVER: "game-over" };
const SHEETS = {
  idle: personIdleUrl,
  run: personRunUrl,
  jump: personJumpUrl,
};

export default class MovementScene extends Phaser.Scene {
  constructor() {
    super("Movement");
  }

  preload() {
    this.load.image("runner-background", backgroundUrl);
    this.load.font("SuperPixel", fontUrl, "truetype");
    Object.entries(SHEETS).forEach(([name, url]) => {
      this.load.spritesheet(`person-1-${name}`, url, {
        frameWidth: FRAME_SIZE,
        frameHeight: FRAME_SIZE,
      });
    });
  }

  create() {
    this.rng = new Phaser.Math.RandomDataGenerator();
    this.createRunnerTextures();
    this.createEnvironment();
    this.createPlayerAnimations();
    this.createPlayer();
    this.course = new RunnerCourse(this);
    this.createInterface();
    this.createControls();

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(
      this.player,
      this.course.hazards,
      this.handleObstacleCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player,
      this.course.platforms,
      undefined,
      this.canLandOnPlatform,
      this
    );

    this.scale.on("resize", this.layout, this);
    this.input.on("pointerdown", this.handleAction, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", this.layout, this);
      this.input.off("pointerdown", this.handleAction, this);
    });

    this.layout({ width: this.scale.width, height: this.scale.height });
    this.resetGame(false);
  }

  createRunnerTextures() {
    createCourseTextures(this);
  }

  createEnvironment() {
    this.sky = this.add
      .rectangle(0, 0, 10, 10, 0xddeeb0)
      .setOrigin(0)
      .setDepth(-10);
    this.background = this.add
      .tileSprite(0, 0, 10, 10, "runner-background")
      .setOrigin(0).setAlpha(0.68).setDepth(-9);
    this.distantPlants = this.add
      .tileSprite(0, 0, 10, 170, "course-distant-plants")
      .setOrigin(0).setDepth(-5);
    this.groundVisual = this.add
      .tileSprite(0, 0, 10, 96, "course-ground")
      .setOrigin(0).setDepth(1);
    this.foregroundGrass = this.add
      .tileSprite(0, 0, 10, GRASS_HEIGHT, "course-grass")
      .setOrigin(0)
      .setTileScale(GRASS_SCALE)
      .setDepth(3)
      .setAlpha(0.8);

    this.ground = this.add.rectangle(0, 0, 10, 32, 0x000000, 0);
    this.ground.setOrigin(0.5, 0);
    this.physics.add.existing(this.ground, true);
  }

  createPlayerAnimations() {
    const animations = [
      ["person-1-idle", "person-1-idle", 0, 1, 2, -1],
      ["person-1-run", "person-1-run", 0, 3, 11, -1],
      ["person-1-jump", "person-1-jump", 0, 5, 12, 0],
      ["person-1-fall", "person-1-jump", 6, 10, 12, 0],
    ];
    animations.forEach(([key, texture, start, end, frameRate, repeat]) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(texture, { start, end }),
        frameRate,
        repeat,
      });
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(0, 0, "person-1-idle", 0);
    this.player.setScale(PLAYER_SCALE).setDepth(6).setCollideWorldBounds(true);
    this.player.body.setSize(210, 425).setOffset(151, 70);
    this.currentPlayerAnimation = null;
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      restart: Phaser.Input.Keyboard.KeyCodes.R,
      back: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
  }

  createInterface() {
    const style = {
      fontFamily: "SuperPixel, monospace",
      color: "#fff4c2",
      stroke: "#2c2418",
      strokeThickness: 5,
    };
    this.scoreText = this.add
      .text(20, 18, "SCORE 00000", { ...style, fontSize: "19px" })
      .setDepth(20);
    this.messageText = this.add
      .text(0, 0, "", {
        ...style,
        fontSize: "22px",
        align: "center",
        lineSpacing: 12,
      })
      .setOrigin(0.5).setDepth(20);
    this.backText = this.add
      .text(20, 51, "ÉCHAP : MENU", { ...style, fontSize: "12px" })
      .setDepth(20);
  }

  layout({ width, height }) {
    this.physics.world.setBounds(0, 0, width, height);
    this.groundY = Math.max(280, height - 92);
    this.sky.setSize(width, height);
    this.background.setSize(width, height);
    this.background.setTileScale(
      Math.max(width / this.background.texture.getSourceImage().width, 0.7)
    );
    this.distantPlants.setPosition(0, this.groundY - 168).setSize(width, 170);
    this.groundVisual.setPosition(0, this.groundY).setSize(width, height - this.groundY);
    this.foregroundGrass
      .setPosition(0, this.groundY - GRASS_HEIGHT + 4)
      .setSize(width, GRASS_HEIGHT);
    this.ground.setPosition(width / 2, this.groundY).setSize(width, 32);
    this.ground.body.setSize(width, 32);
    this.ground.body.updateFromGameObject();
    this.course.relayout(this.groundY);

    this.playerX = Phaser.Math.Clamp(width * PLAYER_X_RATIO, 100, 300);
    this.player.setX(this.playerX);
    if (this.isPlayerGrounded() || this.state !== STATE.RUNNING) {
      this.placePlayerOnGround();
    }
    this.messageText.setPosition(width / 2, Math.max(110, height * 0.32));
  }

  resetGame(startImmediately) {
    this.distance = 0;
    this.runTime = 0;
    this.scrollSpeed = BASE_SPEED;
    this.course.reset(this.groundY, this.scale.width);
    this.player.setVelocity(0, 0).setAcceleration(0, 0).setFlipX(false);
    this.placePlayerOnGround();
    this.scoreText.setText("SCORE 00000");

    if (startImmediately) {
      this.startGame();
    } else {
      this.state = STATE.READY;
      this.playPlayerAnimation("person-1-idle");
      this.messageText.setText("APPUIE SUR ESPACE\nPOUR COMMENCER").setVisible(true);
    }
  }

  startGame() {
    this.state = STATE.RUNNING;
    this.messageText.setVisible(false);
    this.playPlayerAnimation("person-1-run");
  }

  handleAction() {
    if (this.state === STATE.READY) this.startGame();
    else if (this.state === STATE.RUNNING) this.jump();
    else if (this.state === STATE.OVER) this.resetGame(true);
  }

  jump() {
    if (!this.isPlayerGrounded()) return;
    this.player.setVelocityY(-JUMP_SPEED);
    this.playPlayerAnimation("person-1-jump");
  }

  isPlayerGrounded() {
    return Boolean(
      this.player?.body?.blocked.down || this.player?.body?.touching.down
    );
  }

  canLandOnPlatform(player, platform) {
    if (player.body.velocity.y < 0) return false;
    const previousBottom = player.body.prev
      ? player.body.prev.y + player.body.height
      : player.body.bottom;
    return previousBottom <= platform.body.top + 14;
  }

  placePlayerOnGround() {
    const bodyBottom = (70 + 425 - FRAME_SIZE / 2) * PLAYER_SCALE;
    this.player.setPosition(this.playerX, this.groundY - bodyBottom);
  }

  handleObstacleCollision() {
    if (this.state !== STATE.RUNNING) return;
    this.state = STATE.OVER;
    this.course.stop();
    this.player.setVelocityX(0);
    this.playPlayerAnimation("person-1-idle");
    this.messageText
      .setText(`GAME OVER\nSCORE ${this.formatScore()}\nR OU TOUCHER POUR REJOUER`)
      .setVisible(true);
  }

  playPlayerAnimation(key) {
    if (this.currentPlayerAnimation === key) return;
    this.currentPlayerAnimation = key;
    this.player.play(key);
  }

  formatScore() {
    return String(Math.floor(this.distance / 100)).padStart(5, "0");
  }

  update(_time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.keys.back)) {
      this.scene.start("Startup");
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.restart)) {
      if (this.state === STATE.OVER) this.resetGame(true);
      return;
    }
    const actionPressed =
      Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.up);
    if (actionPressed) this.handleAction();

    this.player.setX(this.playerX).setVelocityX(0);
    if (this.state !== STATE.RUNNING) return;

    const seconds = Math.min(delta, 50) / 1000;
    this.runTime += seconds;
    this.scrollSpeed = Math.min(MAX_SPEED, BASE_SPEED + this.runTime * 5);
    this.distance += this.scrollSpeed * seconds;
    this.background.tilePositionX += this.scrollSpeed * seconds * 0.035;
    this.distantPlants.tilePositionX += this.scrollSpeed * seconds * 0.18;
    this.groundVisual.tilePositionX += this.scrollSpeed * seconds;
    this.foregroundGrass.tilePositionX += this.scrollSpeed * seconds * 1.12;

    this.course.update(seconds, this.scrollSpeed, this.scale.width);

    this.scoreText.setText(`SCORE ${this.formatScore()}`);
    if (!this.isPlayerGrounded()) {
      this.playPlayerAnimation(
        this.player.body.velocity.y < 0 ? "person-1-jump" : "person-1-fall"
      );
    } else {
      this.playPlayerAnimation("person-1-run");
    }
  }
}
