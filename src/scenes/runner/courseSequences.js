const BAMBOO = [
  {
    name: "chemin-du-village",
    length: 900,
    elements: [
      { role: "decor", texture: "course-house", x: 260 },
      { role: "decor", texture: "course-fence", x: 390 },
      { role: "hazard", texture: "course-rock", x: 520 },
      { role: "decor", texture: "course-bush", x: 650 },
      { role: "decor", texture: "course-fence", x: 790 },
    ],
  },
  {
    name: "toits-doubles",
    length: 980,
    elements: [
      { role: "decor", texture: "course-house", x: 220 },
      { role: "decor", texture: "course-house", x: 545 },
      { role: "hazard", texture: "course-bush", x: 820 },
    ],
  },
  {
    name: "arbres-et-branches",
    length: 1100,
    elements: [
      { role: "decor", texture: "course-tree", x: 180 },
      { role: "platform", texture: "course-branch", x: 185, height: 90 },
      { role: "decor", texture: "course-tree", x: 440 },
      { role: "platform", texture: "course-branch", x: 345, height: 90 },
      { role: "decor", texture: "course-tree", x: 700 },
      { role: "platform", texture: "course-branch", x: 705, height: 90 },
      { role: "hazard", texture: "course-rock", x: 960 },
    ],
  },
  {
    name: "ferme",
    length: 1180,
    elements: [
      { role: "decor", texture: "course-house", x: 170, tint: 0xe8c794 },
      { role: "decor", texture: "course-fence", x: 300 },
      { role: "hazard", texture: "course-zebu", x: 430 },
      { role: "decor", texture: "course-trough", x: 620 },
      { role: "hazard", texture: "course-chicken", x: 960, dynamic: false },
      { role: "decor", texture: "course-fence", x: 900 },
      { role: "hazard", texture: "course-hay", x: 1520 },
    ],
  },
  {
    name: "branche-vers-toit",
    length: 1120,
    elements: [
      { role: "decor", texture: "course-tree", x: 170 },
      { role: "platform", texture: "course-branch", x: 175, height: 92 },
      { role: "decor", texture: "course-tree", x: 430 },
      { role: "platform", texture: "course-branch", x: 335, height: 92 },
      { role: "decor", texture: "course-house", x: 700 },
      { role: "decor", texture: "course-fence", x: 835 },
      { role: "hazard", texture: "course-bush", x: 980 },
    ],
  },
  {
    name: "branches-hautes",
    length: 1180,
    elements: [
      { role: "decor", texture: "course-tree", x: 165 },
      { role: "platform", texture: "course-branch", x: 170, height: 96 },
      { role: "platform", texture: "course-branch", x: 305, height: 96 },
      { role: "decor", texture: "course-tree", x: 400 },
      { role: "platform", texture: "course-branch", x: 605, height: 216 },
      { role: "decor", texture: "course-tree", x: 635 },
      { role: "platform", texture: "course-branch", x: 740, height: 216 },
      { role: "decor", texture: "course-tree", x: 870 },
      { role: "platform", texture: "course-branch", x: 875, height: 322 },
      { role: "platform", texture: "course-branch", x: 975, height: 322 },
      { role: "hazard", texture: "course-rock", x: 1060 },
    ],
  },
];

// Même géométrie que "branches-hautes" (hauteurs 96 / 216 / 322), textures différentes.
const highRoute = ({ decor, ledge, hazard }) => ({
  name: "route-haute",
  length: 1180,
  elements: [
    { role: "decor", texture: decor, x: 165 },
    { role: "platform", texture: ledge, x: 170, height: 96 },
    { role: "platform", texture: ledge, x: 305, height: 96 },
    { role: "decor", texture: decor, x: 400 },
    { role: "platform", texture: ledge, x: 605, height: 216 },
    { role: "decor", texture: decor, x: 635 },
    { role: "platform", texture: ledge, x: 740, height: 216 },
    { role: "decor", texture: decor, x: 870 },
    { role: "platform", texture: ledge, x: 875, height: 322 },
    { role: "platform", texture: ledge, x: 975, height: 322 },
    { role: "hazard", texture: hazard, x: 1060 },
  ],
});

const DESERT = [
  { name: "oasis", length: 950, elements: [
    { role: "decor", texture: "desert-tent", x: 200 },
    { role: "decor", texture: "desert-palm", x: 520 },
    { role: "hazard", texture: "desert-cactus", x: 860 },
    { role: "decor", texture: "desert-bush", x: 960 },
    { role: "hazard", texture: "desert-rock", x: 980 },
  ] },
  { name: "caravane", length: 1100, elements: [
    { role: "decor", texture: "desert-palm", x: 160 },
    { role: "decor", texture: "desert-bush", x: 300 },
    { role: "hazard", texture: "desert-camel", x: 480 },
    { role: "decor", texture: "desert-tent", x: 720 },
    { role: "hazard", texture: "desert-cactus", x: 1080 },
  ] },
  { name: "palmes-et-dalles", length: 1100, elements: [
    { role: "decor", texture: "desert-palm", x: 180 },
    { role: "platform", texture: "desert-ledge", x: 185, height: 90 },
    { role: "platform", texture: "desert-ledge", x: 345, height: 90 },
    { role: "decor", texture: "desert-palm", x: 440 },
    { role: "hazard", texture: "desert-rock", x: 620 },
    { role: "decor", texture: "desert-palm", x: 700 },
    { role: "platform", texture: "desert-ledge", x: 705, height: 90 },
    { role: "hazard", texture: "desert-cactus", x: 1080 },
  ] },
  highRoute({ decor: "desert-palm", ledge: "desert-ledge", hazard: "desert-camel" }),
];

const SNOW = [
  { name: "foret-enneigee", length: 950, elements: [
    { role: "decor", texture: "snow-pine", x: 200 },
    { role: "decor", texture: "snow-snowman", x: 400 },
    { role: "hazard", texture: "snow-rock", x: 560 },
    { role: "decor", texture: "snow-pine", x: 760 },
    { role: "hazard", texture: "snow-spikes", x: 1080 },
  ] },
  { name: "village-inuit", length: 1100, elements: [
    { role: "decor", texture: "snow-igloo", x: 220 },
    { role: "hazard", texture: "snow-husky", x: 420 },
    { role: "decor", texture: "snow-pine", x: 650 },
    { role: "hazard", texture: "snow-spikes", x: 1020 },
    { role: "decor", texture: "snow-snowman", x: 980 },
  ] },
  { name: "pins-et-glace", length: 1100, elements: [
    { role: "decor", texture: "snow-pine", x: 180 },
    { role: "platform", texture: "snow-ledge", x: 185, height: 90 },
    { role: "platform", texture: "snow-ledge", x: 345, height: 90 },
    { role: "decor", texture: "snow-pine", x: 440 },
    { role: "hazard", texture: "snow-rock", x: 640 },
    { role: "decor", texture: "snow-pine", x: 700 },
    { role: "platform", texture: "snow-ledge", x: 705, height: 90 },
    { role: "hazard", texture: "snow-spikes", x: 1060 },
  ] },
  highRoute({ decor: "snow-pine", ledge: "snow-ledge", hazard: "snow-husky" }),
];

const NEW_YORK = [
  { name: "rue-commercante", length: 950, elements: [
    { role: "decor", texture: "ny-building", x: 200 },
    { role: "decor", texture: "city-lamp", x: 400 },
    { role: "hazard", texture: "ny-hydrant", x: 540 },
    { role: "decor", texture: "ny-tower", x: 700 },
    { role: "hazard", texture: "ny-trash", x: 880 },
  ] },
  { name: "embouteillage", length: 1150, elements: [
    { role: "decor", texture: "city-lamp", x: 150 },
    { role: "hazard", texture: "ny-taxi", x: 340 },
    { role: "decor", texture: "ny-building", x: 560 },
    { role: "hazard", texture: "ny-cart", x: 1800 },
    { role: "decor", texture: "city-lamp", x: 980 },
  ] },
  { name: "auvents", length: 1100, elements: [
    { role: "decor", texture: "ny-building", x: 180 },
    { role: "platform", texture: "ny-awning", x: 185, height: 90 },
    { role: "platform", texture: "ny-awning", x: 345, height: 90 },
    { role: "decor", texture: "ny-tower", x: 440 },
    { role: "hazard", texture: "ny-hydrant", x: 600 },
    { role: "decor", texture: "ny-building", x: 700 },
    { role: "platform", texture: "ny-awning", x: 705, height: 90 },
    { role: "hazard", texture: "ny-taxi", x: 1560 },
  ] },
  highRoute({ decor: "ny-building", ledge: "ny-fireescape", hazard: "ny-taxi" }),
];

const WASHINGTON = [
  { name: "national-mall", length: 1000, elements: [
    { role: "decor", texture: "city-lamp", x: 180 },
    { role: "decor", texture: "dc-flag", x: 330 },
    { role: "hazard", texture: "dc-cone", x: 480 },
    { role: "decor", texture: "dc-obelisk", x: 700 },
    { role: "hazard", texture: "dc-bench", x: 900 },
  ] },
  { name: "pennsylvania-avenue", length: 1150, elements: [
    { role: "decor", texture: "dc-columns", x: 220 },
    { role: "hazard", texture: "dc-police", x: 400 },
    { role: "decor", texture: "city-lamp", x: 620 },
    { role: "hazard", texture: "dc-barrier", x: 860 },
    { role: "decor", texture: "dc-flag", x: 1000 },
  ] },
  { name: "capitole", length: 1100, elements: [
    { role: "decor", texture: "dc-dome", x: 180 },
    { role: "platform", texture: "dc-slab", x: 185, height: 90 },
    { role: "platform", texture: "dc-slab", x: 345, height: 90 },
    { role: "decor", texture: "dc-flag", x: 440 },
    { role: "hazard", texture: "dc-barrier", x: 620 },
    { role: "decor", texture: "dc-columns", x: 700 },
    { role: "platform", texture: "dc-slab", x: 705, height: 90 },
    { role: "hazard", texture: "dc-police", x: 960 },
  ] },
  highRoute({ decor: "dc-columns", ledge: "dc-slab", hazard: "dc-police" }),
];

export const SEQUENCES_BY_THEME = {
  bamboo: BAMBOO,
  desert: DESERT,
  snow: SNOW,
  newyork: NEW_YORK,
  washington: WASHINGTON,
};

// [largeur, hauteur, offsetX, offsetY] : le bas de la hitbox colle au bas de la texture.
export const HITBOXES = {
  // Bambou (inchangé)
  "course-rock": [44, 27, 5, 8],
  "course-bush": [52, 34, 6, 13],
  "course-zebu": [86, 52, 10, 14],
  "course-chicken": [31, 31, 6, 7],
  "course-hay": [62, 42, 5, 8],
  // Désert
  "desert-cactus": [34, 62, 5, 8],
  "desert-camel": [64, 46, 14, 30],
  "desert-rock": [44, 26, 6, 8],
  // Neige
  "snow-husky": [68, 40, 6, 12],
  "snow-spikes": [40, 40, 6, 6],
  "snow-rock": [46, 26, 7, 8],
  // New York
  "ny-taxi": [80, 36, 14, 14],
  "ny-hydrant": [20, 36, 5, 10],
  "ny-cart": [70, 40, 8, 26],
  "ny-trash": [28, 38, 3, 4],
  // Washington
  "dc-police": [84, 36, 14, 14],
  "dc-cone": [22, 36, 4, 4],
  "dc-bench": [68, 34, 4, 6],
  "dc-barrier": [76, 34, 4, 10],
};
