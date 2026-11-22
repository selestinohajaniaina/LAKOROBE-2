import Phaser from "phaser";
import {
  SquareBoard,
  SOFT_DROP_SPEED,
  DROP_ROWS,
  fallSpeedForLevel,
  imagePuzzleConfigs,
} from "../systems/square-blocks/boardLogic.js";
import { computeLayout } from "../systems/square-blocks/layout.js";

const SCENE_KEY = "SquareBlocksScene";
const HOME_SCENE = "Startup";
const FONT = "SuperPixel, Arial, sans-serif";

const COLORS = {
  border: 0xf2bd55,
  panel: 0x091d12,
  dropZone: 0x143524,
  gridBg: 0x0d2418,
};

const HINT = "USE ← AND →";
const BUTTON = { normal: 0x3f7d32, hover: 0x4d9650, down: 0x2d6530 };

const DAS_DELAY = 170; // délai avant répétition quand on garde ← ou →
const REPEAT_DELAY = 60; // intervalle de répétition
const BLOCK_SCORE = 10;
const SOFT_DROP_SCORE = 1; // par case entière parcourue avec ↓
const HARD_DROP_SCORE = 2; // par case en chute immédiate
const WRONG_FLASH_MS = 450;
const DIGIT_COLOR = 0xfff0b5;
const BLOCK_GAP = 1; // espace (px) de chaque côté d'un bloc : très serré
const MAX_LIVES = 4;

// Chiffres 0-9 en pixels (3 x 5), dessinés avec le Graphics : pas de texte.
const DIGITS = {
  0: ["111", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "111"],
  2: ["111", "001", "111", "100", "111"],
  3: ["111", "001", "111", "001", "111"],
  4: ["101", "101", "111", "001", "001"],
  5: ["111", "100", "111", "001", "111"],
  6: ["111", "100", "111", "101", "111"],
  7: ["111", "001", "001", "001", "001"],
  8: ["111", "101", "111", "101", "111"],
  9: ["111", "101", "111", "001", "111"],
};

// Mélange une couleur 0xRRGGBB vers une cible (blanc ou noir).
const mix = (c, target, t) => {
  const r = (c >> 16) & 255;
  const g = (c >> 8) & 255;
  const b = c & 255;
  const tr = (target >> 16) & 255;
  const tg = (target >> 8) & 255;
  const tb = target & 255;
  return (
    (Math.round(r + (tr - r) * t) << 16) |
    (Math.round(g + (tg - g) * t) << 8) |
    Math.round(b + (tb - b) * t)
  );
};

export default class SquareBlocksScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEY);
  }

  preload() {
    // Chaque niveau image se déclare dans boardLogic : aucune image n'est
    // codée en dur dans la scène.
    for (const config of imagePuzzleConfigs()) {
      if (!this.textures.exists(config.image)) {
        this.load.image(config.image, config.imagePath);
      }
    }
  }

  // Données optionnelles : { level, score, imageKey }
  init(data) {
    this.startLevel = data?.level ?? 1;
    this.score = data?.score ?? 0;
    this.targetKey = data?.imageKey ?? null;
    this.lives = MAX_LIVES;
  }

  create() {
    this.cameras.main.setBackgroundColor(0x0e2a1a);

    // Le fond de l'accueil reste en mémoire : on le réutilise s'il existe.
    this.background = this.textures.exists("startup-background")
      ? this.add.image(0, 0, "startup-background").setDepth(0)
      : null;

    this.gfx = this.add.graphics().setDepth(1);
    this.targetImage = null;
    this.puzzlePieces = new Map();

    this.titleText = this.add.text(0, 0, "", this.textStyle());
    this.titleText.setOrigin(0, 0.5).setDepth(2);
    this.scoreText = this.add.text(0, 0, "", this.textStyle());
    this.scoreText.setOrigin(1, 0.5).setDepth(2);
    this.createHearts();
    this.nextLabel = this.add.text(0, 0, "NEXT", this.textStyle());
    this.nextLabel.setOrigin(0.5, 0).setDepth(2);
    this.imageLabel = this.add.text(
      0,
      0,
      "IMAGE TO BUILD",
      this.textStyle({ align: "center" })
    );
    this.imageLabel.setOrigin(0.5, 0).setDepth(2);

    // Rappel permanent des touches et message de fin directement dans l'UI.
    this.hintText = this.add
      .text(
        0,
        0,
        HINT,
        this.textStyle({
          fontSize: "12px",
          strokeThickness: 3,
          color: "#e8dca0",
        })
      )
      .setOrigin(0.5)
      .setAlpha(0.85)
      .setDepth(3);
    this.gameOverText = this.add
      .text(
        0,
        0,
        "",
        this.textStyle({
          fontSize: "14px",
          align: "center",
          color: "#ff9aa8",
        })
      )
      .setOrigin(0.5, 0)
      .setDepth(3)
      .setVisible(false);
    this.primaryButton = this.createButton();
    this.homeButton = this.createButton();
    this.homeButton.set("EXIT TO HOME", () => this.goHome());

    this.setupInput();

    this.scale.on("resize", this.onResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
      this.scale.off("resize", this.onResize, this)
    );

    this.beginLevel(this.startLevel);
    if (this.targetKey && !this.board.config?.image)
      this.setTargetImage(this.targetKey);
  }

  textStyle(extra = {}) {
    return {
      fontFamily: FONT,
      fontSize: "20px",
      color: "#fff0b5",
      stroke: "#35160e",
      strokeThickness: 4,
      ...extra,
    };
  }

  createButton() {
    const background = this.add
      .rectangle(0, 0, 1, 1, BUTTON.normal)
      .setStrokeStyle(3, COLORS.border)
      .setDepth(4)
      .setInteractive({ useHandCursor: true });
    const label = this.add
      .text(0, 0, "", this.textStyle({ align: "center" }))
      .setOrigin(0.5)
      .setDepth(5);
    const button = {
      background,
      label,
      action: null,
      set(text, action) {
        label.setText(text);
        button.action = action;
      },
    };
    background.on("pointerover", () => background.setFillStyle(BUTTON.hover));
    background.on("pointerout", () => background.setFillStyle(BUTTON.normal));
    background.on("pointerdown", () => background.setFillStyle(BUTTON.down));
    background.on("pointerup", () => {
      background.setFillStyle(BUTTON.hover);
      button.action?.();
    });
    return button;
  }

  // Les boutons n'existent qu'à la fin d'un niveau : NEXT LEVEL après une
  // réussite, RETRY après un game over. EXIT TO HOME accompagne les deux.

  refreshControls() {
    const ready = this.state === "ready";
    const ended = this.state === "levelComplete" || this.state === "gameOver";

    if (ready) {
      this.primaryButton.set("PLAY", () => this.startPlaying());
      this.homeButton.set("EXIT TO HOME", () => this.goHome());
    } else if (this.state === "levelComplete") {
      this.primaryButton.set("NEXT LEVEL", () => this.nextLevel());
    } else if (this.state === "gameOver") {
      this.primaryButton.set("RETRY", () => this.retryLevel());
    }

    const showButtons = ready || ended;

    [this.primaryButton, this.homeButton].forEach(({ background, label }) => {
      background.setVisible(showButtons).setFillStyle(BUTTON.normal);
      label.setVisible(showButtons);

      if (showButtons) {
        background.disableInteractive().setInteractive({ useHandCursor: true });
      } else {
        background.disableInteractive();
      }
    });

    // L'instruction reste affichée dans tous les états de la scène.
    this.hintText.setVisible(true);
    this.gameOverText
      .setText(`GAME OVER\nFINAL SCORE ${this.score}`)
      .setVisible(this.state === "gameOver");
    this.dirty = true;
  }

  // ---------------------------------------------------------------- Entrées

  setupInput() {
    const kb = this.input.keyboard;
    kb.addCapture("UP,DOWN,LEFT,RIGHT,SPACE");
    this.keys = kb.addKeys({
      left: "LEFT",
      right: "RIGHT",
      down: "DOWN",
      a: "A",
      d: "D",
      s: "S",
    });
    this.hDir = 0;
    this.hTimer = 0;
    this.hRepeating = false;

    kb.on("keydown-UP", (e) => this.onDropKey(e));
    kb.on("keydown-W", (e) => this.onDropKey(e));
    kb.on("keydown-SPACE", (e) => this.onSpaceKey(e));
    kb.on("keydown-R", (e) => this.onRestartKey(e));
    kb.on("keydown-ESC", () => this.goHome());
  }

  onDropKey(e) {
    if (e?.repeat) return;
    this.hardDrop();
  }

  onSpaceKey(e) {
    if (e?.repeat) return;
    this.hardDrop();
  }

  onRestartKey(e) {
    if (e?.repeat) return;
    if (this.state === "gameOver") {
      this.retryLevel();
      return;
    }
    if (this.state !== "playing") return;
    this.score = this.levelStartScore;
    this.beginLevel(this.level);
  }

  goHome() {
    this.scene.start(HOME_SCENE);
  }

  // ------------------------------------------------------------------ Jeu

  beginLevel(level) {
    this.level = level;
    this.levelStartScore = this.score;
    this.board = new SquareBoard(level);
    this.updateHearts(false);
    this.configureImagePuzzle();
    // Exception : le niveau 1 attend le clic sur PLAY.
    this.state = level === 1 ? "ready" : "playing";
    this.softAcc = 0;
    this.wrong = null;
    this.hDir = 0;
    this.hTimer = 0;
    this.hRepeating = false;
    this.applyLayout();
    this.updateHud();
    this.refreshControls();
    this.dirty = true;
  }

  configureImagePuzzle() {
    this.destroyPuzzlePieces();
    this.puzzleAspect = 1;
    const config = this.board.config;
    if (
      config?.type !== "image-puzzle" ||
      !this.textures.exists(config.image)
    ) {
      this.setTargetImage(null);
      return;
    }
    const source = this.textures.get(config.image).getSourceImage();
    this.puzzleAspect = source.width / source.height;
    this.setTargetImage(config.image);
    for (let row = 0; row < this.board.rows; row++) {
      for (let column = 0; column < this.board.columns; column++) {
        const id = row * this.board.columns + column;
        const key = `${config.image}-piece-${this.board.rows}x${this.board.columns}-${id}`;
        if (!this.textures.exists(key)) {
          const sx = Math.floor((column * source.width) / this.board.columns);
          const sy = Math.floor((row * source.height) / this.board.rows);
          const ex = Math.floor(
            ((column + 1) * source.width) / this.board.columns
          );
          const ey = Math.floor(((row + 1) * source.height) / this.board.rows);
          const texture = this.textures.createCanvas(key, ex - sx, ey - sy);
          texture.context.drawImage(
            source,
            sx,
            sy,
            ex - sx,
            ey - sy,
            0,
            0,
            ex - sx,
            ey - sy
          );
          texture.refresh();
        }
        this.puzzlePieces.set(
          id,
          this.add.image(0, 0, key).setOrigin(0).setDepth(3)
        );
      }
    }
  }

  destroyPuzzlePieces() {
    if (!this.puzzlePieces) return;
    for (const piece of this.puzzlePieces.values()) piece.destroy();
    this.puzzlePieces.clear();
  }

  startPlaying() {
    if (this.state !== "ready") return;
    this.state = "playing";
    this.refreshControls();
    this.dirty = true;
  }

  nextLevel() {
    this.lives = MAX_LIVES;
    this.updateHearts(false);
    this.beginLevel(this.level + 1);
  }

  hardDrop() {
    if (this.state !== "playing" || !this.board.current) return;
    const distance = this.board.hardDrop();
    this.score += Math.floor(distance) * HARD_DROP_SCORE;
    this.onLocked();
  }

  onLocked() {
    const res = this.board.lastLock;
    if (res && !res.ok) {
      // Mauvais endroit : le bloc est refusé et le même chiffre revient.
      this.wrong = {
        row: res.row,
        col: res.col,
        until: this.time.now + WRONG_FLASH_MS,
      };
      this.cameras.main.shake(150, 0.006);
      // `onLocked` n'est appelé qu'après un verrouillage effectif : c'est le
      // point unique qui retire une vie pour un placement refusé.
      this.loseLife();
      if (this.lives === 0) this.gameOver();
      else this.board.spawn();
    } else {
      this.score += BLOCK_SCORE;
      if (this.board.isFull()) this.completeLevel();
      else this.board.spawn();
    }
    this.softAcc = 0;
    this.updateHud();
    this.dirty = true;
  }

  completeLevel() {
    this.state = "levelComplete";
    this.score += this.level * 100;
    this.cameras.main.flash(250, 255, 255, 255);
    this.refreshControls();
  }

  gameOver() {
    this.state = "gameOver";
    this.refreshControls();
  }

  retryLevel() {
    this.score = this.levelStartScore;
    this.lives = MAX_LIVES;
    this.updateHearts(false);
    this.beginLevel(this.level);
  }

  createHearts() {
    // Même dessin et mêmes textures que Travel. Les textures sont partagées
    // si cette scène a déjà été visitée dans la session Phaser.
    const makeHeart = (key, fill, stroke) => {
      if (this.textures.exists(key)) return;
      const g = this.make.graphics({ add: false });
      g.fillStyle(stroke).fillCircle(10, 11, 9).fillCircle(24, 11, 9);
      g.fillTriangle(1, 14, 33, 14, 17, 32);
      g.fillStyle(fill).fillCircle(10, 11, 7).fillCircle(24, 11, 7);
      g.fillTriangle(3, 14, 31, 14, 17, 29);
      if (key === "heart-full") g.fillStyle(0xff9aa8).fillCircle(8, 8, 3);
      g.generateTexture(key, 34, 34);
      g.destroy();
    };
    makeHeart("heart-full", 0xe63946, 0x4a0f18);
    makeHeart("heart-empty", 0x3b2a2e, 0x1c1215);
    this.hearts = Array.from({ length: MAX_LIVES }, () =>
      this.add.image(0, 0, "heart-full").setOrigin(1, 0).setDepth(20)
    );
    this.updateHearts(false);
  }

  layoutHearts(width) {
    this.hearts?.forEach((heart, index) =>
      heart.setPosition(width - 20 - (MAX_LIVES - 1 - index) * 40, 16)
    );
  }

  updateHearts(animateLoss = false) {
    this.hearts?.forEach((heart, index) => {
      const full = index < this.lives;
      heart.setTexture(full ? "heart-full" : "heart-empty");
      if (animateLoss && index === this.lives) {
        this.tweens.add({
          targets: heart,
          scale: { from: 1.5, to: 1 },
          duration: 250,
          ease: "Back.Out",
        });
      }
    });
  }

  loseLife() {
    if (this.state !== "playing" || this.lives <= 0) return false;
    this.lives = Math.max(0, this.lives - 1);
    this.updateHearts(true);
    return true;
  }

  update(time, delta) {
    if (this.state === "playing" && this.board.current) {
      this.handleHorizontal(delta);
      this.handleFall(delta);
    }
    if (this.wrong && this.time.now >= this.wrong.until) {
      this.wrong = null;
      this.dirty = true;
    }
    if (this.dirty) {
      this.dirty = false;
      this.render();
    }
  }

  handleHorizontal(delta) {
    const left = this.keys.left.isDown || this.keys.a.isDown;
    const right = this.keys.right.isDown || this.keys.d.isDown;
    const dir = left === right ? 0 : left ? -1 : 1;

    if (dir === 0) {
      this.hDir = 0;
      return;
    }
    if (dir !== this.hDir) {
      this.hDir = dir;
      this.hTimer = 0;
      this.hRepeating = false;
      if (this.board.moveX(dir)) this.dirty = true;
      return;
    }
    this.hTimer += delta;
    const threshold = this.hRepeating ? REPEAT_DELAY : DAS_DELAY;
    if (this.hTimer >= threshold) {
      this.hTimer -= threshold;
      this.hRepeating = true;
      if (this.board.moveX(dir)) this.dirty = true;
    }
  }

  // Chute continue : le bloc descend d'une petite distance à chaque image
  // (vitesse en cases/s x temps écoulé), il ne saute pas de case en case.
  handleFall(delta) {
    const soft = this.keys.down.isDown || this.keys.s.isDown;
    const normal = fallSpeedForLevel(this.level);
    const speed = soft ? Math.max(SOFT_DROP_SPEED, normal) : normal;
    const dt = Math.min(delta, 50) / 1000; // évite un grand saut après une pause d'onglet
    const { status, distance } = this.board.fall(speed * dt);

    if (soft && distance > 0) {
      this.softAcc += distance;
      while (this.softAcc >= 1) {
        this.softAcc -= 1;
        this.score += SOFT_DROP_SCORE;
      }
      this.updateHud();
    }
    if (status === "locked") this.onLocked();
    else if (distance > 0) this.dirty = true;
  }

  // ----------------------------------------------------------- Image cible

  // Zone réservée à l'image (en pixels) : { x, y, width, height }.
  getImageArea() {
    const a = this.layout.imageInner;
    return { x: a.x, y: a.y, width: a.w, height: a.h };
  }

  // Remplace le cadre vide par une texture déjà chargée (clé Phaser).
  setTargetImage(key) {
    this.targetKey = key;
    if (this.targetImage) {
      this.targetImage.destroy();
      this.targetImage = null;
    }
    if (key && this.textures.exists(key)) {
      this.targetImage = this.add.image(0, 0, key).setDepth(2);
    }
    this.applyLayout();
  }

  // ------------------------------------------------------------ Affichage

  onResize() {
    if (this.board) this.applyLayout();
  }

  applyLayout() {
    const W = this.scale.width;
    const H = this.scale.height;
    const L = (this.layout = computeLayout(
      W,
      H,
      this.board.rows,
      this.board.columns,
      this.puzzleAspect ?? 1
    ));

    if (this.background) {
      const s = Math.max(W / this.background.width, H / this.background.height);
      this.background.setPosition(W / 2, H / 2).setScale(s);
    }

    this.titleText.setFontSize(L.fonts.title).setPosition(L.title.x, L.title.y);
    // Les cœurs reprennent l'angle supérieur droit de Travel ; le score est
    // légèrement abaissé dans l'en-tête pour ne pas les recouvrir.
    this.layoutHearts(W);
    this.scoreText
      .setFontSize(L.fonts.label)
      .setPosition(L.score.x, L.score.y + L.fonts.label * 0.8);

    this.nextLabel
      .setFontSize(L.fonts.label)
      .setWordWrapWidth(Math.max(10, L.next.w - 8))
      .setPosition(L.next.x + L.next.w / 2, L.next.y + L.pad);
    this.imageLabel
      .setFontSize(L.fonts.label)
      .setWordWrapWidth(Math.max(10, L.image.w - 8))
      .setPosition(L.image.x + L.image.w / 2, L.image.y + L.pad);

    this.layoutFooter(L);

    if (this.targetImage) {
      const a = L.imageInner;
      const s = Math.min(
        a.w / this.targetImage.width,
        a.h / this.targetImage.height
      );
      this.targetImage
        .setPosition(a.x + a.w / 2, a.y + a.h / 2)
        .setScale(Math.max(0.01, s));
    }
    this.dirty = true;
  }

  updateHud() {
    this.titleText.setText(
      `LEVEL ${this.level}  ${this.board.columns}X${this.board.rows}`
    );
    this.scoreText.setText(`SCORE ${this.score}`);
  }

  // Place les deux boutons côte à côte dans la zone prévue par computeLayout.
  layoutFooter(L) {
    const { buttons, gap } = L;
    const w = (buttons.w - gap) / 2;
    const y = buttons.y + buttons.h / 2;
    [this.primaryButton, this.homeButton].forEach((button, index) => {
      const x = buttons.x + w / 2 + index * (w + gap);
      button.background.setSize(w, buttons.h).setPosition(x, y);
      // la zone cliquable suit la nouvelle taille du bouton
      if (button.background.visible) {
        button.background
          .disableInteractive()
          .setInteractive({ useHandCursor: true });
      }
      button.label
        .setFontSize(L.fonts.label)
        .setWordWrapWidth(w - 16)
        .setPosition(x, y);
    });
    // Le rappel est volontairement haut, juste sous l'en-tête.
    const hintY = Math.min(
      L.zone.y - L.pad * 1.5,
      L.title.y + L.fonts.title * 1.45
    ) + 200;
    this.hintText
      .setFontSize(Math.max(9, Math.round(L.fonts.label * 0.8)))
      .setPosition(L.W / 2, hintY);
    this.gameOverText
      .setFontSize(Math.max(11, Math.round(L.fonts.label * 0.95)))
      .setWordWrapWidth(L.W * 0.8)
      .setPosition(L.W / 2, hintY + L.fonts.label * 1.2);
  }

  render() {
    const L = this.layout;
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x07160d, 0.45);
    g.fillRect(0, 0, L.W, L.H);
    this.drawBoard(g, L, this.board);
    this.drawNextPanel(g, L, this.board);
    this.drawImagePanel(g, L);
  }

  drawBoard(g, L, board) {
    const { zone, drop, grid, cellW, cellH } = L;
    const pad = BLOCK_GAP;
    const o = 6; // débord du cadre

    g.fillStyle(COLORS.panel, 0.75);
    g.fillRoundedRect(
      zone.x - o,
      zone.y - o,
      zone.w + 2 * o,
      zone.h + 2 * o,
      14
    );
    g.fillStyle(COLORS.dropZone, 0.55);
    g.fillRect(drop.x, drop.y, drop.w, drop.h);
    g.fillStyle(COLORS.gridBg, 0.9);
    g.fillRect(grid.x, grid.y, grid.w, grid.h);

    // Cases vides
    g.fillStyle(0xffffff, 0.06);
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.columns; c++) {
        g.fillRect(
          grid.x + c * cellW + pad,
          grid.y + r * cellH + pad,
          cellW - 2 * pad,
          cellH - 2 * pad
        );
      }
    }

    // Ombre : où le bloc va atterrir
    const cur = board.current;
    if (cur) {
      const landing = board.landingRow();
      if (landing - cur.y > 0.01) {
        g.lineStyle(3, COLORS.border, 0.6);
        g.strokeRect(
          grid.x + cur.col * cellW + pad,
          grid.y + landing * cellH + pad,
          cellW - 2 * pad,
          cellH - 2 * pad
        );
      }
    }

    // Blocs posés
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.columns; c++) {
        const b = board.grid[r][c];
        if (b && !this.isImagePiece(b, board)) {
          this.drawBlock(
            g,
            grid.x + c * cellW + pad,
            grid.y + r * cellH + pad,
            cellW - 2 * pad,
            cellH - 2 * pad,
            b.color,
            this.label(b.tile)
          );
        }
      }
    }

    // Erreur : la case où le bloc a été refusé clignote en rouge
    if (this.wrong) {
      g.fillStyle(0xd1495b, 0.55);
      g.fillRect(
        grid.x + this.wrong.col * cellW + pad,
        grid.y + this.wrong.row * cellH + pad,
        cellW - 2 * pad,
        cellH - 2 * pad
      );
    }

    // Bloc qui tombe (y < 0 = dans l'espace libre du haut)
    if (cur && !this.isImagePiece(cur, board)) {
      this.drawBlock(
        g,
        grid.x + cur.col * cellW + pad,
        zone.y + (cur.y + DROP_ROWS) * cellH + pad,
        cellW - 2 * pad,
        cellH - 2 * pad,
        cur.color,
        this.label(cur.tile)
      );
    }

    // Cadre et séparation espace libre / grille
    g.lineStyle(4, COLORS.border, 1);
    g.strokeRoundedRect(
      zone.x - o,
      zone.y - o,
      zone.w + 2 * o,
      zone.h + 2 * o,
      14
    );
    g.lineStyle(2, COLORS.border, 0.6);
    g.lineBetween(grid.x, grid.y, grid.x + grid.w, grid.y);
    this.renderImagePieces(L, board);
  }

  isImagePiece(block, board = this.board) {
    // Une case libre est `null`. Avec `block?.tile !== null`, `null` donnait
    // `undefined !== null` (true) et était donc pris à tort pour un morceau.
    // Un morceau image doit porter un indice entier dans les limites du puzzle.
    return Boolean(
      board?.config?.type === "image-puzzle" &&
        block &&
        Number.isInteger(block.tile) &&
        block.tile >= 0 &&
        block.tile < board.rows * board.columns
    );
  }

  renderImagePieces(L, board) {
    if (!this.puzzlePieces?.size) return;
    for (const piece of this.puzzlePieces.values()) piece.setVisible(false);
    const place = (block, column, y) => {
      if (!this.isImagePiece(block, board)) return;
      if (!Number.isInteger(column) || !Number.isFinite(y)) return;
      const piece = this.puzzlePieces.get(block.tile);
      if (!piece) return;
      piece
        .setVisible(true)
        .setPosition(
          L.grid.x + column * L.cellW,
          L.zone.y + (y + DROP_ROWS) * L.cellH
        )
        .setDisplaySize(L.cellW, L.cellH);
    };
    for (let row = 0; row < board.rows; row++) {
      for (let column = 0; column < board.columns; column++) {
        const block = board.grid[row][column];
        if (this.isImagePiece(block, board)) place(block, column, row);
      }
    }
    if (this.isImagePiece(board.current, board)) {
      place(board.current, board.current.col, board.current.y);
    }
  }

  drawBlock(g, x, y, w, h, color, tile = null) {
    const s = Math.min(w, h);
    const r = Math.max(2, s * 0.05); // coins presque droits : blocs bien jointifs
    const i = Math.max(1, s * 0.03);
    g.fillStyle(mix(color, 0x000000, 0.35), 1);
    g.fillRoundedRect(x, y, w, h, r);
    g.fillStyle(color, 1);
    g.fillRoundedRect(x + i, y + i, w - 2 * i, h - 2 * i, r * 0.7);
    g.fillStyle(mix(color, 0xffffff, 0.35), 0.9);
    g.fillRoundedRect(
      x + i * 2,
      y + i * 2,
      w - i * 4,
      Math.max(2, h * 0.07),
      r * 0.4
    );
    if (tile !== null && tile !== undefined) this.drawDigit(g, x, y, s, tile);
  }

  // Le numéro n'est affiché que pour les niveaux "chiffres" (niveau 1).
  label(tile) {
    return this.board.config?.digits ? tile : null;
  }

  // Dessine un chiffre (police pixel 3x5) centré dans un bloc de côté s.
  drawDigit(g, x, y, s, digit) {
    const glyph = DIGITS[digit % 10];
    if (!glyph) return;
    const px = Math.max(1, Math.floor((s * 0.5) / 5));
    const w = 3 * px;
    const h = 5 * px;
    const ox = Math.round(x + (s - w) / 2);
    const oy = Math.round(y + (s - h) / 2);
    g.fillStyle(DIGIT_COLOR, 1);
    for (let r = 0; r < 5; r++) {
      let c = 0;
      while (c < 3) {
        if (glyph[r][c] === "1") {
          let end = c;
          while (end + 1 < 3 && glyph[r][end + 1] === "1") end++;
          g.fillRect(ox + c * px, oy + r * px, (end - c + 1) * px, px);
          c = end + 1;
        } else c++;
      }
    }
  }

  drawPanel(g, rect, alpha) {
    g.fillStyle(COLORS.panel, alpha);
    g.fillRoundedRect(rect.x, rect.y, rect.w, rect.h, 12);
  }

  drawNextPanel(g, L, board) {
    const p = L.next;
    this.drawPanel(g, p, 0.6);
    g.lineStyle(3, COLORS.border, 1);
    g.strokeRoundedRect(p.x, p.y, p.w, p.h, 12);

    const freeH = p.h - L.nextLabelH - L.pad;
    const size = Math.min(L.cell, freeH * 0.9, p.w * 0.6);
    // Le dernier bloc de la grille est en train de tomber : plus de "suivant".
    const remaining = board.rows * board.columns - board.placed;
    if (size < 8 || !board.next || remaining <= (board.current ? 1 : 0)) return;
    // Les sprites image sont réservés au plateau afin qu'un morceau n'apparaisse
    // jamais deux fois à la fois. Le panneau garde son cadre et son libellé.
    if (board.config?.type === "image-puzzle") return;
    this.drawBlock(
      g,
      p.x + (p.w - size) / 2,
      p.y + L.nextLabelH + (freeH - size) / 2,
      size,
      size,
      board.next.color,
      this.label(board.next.tile)
    );
  }

  drawImagePanel(g, L) {
    const p = L.image;
    this.drawPanel(g, p, 0.35);
    const target = this.board.target;
    if (target && !this.targetImage) {
      this.drawTargetPreview(g, L, target);
      g.lineStyle(3, COLORS.border, 1);
      g.strokeRoundedRect(p.x, p.y, p.w, p.h, 12);
      return;
    }
    if (this.targetImage) {
      g.lineStyle(3, COLORS.border, 1);
      g.strokeRoundedRect(p.x, p.y, p.w, p.h, 12);
    } else {
      g.lineStyle(3, COLORS.border, 0.9);
      this.dashedRect(g, p.x, p.y, p.w, p.h, 10, 8);
    }
  }

  // L'image à copier du niveau (ici des chiffres), dessinée avec les mêmes blocs.
  drawTargetPreview(g, L, target) {
    const a = L.imageInner;
    const n = target.length;
    const side = Math.min(a.w, a.h);
    if (side < 8) return;
    const cs = side / n;
    const ox = a.x + (a.w - side) / 2;
    const oy = a.y + (a.h - side) / 2;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        this.drawBlock(
          g,
          ox + c * cs + BLOCK_GAP,
          oy + r * cs + BLOCK_GAP,
          cs - 2 * BLOCK_GAP,
          cs - 2 * BLOCK_GAP,
          this.board.colorOf(target[r][c]),
          this.label(target[r][c])
        );
      }
    }
  }

  dashedRect(g, x, y, w, h, dash, gap) {
    this.dashedLine(g, x, y, x + w, y, dash, gap);
    this.dashedLine(g, x + w, y, x + w, y + h, dash, gap);
    this.dashedLine(g, x + w, y + h, x, y + h, dash, gap);
    this.dashedLine(g, x, y + h, x, y, dash, gap);
  }

  dashedLine(g, x1, y1, x2, y2, dash, gap) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len === 0) return;
    const dx = (x2 - x1) / len;
    const dy = (y2 - y1) / len;
    for (let d = 0; d < len; d += dash + gap) {
      const e = Math.min(d + dash, len);
      g.lineBetween(x1 + dx * d, y1 + dy * d, x1 + dx * e, y1 + dy * e);
    }
  }
}
