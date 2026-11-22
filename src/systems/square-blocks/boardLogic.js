// Logique pure du jeu de blocs carrés. Aucune dépendance à Phaser :
// la scène ne fait que l'afficher.

// Taille de la grille (nombre de blocs par côté) pour chaque niveau.
// Niveau 1 = 2x2 (4 gros blocs), niveau 3 = 3x3 (9 blocs), etc.
// Le niveau 2 n'est pas décidé : on garde 2x2 pour l'instant.
export const GRID_BY_LEVEL = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6];

// Configuration des niveaux "image". Un niveau absent d'ici est libre :
// blocs de couleurs aléatoires, sans image à copier.
//  - target   : l'image à copier, ligne par ligne (la ligne 0 est en haut),
//               en numéros de blocs. Un bloc posé au mauvais endroit est
//               refusé et revient.
//  - color    : couleur unique de tous les blocs (niveau 1, sombre)
//  - palette  : une couleur par numéro de bloc (niveau 2)
//  - digits   : true = le numéro est dessiné sur le bloc
//  - sequence : ordre d'arrivée fixe des blocs (boucle à la fin)
//  - order    : "bottom-up-shuffled" = ordre aléatoire, mais les blocs du bas
//               d'abord (la gravité oblige à remplir de bas en haut, sinon
//               un bloc pourrait ne jamais pouvoir être posé)
export const LEVEL_CONFIG = {
  // Niveau 1 : chiffres 0 à 3, blocs sombres, arrivée dans l'ordre 0, 1, 2, 3.
  1: {
    name: "Number Pattern",
    color: 0x3a4150,
    digits: true,
    sequence: [0, 1, 2, 3],
    target: [
      [2, 3],
      [0, 1],
    ],
  },
  // Niveau 2 : 4 couleurs (rouge, bleu, jaune, vert), ordre mélangé.
  2: {
    name: "Color Pattern",
    palette: [0xd1495b, 0x4a90a4, 0xf2bd55, 0x3f7d32],
    digits: false,
    order: "bottom-up-shuffled",
    target: [
      [2, 3],
      [0, 1],
    ],
  },
  // Les puzzles image n'utilisent ni palette ni `target` : l'identifiant du
  // morceau encode sa position d'origine (ligne * colonnes + colonne).
  3: {
    id: 3,
    name: "American Flag",
    type: "image-puzzle",
    image: "american-flag",
    // `new URL` laisse Vite inclure l'image source dans le build, sans la
    // déplacer ni la dupliquer dans public/.
    imagePath: new URL(
      "../../assets/block-images/american-flag.png",
      import.meta.url
    ).href,
    rows: 2,
    columns: 2,
    order: "shuffled",
  },
};

export const levelConfig = (level) => LEVEL_CONFIG[level] ?? null;

export const imagePuzzleConfigs = () =>
  Object.values(LEVEL_CONFIG).filter((config) => config.type === "image-puzzle");

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

export const gridDimensionsForLevel = (level) => {
  const config = levelConfig(level);
  const size = gridSizeForLevel(level);
  return {
    rows: config?.rows ?? size,
    columns: config?.columns ?? size,
  };
};

export const fallSpeedForLevel = (level) =>
  Math.min(
    MAX_FALL_SPEED,
    BASE_FALL_SPEED + (Math.max(level, 1) - 1) * FALL_SPEED_PER_LEVEL
  );

export class SquareBoard {
  constructor(level = 1, rng = Math.random) {
    this.level = level;
    this.rng = rng;
    this.nextId = 1;
    this.config = levelConfig(level);
    const dimensions = gridDimensionsForLevel(level);
    this.rows = dimensions.rows;
    this.columns = dimensions.columns;
    // Compatibilité avec le rendu des niveaux historiques carrés.
    this.size = this.columns;
    this.sequence = this.buildSequence();
    this.seqIndex = 0;
    this.retry = null; // bloc refusé, à refaire tomber
    this.lastLock = null;
    // grid[row][col] : null ou un bloc posé
    this.grid = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(null)
    );
    this.placed = 0;
    this.current = null;
    this.next = this.createBlock();
    this.spawn();
  }

  // L'image à copier de ce niveau (tableau de lignes), ou null.
  get target() {
    const t = this.config?.target;
    if (!t || t.length !== this.rows || t.some((r) => r.length !== this.columns)) {
      return null;
    }
    return t;
  }

  // Ordre d'arrivée des blocs (numéros), ou null si le niveau est libre.
  buildSequence() {
    const cfg = this.config;
    if (!cfg) return null;
    if (cfg.sequence) return [...cfg.sequence];
    const t = this.target;
    if (cfg.order === "bottom-up-shuffled" && t) {
      const seq = [];
      for (let r = t.length - 1; r >= 0; r--) {
        const row = [...t[r]];
        for (let i = row.length - 1; i > 0; i--) {
          const j = Math.floor(this.rng() * (i + 1));
          [row[i], row[j]] = [row[j], row[i]];
        }
        seq.push(...row);
      }
      return seq;
    }
    if (cfg.type === "image-puzzle" && cfg.order === "shuffled") {
      // Les rangées restent bas → haut : avec la gravité, un morceau du haut
      // ne peut être accepté avant celui situé sous lui. Chaque rangée est
      // néanmoins réellement mélangée.
      const seq = [];
      for (let row = this.rows - 1; row >= 0; row--) {
        const tiles = Array.from(
          { length: this.columns },
          (_, column) => row * this.columns + column
        );
        for (let i = tiles.length - 1; i > 0; i--) {
          const j = Math.floor(this.rng() * (i + 1));
          [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
        seq.push(...tiles);
      }
      return seq;
    }
    return null;
  }

  // Couleur du bloc portant ce numéro.
  colorOf(tile) {
    const cfg = this.config;
    if (cfg?.palette && tile !== null && tile !== undefined) {
      return cfg.palette[tile % cfg.palette.length];
    }
    return cfg?.color ?? BLOCK_COLORS[0];
  }

  // `tile` = numéro du bloc (ou plus tard morceau d'image).
  createBlock() {
    const seq = this.sequence;
    if (seq && seq.length > 0) {
      const tile = seq[this.seqIndex++ % seq.length];
      return { id: this.nextId++, color: this.colorOf(tile), tile };
    }
    return {
      id: this.nextId++,
      color: BLOCK_COLORS[Math.floor(this.rng() * BLOCK_COLORS.length)],
      tile: null,
    };
  }

  isFull() {
    return this.placed >= this.rows * this.columns;
  }

  // Le bloc est en (col, y) où y est un nombre décimal (position continue,
  // en cases ; y < 0 = espace libre au-dessus de la grille). Il recouvre les
  // lignes floor(y) et ceil(y) : toutes doivent être libres.
  canOccupy(col, y) {
    if (col < 0 || col >= this.columns) return false;
    const top = Math.floor(y + 1e-9);
    const bottom = Math.ceil(y - 1e-9);
    for (let r = top; r <= bottom; r++) {
      if (r >= this.rows) return false;
      if (r >= 0 && this.grid[r][col] !== null) return false;
    }
    return true;
  }

  // Une colonne dont la case du haut est prise est pleine : on n'y entre pas.
  columnOpen(col) {
    return col >= 0 && col < this.columns && this.grid[0][col] === null;
  }

  // Fait apparaître le bloc "suivant" en haut de l'espace libre, au centre ou
  // dans la colonne ouverte la plus proche du centre. Retourne false si la
  // grille est pleine.
  spawn() {
    if (this.isFull()) {
      this.current = null;
      return false;
    }
    const centre = (this.columns - 1) / 2;
    const cols = [];
    for (let c = 0; c < this.columns; c++) {
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
    for (let r = 0; r < this.rows; r++) {
      if (this.grid[r][col] !== null) return r - 1;
    }
    return this.rows - 1;
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
    const expected = this.config?.type === "image-puzzle"
      ? row * this.columns + b.col
      : this.target
        ? this.target[row][b.col]
        : null;
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
