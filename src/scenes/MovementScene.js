import Phaser from "phaser";
import backgroundUrl from "../assets/lakorobe/backgroundBamboo.png";
import fontUrl from "../assets/fonts/SuperPixel.ttf";
import personIdleUrl from "../assets/sprite/person-1/Idle.png";
import personJumpUrl from "../assets/sprite/person-1/Jump.png";
import personRunUrl from "../assets/sprite/person-1/Run.png";

const FRAME_SIZE = 512;
const PLAYER_SCALE = 0.18;
const JUMP_SPEED = 610;
const BASE_SPEED = 310;
const MAX_SPEED = 560;
const PLAYER_X_RATIO = 0.23;
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
    this.createRunnerTextures();
    this.createEnvironment();
    this.createPlayerAnimations();
    this.createPlayer();
    this.createObstacles();
    this.createInterface();
    this.createControls();

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.handleObstacleCollision,
      undefined,
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
    if (this.textures.exists("runner-ground")) return;
    const graphics = this.make.graphics({ add: false });

    graphics.fillStyle(0x9f4728).fillRect(0, 0, 256, 96);
    graphics.fillStyle(0xc96535).fillRect(0, 0, 256, 12);
    graphics.fillStyle(0x7d351f);
    graphics.fillRect(18, 31, 18, 5).fillRect(116, 66, 25, 5);
    graphics.fillRect(211, 39, 12, 4).fillRect(65, 83, 9, 4);
    graphics.fillStyle(0xe18a4f);
    graphics.fillRect(54, 24, 8, 4).fillRect(170, 48, 13, 4);
    graphics.generateTexture("runner-ground", 256, 96);
    graphics.clear();

    graphics.fillStyle(0x416f36);
    graphics.fillTriangle(0, 170, 110, 55, 230, 170);
    graphics.fillTriangle(155, 170, 330, 25, 510, 170);
    graphics.fillTriangle(405, 170, 560, 70, 640, 170);
    graphics.fillStyle(0x5e8d42);
    graphics.fillCircle(65, 144, 44).fillCircle(137, 139, 55);
    graphics.fillCircle(425, 142, 52).fillCircle(530, 145, 43);
    graphics.generateTexture("runner-distant-plants", 640, 170);
    graphics.clear();

    graphics.fillStyle(0x355c2b);
    for (let x = 0; x < 512; x += 64) {
      graphics.fillTriangle(x, 80, x + 18, 20, x + 29, 80);
      graphics.fillTriangle(x + 20, 80, x + 43, 38, x + 54, 80);
    }
    graphics.fillStyle(0x6b913d).fillRect(0, 72, 512, 8);
    graphics.generateTexture("runner-foreground-grass", 512, 80);
    graphics.clear();

    graphics.fillStyle(0x54291d).fillRoundedRect(5, 12, 62, 24, 8);
    graphics.fillStyle(0x7e4028).fillRoundedRect(9, 7, 54, 22, 7);
    graphics.fillStyle(0xb76537).fillRect(15, 11, 32, 5);
    graphics.fillStyle(0x3f211b).fillCircle(59, 20, 8);
    graphics.generateTexture("runner-log", 72, 38);
    graphics.clear();

    graphics.fillStyle(0x543e35).fillTriangle(2, 34, 20, 8, 34, 34);
    graphics.fillTriangle(19, 34, 36, 3, 52, 34);
    graphics.fillStyle(0x78645a).fillTriangle(8, 30, 21, 11, 28, 30);
    graphics.fillStyle(0xa08a73).fillTriangle(27, 27, 36, 8, 43, 27);
    graphics.generateTexture("runner-rock", 54, 36);
    graphics.destroy();
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
      .tileSprite(0, 0, 10, 170, "runner-distant-plants")
      .setOrigin(0).setDepth(-5);
    this.groundVisual = this.add
      .tileSprite(0, 0, 10, 96, "runner-ground")
      .setOrigin(0).setDepth(1);
    this.foregroundGrass = this.add
      .tileSprite(0, 0, 10, 80, "runner-foreground-grass")
      .setOrigin(0).setDepth(8).setAlpha(0.8);

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

  createObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
      maxSize: 10,
    });
    for (let index = 0; index < 10; index += 1) {
      const obstacle = this.obstacles.create(-200, -200, "runner-rock");
      obstacle.setOrigin(0.5, 1).setDepth(5).disableBody(true, true);
    }
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
    this.foregroundGrass.setPosition(0, this.groundY - 67).setSize(width, 80);
    this.ground.setPosition(width / 2, this.groundY).setSize(width, 32);
    this.ground.body.setSize(width, 32);
    this.ground.body.updateFromGameObject();

    this.playerX = Phaser.Math.Clamp(width * PLAYER_X_RATIO, 100, 300);
    this.player.setX(this.playerX);
    if (this.isPlayerGrounded() || this.state !== STATE.RUNNING) {
      this.placePlayerOnGround();
    }
    this.messageText.setPosition(width / 2, Math.max(110, height * 0.32));
  }

  resetGame(startImmediately) {
    this.obstacles.getChildren().forEach((obstacle) => {
      obstacle.disableBody(true, true);
    });
    this.distance = 0;
    this.runTime = 0;
    this.scrollSpeed = BASE_SPEED;
    this.spawnCountdown = 1500;
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
    this.spawnCountdown = 1500;
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

  placePlayerOnGround() {
    const bodyBottom = (70 + 425 - FRAME_SIZE / 2) * PLAYER_SCALE;
    this.player.setPosition(this.playerX, this.groundY - bodyBottom);
  }

  spawnObstacle() {
    const obstacle = this.obstacles.getFirstDead(false);
    if (!obstacle) return;
    const isRock = Phaser.Math.Between(0, 1) === 0;
    obstacle.setTexture(isRock ? "runner-rock" : "runner-log");
    obstacle.enableBody(
      true,
      this.scale.width + Phaser.Math.Between(40, 110),
      this.groundY,
      true,
      true
    );
    obstacle.setOrigin(0.5, 1).setVelocityX(-this.scrollSpeed);
    obstacle.body.setAllowGravity(false).setImmovable(true);
    obstacle.body.setSize(isRock ? 44 : 58, isRock ? 27 : 25);
    obstacle.body.setOffset(isRock ? 5 : 7, isRock ? 8 : 11);
  }

  handleObstacleCollision() {
    if (this.state !== STATE.RUNNING) return;
    this.state = STATE.OVER;
    this.obstacles.getChildren().forEach((obstacle) => obstacle.setVelocityX(0));
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

    this.spawnCountdown -= delta;
    if (this.spawnCountdown <= 0) {
      this.spawnObstacle();
      this.spawnCountdown = Math.max(
        1050,
        Phaser.Math.Between(1350, 2050) * (BASE_SPEED / this.scrollSpeed)
      );
    }
    this.obstacles.getChildren().forEach((obstacle) => {
      if (!obstacle?.active) return;
      obstacle.setVelocityX(-this.scrollSpeed);
      if (obstacle.x < -100) obstacle.disableBody(true, true);
    });

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
