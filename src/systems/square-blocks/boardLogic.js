// Logique pure du jeu de blocs carrés. Aucune dépendance à Phaser :
// la scène ne fait que l'afficher.

// Taille de la grille (nombre de blocs par côté) pour chaque niveau.
// Niveau 1 = 2x2 (4 gros blocs), niveau 3 = 3x3 (9 blocs), etc.
// Le niveau 2 n'est pas décidé : on garde 2x2 pour l'instant.
export const GRID_BY_LEVEL = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

// Configuration des niveaux "image". Un niveau absent d'ici est libre :
// blocs de couleurs aléatoires, sans image à copier.
//  - color    : couleur (sombre) de tous les blocs du niveau
//  - sequence : chiffres des blocs, dans l'ordre d'arrivée (boucle à la fin)
//  - target   : l'image à copier, ligne par ligne (la ligne 0 est en haut).
//               Un bloc posé au mauvais endroit est refusé et revient.
// Niveau 1 : 0 et 1 arrivent d'abord et se posent en bas, puis 2 et 3 au-dessus.
export const LEVEL_CONFIG = {
  1: {
    color: 0x3a4150,
    sequence: [0, 1, 2, 3],
    target: [
      [2, 3],
      [0, 1],
    ],
  },
};

export const levelConfig = (level) => LEVEL_CONFIG[level] ?? null;

export const BLOCK_COLORS = [
  0x3f7d32, // vert
  0xf2bd55, // jaune
  0xc4622d, // orange
  0x4a90a4, // bleu
  0x8e5bb5, // violet
  0xd1495b, // rouge
];

// Hauteur (en cases) de l'espace libre au-dessus de la grille : le bloc
// apparaît tout en haut de cet espace (y = -DROP_ROWS) et tombe jusqu'à la grille.
export const DROP_ROWS = 2;
export const SPAWN_ROW = -DROP_ROWS;

// Vitesses de chute en cases par seconde (la chute est continue, pas par à-coups).
export const BASE_FALL_SPEED = 0.7; // niveau 1
export const FALL_SPEED_PER_LEVEL = 0.08;
export const MAX_FALL_SPEED = 2.2;
export const SOFT_DROP_SPEED = 10; // touche ↓ maintenue

export const gridSizeForLevel = (level) =>
  GRID_BY_LEVEL[Math.min(Math.max(level, 1), GRID_BY_LEVEL.length) - 1];

export const fallSpeedForLevel = (level) =>
  Math.min(
    MAX_FALL_SPEED,
    BASE_FALL_SPEED + (Math.max(level, 1) - 1) * FALL_SPEED_PER_LEVEL
  );

export class SquareBoard {
  constructor(level = 1, rng = Math.random) {
    this.level = level;
    this.size = gridSizeForLevel(level);
    this.rng = rng;
    this.nextId = 1;
    this.config = levelConfig(level);
    this.seqIndex = 0;
    this.retry = null; // bloc refusé, à refaire tomber
    this.lastLock = null;
    // grid[row][col] : null ou un bloc posé
    this.grid = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null)
    );
    this.placed = 0;
    this.current = null;
    this.next = this.createBlock();
    this.spawn();
  }

  // L'image à copier de ce niveau (tableau de lignes), ou null.
  get target() {
    const t = this.config?.target;
    if (!t || t.length !== this.size || t.some((r) => r.length !== this.size)) {
      return null;
    }
    return t;
  }

  // `tile` = chiffre (ou plus tard morceau d'image) porté par le bloc.
  createBlock() {
    const seq = this.config?.sequence;
    if (seq && seq.length > 0) {
      return {
        id: this.nextId++,
        color: this.config.color,
        tile: seq[this.seqIndex++ % seq.length],
      };
    }
    return {
      id: this.nextId++,
      color: BLOCK_COLORS[Math.floor(this.rng() * BLOCK_COLORS.length)],
      tile: null,
    };
  }

  isFull() {
    return this.placed >= this.size * this.size;
  }

  // Le bloc est en (col, y) où y est un nombre décimal (position continue,
  // en cases ; y < 0 = espace libre au-dessus de la grille). Il recouvre les
  // lignes floor(y) et ceil(y) : toutes doivent être libres.
  canOccupy(col, y) {
    if (col < 0 || col >= this.size) return false;
    const top = Math.floor(y + 1e-9);
    const bottom = Math.ceil(y - 1e-9);
    for (let r = top; r <= bottom; r++) {
      if (r >= this.size) return false;
      if (r >= 0 && this.grid[r][col] !== null) return false;
    }
    return true;
  }

  // Une colonne dont la case du haut est prise est pleine : on n'y entre pas.
  columnOpen(col) {
    return col >= 0 && col < this.size && this.grid[0][col] === null;
  }

  // Fait apparaître le bloc "suivant" en haut de l'espace libre, au centre ou
  // dans la colonne ouverte la plus proche du centre. Retourne false si la
  // grille est pleine.
  spawn() {
    if (this.isFull()) {
      this.current = null;
      return false;
    }
    const centre = (this.size - 1) / 2;
    const cols = [];
    for (let c = 0; c < this.size; c++) {
      if (this.columnOpen(c)) cols.push(c);
    }
    if (cols.length === 0) {
      this.current = null;
      return false;
    }
    cols.sort((a, b) => Math.abs(a - centre) - Math.abs(b - centre) || a - b);
    let block;
    if (this.retry) {
      // bloc refusé : le même chiffre revient, la suite ne change pas
      block = { id: this.nextId++, ...this.retry };
      this.retry = null;
    } else {
      block = this.next;
      this.next = this.createBlock();
    }
    this.current = { ...block, col: cols[0], y: SPAWN_ROW };
    return true;
  }

  moveX(dx) {
    const b = this.current;
    if (!b) return false;
    const col = b.col + dx;
    if (!this.columnOpen(col) || !this.canOccupy(col, b.y)) return false;
    b.col = col;
    return true;
  }

  // Ligne (entière) où le bloc se pose dans sa colonne : juste au-dessus du
  // premier bloc posé, ou sur le fond.
  landingRow(col = this.current ? this.current.col : 0) {
    for (let r = 0; r < this.size; r++) {
      if (this.grid[r][col] !== null) return r - 1;
    }
    return this.size - 1;
  }

  // Fait tomber le bloc de `distance` cases (décimal, ex. 0.012) : le mouvement
  // est continu. Retourne { status: "moved" | "locked" | "none", distance }.
  fall(distance) {
    const b = this.current;
    if (!b) return { status: "none", distance: 0 };
    const target = this.landingRow();
    const newY = Math.min(b.y + Math.max(distance, 0), target);
    const moved = newY - b.y;
    b.y = newY;
    if (b.y >= target - 1e-9) {
      b.y = target;
      this.lock();
      return { status: "locked", distance: moved };
    }
    return { status: "moved", distance: moved };
  }

  // Chute immédiate. Retourne le nombre de cases parcourues.
  hardDrop() {
    const b = this.current;
    if (!b) return 0;
    const target = this.landingRow();
    const distance = target - b.y;
    b.y = target;
    this.lock();
    return distance;
  }

  // Pose le bloc. Si une image est à copier et que le chiffre ne correspond
  // pas à la case, le bloc est refusé (il n'est pas posé et revient au spawn).
  // Le résultat est dans this.lastLock : { ok, row, col, tile }.
  lock() {
    const b = this.current;
    if (!b) return;
    const row = Math.round(b.y);
    if (row < 0) return;
    const expected = this.target ? this.target[row][b.col] : null;
    const ok = expected === null || b.tile === expected;
    this.current = null;
    if (ok) {
      this.grid[row][b.col] = b;
      this.placed++;
    } else {
      this.retry = { color: b.color, tile: b.tile };
    }
    this.lastLock = { ok, row, col: b.col, tile: b.tile };
  }
}
