import { DIRECTIONS } from "./levels.js";

// Pure state transition layer. The scene owns animation and timing.
export default class ProgramExecutor {
  constructor(level) { this.reset(level); }
  reset(level) {
    this.level = level;
    this.position = { x: level.start[0], y: level.start[1] };
    this.direction = level.direction;
  }
  step(type) {
    if (type === "left") { this.direction = (this.direction + 3) % 4; return { kind: "turn" }; }
    if (type === "right") { this.direction = (this.direction + 1) % 4; return { kind: "turn" }; }
    const vector = DIRECTIONS[this.direction];
    const next = { x: this.position.x + vector.x, y: this.position.y + vector.y };
    if (!this.isWalkable(next.x, next.y)) return { kind: "crash" };
    this.position = next;
    return { kind: "move", position: next };
  }
  isComplete() { return this.position.x === this.level.target[0] && this.position.y === this.level.target[1]; }
  isWalkable(x, y) { return this.level.map[y]?.[x] === "."; }
}
