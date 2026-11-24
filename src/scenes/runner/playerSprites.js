import originalIdleUrl from "../../assets/sprite/person-1/Idle.png";
import originalJumpUrl from "../../assets/sprite/person-1/Jump.png";
import originalRunUrl from "../../assets/sprite/person-1/Run.png";
import fabienJumpUrl from "../../assets/sprite/fabien/Jump.png";
import fabienRunUrl from "../../assets/sprite/fabien/Run.png";
import rochelJumpUrl from "../../assets/sprite/rochel/Jump.png";
import rochelRunUrl from "../../assets/sprite/rochel/Run.png";
import rochelIdleUrl from "../../assets/sprite/rochel/Idle.png";
import selestinoRunUrl from "../../assets/sprite/selestino/Run.png";
import selestinoJumpUrl from "../../assets/sprite/selestino/Jump.png";
import mandresyRunUrl from "../../assets/sprite/mandresy/Run.png";
import mandresyJumpUrl from "../../assets/sprite/mandresy/Jump.png";
import ianelRunUrl from "../../assets/sprite/ianel/Run.png";
import ianelJumpUrl from "../../assets/sprite/ianel/Jump.png";
import martialRunUrl from "../../assets/sprite/martial/Run.png";
import martialJumpUrl from "../../assets/sprite/martial/Jump.png";

// Point unique de configuration des personnages de Travel. Pour en ajouter
// un autre, déclarer ses feuilles et ses quatre animations dans ce tableau.
export const PLAYER_SPRITES = [
  {
    id: "person-1",
    name: "ORIGINAL",
    texture: "person-1-idle",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 425, x: 151, y: 70 },
    sheets: {
      idle: { url: originalIdleUrl, width: 512, height: 512 },
      run: { url: originalRunUrl, width: 512, height: 512 },
      jump: { url: originalJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["idle", 0, 1, 2, -1],
      run: ["run", 0, 3, 11, -1],
      jump: ["jump", 0, 5, 12, 0],
      fall: ["jump", 6, 10, 12, 0],
    },
  },
  {
    id: "fabien",
    name: "FABIEN",
    texture: "fabien-run",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 425, x: 151, y: 70 },
    sheets: {
      run: { url: fabienRunUrl, width: 512, height: 512 },
      jump: { url: fabienJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["run", 1, 2, 2, -1],
      run: ["run", 0, 7, 9, -1],
      jump: ["jump", 0, 3, 12, 0],
      fall: ["jump", 3, 3, 1, -1],
    },
  },
  {
    id: "rochel",
    name: "ROCHEL",
    texture: "rochel-run",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 420, x: 146, y: 68 },
    sheets: {
      idle: { url: rochelIdleUrl, width: 512, height: 512 },
      run: { url: rochelRunUrl, width: 512, height: 512 },
      jump: { url: rochelJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["run", 3, 4, 2, -1],
      run: ["run", 0, 7, 11, -1],
      jump: ["jump", 0, 3, 12, 0],
      fall: ["jump", 3, 3, 1, -1],
    },
  },
  {
    id: "selestino",
    name: "SELESTINO",
    texture: "selestino-run",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 420, x: 146, y: 68 },
    sheets: {
      run: { url: selestinoRunUrl, width: 512, height: 512 },
      jump: { url: selestinoJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["run", 2, 3, 2, -1],
      run: ["run", 0, 7, 9, -1],
      jump: ["jump", 0, 3, 12, 0],
      fall: ["jump", 3, 3, 1, -1],
    },
  },
  {
    id: "mandresy",
    name: "MANDRESY",
    texture: "mandresy-run",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 420, x: 146, y: 68 },
    sheets: {
      run: { url: mandresyRunUrl, width: 512, height: 512 },
      jump: { url: mandresyJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["run", 2, 3, 2, -1],
      run: ["run", 0, 7, 9, -1],
      jump: ["jump", 0, 3, 12, 0],
      fall: ["jump", 3, 3, 1, -1],
    },
  },
  {
    id: "ianel",
    name: "IANEL",
    texture: "ianel-run",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 420, x: 146, y: 68 },
    sheets: {
      run: { url: ianelRunUrl, width: 512, height: 512 },
      jump: { url: ianelJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["run", 2, 3, 2, -1],
      run: ["run", 0, 7, 11, -1],
      jump: ["jump", 0, 3, 12, 0],
      fall: ["jump", 3, 3, 1, -1],
    },
  },
  {
    id: "martial",
    name: "MARTIAL",
    texture: "martial-run",
    frame: 512,
    scale: 0.18,
    hitbox: { w: 210, h: 420, x: 146, y: 68 },
    sheets: {
      run: { url: martialRunUrl, width: 512, height: 512 },
      jump: { url: martialJumpUrl, width: 512, height: 512 },
    },
    animations: {
      idle: ["run", 2, 3, 2, -1],
      run: ["run", 0, 7, 11, -1],
      jump: ["jump", 0, 3, 12, 0],
      fall: ["jump", 3, 3, 1, -1],
    },
  }
];

export function loadPlayerSprites(scene) {
  PLAYER_SPRITES.forEach((player) => {
    Object.entries(player.sheets).forEach(([name, sheet]) => {
      const key = `${player.id}-${name}`;
      if (!scene.textures.exists(key)) {
        scene.load.spritesheet(key, sheet.url, {
          frameWidth: sheet.width,
          frameHeight: sheet.height,
        });
      }
    });
  });
}

export function createPlayerSpriteAnimations(scene) {
  PLAYER_SPRITES.forEach((player) => {
    Object.entries(player.animations).forEach(([name, [sheet, start, end, frameRate, repeat]]) => {
      const key = `${player.id}-${name}`;
      if (scene.anims.exists(key)) return;
      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(`${player.id}-${sheet}`, {
          start,
          end,
        }),
        frameRate,
        repeat,
      });
    });
  });
}
