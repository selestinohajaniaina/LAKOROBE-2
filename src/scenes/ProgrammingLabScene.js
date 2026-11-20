import Phaser from "phaser";
import personIdleUrl from "../assets/sprite/rocket/top.png";
import fontUrl from "../assets/fonts/SuperPixel.ttf";
import clickUrl from "../assets/song/popup.mp3";
import { LAB_LEVELS, DIRECTIONS } from "../systems/programming-lab/levels.js";
import CommandManager from "../systems/programming-lab/CommandManager.js";
import ProgramExecutor from "../systems/programming-lab/ProgramExecutor.js";
import { configureButtonInput } from "../ui/configureButtonInput.js";

const FONT = "SuperPixel, monospace";
const BUTTON_COLOURS = { normal: 0xe4b84f, hover: 0xffd872, down: 0xbe8731 };

export default class ProgrammingLabScene extends Phaser.Scene {
  constructor() {
    super("ProgrammingLabScene");
  }

  preload() {
    this.load.spritesheet("lab-character", personIdleUrl, {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.audio("lab-click", clickUrl);
    if (!document.fonts.check("12px SuperPixel"))
      this.load.font("SuperPixel", fontUrl, "truetype");
  }

  create() {
    this.levelIndex = 0;
    this.running = false;
    this.boardGraphics = this.add.graphics();
    this.uiGraphics = this.add.graphics();
    this.overlayGraphics = this.add.graphics().setDepth(30);
    this.robot = this.add.sprite(0, 0, "lab-character", 0).setDepth(8);
    this.robot.setTint(0x8ce8d0);
    this.flag = this.add.graphics().setDepth(7);
    this.texts = {};
    this.codeRows = [];
    this.buttons = [];
    this.clickSound = this.sound.add("lab-click");
    this.createText();
    this.createButtons();
    this.loadLevel(0);
    this.scale.on("resize", this.layout, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off("resize", this.layout, this);
      this.tweens.killTweensOf(this.robot);
      this.clickSound?.destroy();
    });
    this.layout({ width: this.scale.width, height: this.scale.height });
  }

  createText() {
    const pixel = {
      fontFamily: FONT,
      color: "#fff6bf",
      stroke: "#161124",
      strokeThickness: 4,
    };
    this.texts.title = this.add
      .text(0, 0, "PROGRAMMING LAB", { ...pixel, fontSize: "23px" })
      .setDepth(20);
    this.texts.level = this.add
      .text(0, 0, "", { ...pixel, fontSize: "13px", color: "#71f4e0" })
      .setDepth(20);
    this.texts.hint = this.add
      .text(0, 0, "", {
        ...pixel,
        fontSize: "15px",
        color: "#d2c7ef",
        wordWrap: { width: 260 },
      })
      .setDepth(20);
    this.texts.lines = this.add
      .text(0, 0, "", { ...pixel, fontSize: "12px", color: "#ffe276" })
      .setDepth(20);
    this.texts.status = this.add
      .text(0, 0, "BUILD A PROGRAM", {
        ...pixel,
        fontSize: "12px",
        color: "#7cf1d9",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(25);
  }

  createButtons() {
    this.addButton("FORWARD", () => this.addCommand("forward"), "command");
    this.addButton("TURN LEFT", () => this.addCommand("left"), "command");
    this.addButton("TURN RIGHT", () => this.addCommand("right"), "command");
    this.addButton(
      "UNDO",
      () => {
        if (!this.running) {
          this.commands.undo();
          this.refreshCode();
        }
      },
      "small"
    );
    this.addButton(
      "CLEAR",
      () => {
        if (!this.running) {
          this.commands.clear();
          this.refreshCode();
        }
      },
      "small"
    );
    this.addButton(
      "RESTART",
      () => {
        if (!this.running) this.resetRobot();
      },
      "small"
    );
    this.addButton("RUN", () => this.runProgram(), "run");
    this.addButton("EXIT", () => this.scene.start("Startup"), "exit");
    this.nextButton = this.addButton(
      "NEXT LEVEL",
      () => this.nextLevel(),
      "next"
    );
    this.nextButton.setVisible(false);
  }

  addButton(label, callback, kind) {
    const button = this.add.container(0, 0).setDepth(22);
    button.kind = kind;
    button.labelText = label;
    button.callback = callback;
    button.bg = this.add.graphics();
    button.label = this.add
      .text(0, 0, label, {
        fontFamily: FONT,
        fontSize: "11px",
        color: "#21182c",
        align: "center",
      })
      .setOrigin(0.5);
    button.add([button.bg, button.label]);
    configureButtonInput(button, 100, 34);
    button.on("pointerover", () => this.paintButton(button, "hover"));
    button.on("pointerout", () => this.paintButton(button, "normal"));
    button.on("pointerdown", () => this.paintButton(button, "down"));
    button.on("pointerup", (pointer) => {
      this.paintButton(button, "hover");
      if (button.getBounds().contains(pointer.x, pointer.y)) {
        this.clickSound.play();
        callback();
      }
    });
    this.paintButton(button, "normal");
    this.buttons.push(button);
    return button;
  }

  paintButton(button, state) {
    const colour =
      state === "hover"
        ? BUTTON_COLOURS.hover
        : state === "down"
        ? BUTTON_COLOURS.down
        : BUTTON_COLOURS.normal;
    button.bg
      .clear()
      .fillStyle(0x19122c, 0.9)
      .fillRect(
        -button.width / 2 + 3,
        -button.height / 2 + 4,
        button.width,
        button.height
      )
      .fillStyle(
        button.kind === "exit"
          ? 0xa75b69
          : button.kind === "run" || button.kind === "next"
          ? 0x74d9c2
          : colour
      )
      .fillRect(
        -button.width / 2,
        -button.height / 2,
        button.width,
        button.height
      )
      .lineStyle(2, 0xfff0a5)
      .strokeRect(
        -button.width / 2,
        -button.height / 2,
        button.width,
        button.height
      );
    button.setScale(state === "down" ? 0.96 : state === "hover" ? 1.025 : 1);
  }

  loadLevel(index) {
    this.levelIndex = index;
    this.level = LAB_LEVELS[index];
    this.commands = new CommandManager(this.level.lines);
    this.executor = new ProgramExecutor(this.level);
    this.running = false;
    this.nextButton?.setVisible(false);
    this.texts.level.setText(`LEVEL ${index + 1}: ${this.level.name}`);
    this.texts.hint.setText(this.level.hint);
    this.setStatus("BUILD A PROGRAM", "#7cf1d9");
    this.layout({ width: this.scale.width, height: this.scale.height });
  }

  layout({ width, height }) {
    const portrait = width < 760 || height > width * 1.1;
    const margin = Math.max(12, Math.min(28, width * 0.025));
    const headerH = portrait ? 66 : 58;
    const controlsH = portrait ? 118 : 128;
    const leftW = portrait ? width - margin * 2 : Math.min(width * 0.52, 620);
    const panelW = portrait ? width - margin * 2 : width - leftW - margin * 3;
    const boardAreaH = portrait
      ? Math.max(180, height * 0.4 - headerH)
      : height - headerH - controlsH - margin;
    const maxCols = Math.max(...this.level.map.map((row) => row.length));
    const tile = Math.floor(
      Math.min(
        (leftW - 28) / maxCols,
        (boardAreaH - 28) / this.level.map.length
      )
    );
    this.board = {
      x: margin + (leftW - maxCols * tile) / 2,
      y: headerH + (boardAreaH - this.level.map.length * tile) / 2,
      tile,
    };
    this.panel = {
      x: portrait ? margin : margin * 2 + leftW,
      y: portrait ? headerH + boardAreaH + 8 : headerH,
      w: panelW,
      h: portrait
        ? height - (headerH + boardAreaH + controlsH + 18)
        : height - headerH - controlsH,
    };
    this.texts.title
      .setPosition(margin, 12)
      .setFontSize(`${Math.max(15, Math.min(24, width / 38))}px`);
    this.texts.level.setPosition(margin, portrait ? 39 : 39);
    this.texts.hint
      .setPosition(this.panel.x + 14, this.panel.y + 42)
      .setWordWrapWidth(this.panel.w - 28);
    this.texts.lines.setPosition(this.panel.x + 14, this.panel.y + 14);
    this.texts.status.setPosition(width / 2, height - controlsH - 12);
    this.drawBoard();
    this.refreshCode();
    this.layoutButtons(width, height, portrait, controlsH);
  }

  drawBoard() {
    const { x, y, tile } = this.board;
    const map = this.level.map;
    this.boardGraphics
      .clear()
      .fillStyle(0x130e2a, 0.94)
      .fillRect(
        x - 10,
        y - 10,
        Math.max(...map.map((r) => r.length)) * tile + 20,
        map.length * tile + 20
      )
      .lineStyle(3, 0x67dac6)
      .strokeRect(
        x - 10,
        y - 10,
        Math.max(...map.map((r) => r.length)) * tile + 20,
        map.length * tile + 20
      );
    map.forEach((row, rowIndex) =>
      [...row].forEach((cell, col) => {
        const tx = x + col * tile;
        const ty = y + rowIndex * tile;
        this.boardGraphics
          .fillStyle(cell === "#" ? 0x3c2a5e : 0x21445a)
          .fillRect(tx + 1, ty + 1, tile - 2, tile - 2)
          .lineStyle(1, cell === "#" ? 0x70528e : 0x39768b)
          .strokeRect(tx + 1, ty + 1, tile - 2, tile - 2);
        if (cell === "#")
          this.boardGraphics
            .fillStyle(0x594071)
            .fillRect(tx + 5, ty + 5, tile - 10, Math.max(3, tile * 0.18));
      })
    );
    const start = this.cellCenter(this.level.start[0], this.level.start[1]);
    this.boardGraphics
      .lineStyle(2, 0x78e9d2)
      .strokeCircle(start.x, start.y, tile * 0.37);
    const target = this.cellCenter(this.level.target[0], this.level.target[1]);
    this.flag
      .clear()
      .fillStyle(0xf7cf50)
      .fillRect(
        target.x - tile * 0.22,
        target.y - tile * 0.32,
        Math.max(3, tile * 0.07),
        tile * 0.58
      )
      .fillStyle(0xffe57c)
      .fillTriangle(
        target.x - tile * 0.18,
        target.y - tile * 0.31,
        target.x + tile * 0.28,
        target.y - tile * 0.17,
        target.x - tile * 0.18,
        target.y - tile * 0.03
      );
    this.placeRobot(false);
  }

  cellCenter(col, row) {
    return {
      x: this.board.x + (col + 0.5) * this.board.tile,
      y: this.board.y + (row + 0.5) * this.board.tile,
    };
  }
  placeRobot(animated) {
    const center = this.cellCenter(
      this.executor.position.x,
      this.executor.position.y
    );
    this.robot.setScale(Math.max(0.035, (this.board.tile / 512) * 1.05));
    if (!animated)
      this.robot
        .setPosition(center.x, center.y)
        .setAngle(DIRECTIONS[this.executor.direction].angle);
    return center;
  }

  refreshCode(activeLine = -1) {
    this.codeRows.forEach((row) => row.destroy());
    this.codeRows = [];
    const { x, y, w, h } = this.panel;
    this.uiGraphics
      .clear()
      .fillStyle(0x17112b, 0.97)
      .fillRect(x, y, w, h)
      .lineStyle(3, 0x70e5bf)
      .strokeRect(x, y, w, h)
      .lineStyle(1, 0x7a5aa5)
      .lineBetween(x + 8, y + 45, x + w - 8, y + 34);
    this.texts.lines
    .setFontSize("20px")
    .setText(
      `LINES: ${this.commands.commands.length}/${this.level.lines}`
    );
    const available = Math.max(
      28,
      Math.min(37, (h - 68) / Math.max(1, this.level.lines))
    );
    this.commands.commands.forEach((command, index) => {
      const rowY = y + 82 + index * available;
      const selected = index === activeLine;
      const row = this.add.container(x + 10, rowY).setDepth(21);
      const g = this.add
        .graphics()
        .fillStyle(selected ? 0x3c6d67 : 0x251b41)
        .fillRect(0, 0, w - 20, available - 4);
      const label = this.add.text(
        7,
        5,
        `${index + 1}.  ${
          command.repeat > 1 ? `repeat(${command.repeat}) ` : ""
        }${this.commandLabel(command.type)}`,
        {
          fontFamily: FONT,
          fontSize: "15px",
          color: selected ? "#fff487" : "#ded4f5",
        }
      );
      row.add([g, label]);
      if (!this.running) {
        const minus = this.createRowControl("−", w - 63, 4, () => {
          this.commands.changeRepeat(index, -1);
          this.refreshCode();
        });
        const plus = this.createRowControl("+", w - 32, 4, () => {
          this.commands.changeRepeat(index, 1);
          this.refreshCode();
        });
        row.add([minus, plus]);
      }
      this.codeRows.push(row);
    });
  }

  createRowControl(label, x, y, callback) {
    const t = this.add
      .text(x, y, label, {
        fontFamily: FONT,
        fontSize: "13px",
        color: "#ffe16b",
        backgroundColor: "#44315f",
        padding: { x: 4, y: 2 },
      });
    configureButtonInput(t, t.width, t.height);
    t.on("pointerup", callback);
    return t;
  }

  commandLabel(type) {
    return type === "forward"
      ? "forward()"
      : type === "left"
      ? "turnLeft()"
      : "turnRight()";
  }

  addCommand(type) {
    if (this.running) return;
    if (!this.commands.add(type))
      return this.setStatus("LINE LIMIT REACHED", "#ffbb7c");
    this.setStatus("COMMAND ADDED", "#7cf1d9");
    this.refreshCode();
  }

  layoutButtons(width, height, portrait, controlsH) {
    const commandButtons = this.buttons.filter((b) => b.kind === "command");
    const utilityButtons = this.buttons.filter((b) => b.kind === "small");
    const baseY = height - controlsH + 20;
    const side = Math.max(9, width * 0.018);
    const commandW = Math.min(
      portrait ? (width - side * 4) / 3 : 136,
      (width - side * 4) / 3
    );
    commandButtons.forEach((b, i) => {
      configureButtonInput(b, commandW, 34).setPosition(
        side + commandW / 2 + i * (commandW + side),
        baseY
      );
      b.label.setFontSize("10px");
      this.paintButton(b, "normal");
    });
    const utilityW = Math.min(86, (width - side * 5) / 4);
    utilityButtons.forEach((b, i) => {
      configureButtonInput(b, utilityW, 29).setPosition(
        side + utilityW / 2 + i * (utilityW + side),
        baseY + 43
      );
      b.label.setFontSize("9px");
      this.paintButton(b, "normal");
    });
    const run = this.buttons.find((b) => b.kind === "run");
    const exit = this.buttons.find((b) => b.kind === "exit");
    configureButtonInput(run, Math.min(150, width * 0.27), 38)
      .setPosition(width - side - run.width / 2, baseY + 43);
    this.paintButton(run, "normal");
    configureButtonInput(exit, 62, 26).setPosition(width - side - 31, 22);
    exit.label.setFontSize("8px");
    this.paintButton(exit, "normal");
    configureButtonInput(this.nextButton, 150, 38).setPosition(width / 2, height / 2);
    this.paintButton(this.nextButton, "normal");
  }

  resetRobot() {
    this.tweens.killTweensOf(this.robot);
    this.executor.reset(this.level);
    this.placeRobot(false);
    this.nextButton.setVisible(false);
    this.setStatus("LEVEL RESET", "#7cf1d9");
  }

  setStatus(message, colour = "#7cf1d9") {
    this.texts.status.setText(message).setColor(colour);
  }

  async runProgram() {
    if (this.running) return;
    const actions = this.commands.actions();
    if (!actions.length)
      return this.setStatus("ADD A COMMAND FIRST", "#ffbb7c");
    this.running = true;
    this.resetRobot();
    this.running = true;
    this.setStatus("RUNNING...", "#ffe276");
    for (const action of actions) {
      this.refreshCode(action.line);
      const result = this.executor.step(action.type);
      if (result.kind === "crash") {
        await this.flashRobot(0xf05b68);
        this.fail("OOPS! WALL AHEAD");
        return;
      }
      if (result.kind === "turn") await this.rotateRobot();
      else await this.moveRobot();
      if (this.executor.isComplete()) {
        this.win();
        return;
      }
    }
    this.fail("NOT AT THE FLAG YET");
  }

  waitTween(config) {
    return new Promise((resolve) =>
      this.tweens.add({ ...config, onComplete: resolve })
    );
  }
  rotateRobot() {
    return this.waitTween({
      targets: this.robot,
      angle: DIRECTIONS[this.executor.direction].angle,
      duration: 260,
      ease: "Sine.inOut",
    });
  }
  moveRobot() {
    const point = this.placeRobot(true);
    return this.waitTween({
      targets: this.robot,
      x: point.x,
      y: point.y,
      duration: 310,
      ease: "Sine.inOut",
    });
  }
  async flashRobot(tint) {
    this.robot.setTint(tint);
    await this.waitTween({
      targets: this.robot,
      alpha: 0.25,
      yoyo: true,
      repeat: 2,
      duration: 100,
    });
    this.robot.setAlpha(1).setTint(0x8ce8d0);
  }
  fail(message) {
    this.running = false;
    this.refreshCode();
    this.setStatus(message, "#ff919b");
  }
  win() {
    this.running = false;
    this.refreshCode();
    this.setStatus("SUCCESS! FLAG REACHED", "#aaff91");
    this.nextButton.setVisible(true);
    this.tweens.add({
      targets: [this.robot, this.flag],
      scale: "+=.12",
      yoyo: true,
      repeat: 2,
      duration: 140,
    });
  }
  nextLevel() {
    if (this.levelIndex < LAB_LEVELS.length - 1)
      this.loadLevel(this.levelIndex + 1);
    else {
      this.setStatus("ALL LABS COMPLETE!", "#aaff91");
      this.nextButton.setVisible(false);
    }
  }
}
