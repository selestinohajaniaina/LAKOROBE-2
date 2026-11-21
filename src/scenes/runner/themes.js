import bambooUrl from "../../assets/lakorobe/backgroundBamboo.png";
import desertUrl from "../../assets/runner-themes/desert.jpg";
import snowUrl from "../../assets/runner-themes/neige.jpg";
import nycUrl from "../../assets/runner-themes/the-statue-of-liberty.jpg";
import dcUrl from "../../assets/runner-themes/washington-dc-usa.jpg";
import beachUrl from "../../assets/runner-themes/california-2.jpg";
import sunsetUrl from "../../assets/runner-themes/California.jpg";
import laUrl from "../../assets/runner-themes/los-angeles.jpeg";
import bostonUrl from "../../assets/runner-themes/boston.jpg";
import miamiUrl from "../../assets/runner-themes/miami.jpg";
import texasUrl from "../../assets/runner-themes/texas.jpg";
import chicagoUrl from "../../assets/runner-themes/chicago.jpg";
import vegasUrl from "../../assets/runner-themes/Las-Vegas.jpg";
import sfUrl from "../../assets/runner-themes/san-francisco.jpg";

export const THEME_STEP = 40; // changement de thème tous les 40 points

export const THEMES = [
  {
    id: "bamboo",
    name: "BAMBOO FOREST",
    url: bambooUrl,
    sky: 0xddeeb0,
    ground: { base: 0x9f4728, top: 0xc96535, dark: 0x7d351f, light: 0xe18a4f },
    plants: { back: 0x416f36, front: 0x5e8d42 },
    grass: { blade: 0x355c2b, top: 0x6b913d },
  },
  {
    id: "desert",
    name: "DESERT",
    url: desertUrl,
    sky: 0xbfe3f5,
    ground: { base: 0xd9a252, top: 0xefc377, dark: 0xb9803a, light: 0xf6d99a },
    plants: { back: 0xc98b4a, front: 0xdfa564 },
    grass: { blade: 0x8a9a3a, top: 0xb5b04a },
  },
  {
    id: "snow",
    name: "SNOW",
    url: snowUrl,
    sky: 0xcfe8ff,
    ground: { base: 0xdfeaf7, top: 0xffffff, dark: 0xb7c9e0, light: 0xffffff },
    plants: { back: 0x5f8fa8, front: 0x7fa9be },
    grass: { blade: 0xaecde0, top: 0xffffff },
  },
  {
    id: "newyork",
    name: "NEW YORK",
    url: nycUrl,
    sky: 0xa9cfc4,
    ground: { base: 0x6b6f7a, top: 0x9a9fab, dark: 0x4d5058, light: 0xb9bdc7 },
    plants: { back: 0x5b7a8c, front: 0x7a9aab },
    grass: { blade: 0x4a6f45, top: 0x7aa05a },
  },
  {
    id: "washington",
    name: "WASHINGTON",
    url: dcUrl,
    sky: 0x8cc7ee,
    ground: { base: 0x8d8f99, top: 0xc4c6ce, dark: 0x6c6e78, light: 0xdadce2 },
    plants: { back: 0x3f7d3a, front: 0x5da04a },
    grass: { blade: 0x2f6b2c, top: 0x6fb04a },
  },
  {
    id: "beach",
    name: "OCEAN DRIVE",
    url: beachUrl,
    sky: 0x8ccdf0,
    ground: { base: 0x7b5ea7, top: 0xb48ad6, dark: 0x5a4380, light: 0xd9b3f0 },
    plants: { back: 0xe07aa8, front: 0x5cc0c9 },
    grass: { blade: 0x2f8f7a, top: 0x7fd1b0 },
  },
  {
    id: "sunset",
    name: "SUNSET BLVD",
    url: sunsetUrl,
    sky: 0xf59a3a,
    ground: { base: 0xd97a3a, top: 0xf0a04a, dark: 0x9b4f26, light: 0xffc46b },
    plants: { back: 0x8a2a5a, front: 0xa8386a },
    grass: { blade: 0x4a1a3a, top: 0x7a2a4a },
  },
  {
    id: "losangeles",
    name: "LOS ANGELES",
    url: laUrl,
    sky: 0xf9b8a8,
    ground: { base: 0x9b2a62, top: 0xc2427f, dark: 0x7a1f4d, light: 0xe0699f },
    plants: { back: 0xd9506a, front: 0xf2728a },
    grass: { blade: 0x8a2260, top: 0xb5407a },
  },
  {
    id: "boston",
    name: "BOSTON",
    url: bostonUrl,
    sky: 0xa9cbea,
    ground: { base: 0x8a8f99, top: 0xb9bec8, dark: 0x686c76, light: 0xd5d8de },
    plants: { back: 0x6f8fa8, front: 0x8fb0c4 },
    grass: { blade: 0x3f7d3a, top: 0x72b04e },
  },
  {
    id: "miami",
    name: "MIAMI",
    url: miamiUrl,
    sky: 0x4fa8f8,
    ground: { base: 0xe7c58a, top: 0xf6dfae, dark: 0xc29a5a, light: 0xffeccb },
    plants: { back: 0x2f7de0, front: 0x5fb8e8 },
    grass: { blade: 0x2fa86a, top: 0x8fe06a },
  },
  {
    id: "texas",
    name: "TEXAS",
    url: texasUrl,
    sky: 0x4fc3d0,
    ground: { base: 0xd9904a, top: 0xf0b86a, dark: 0xa8602a, light: 0xffd89a },
    plants: { back: 0xc4603a, front: 0xe0824a },
    grass: { blade: 0x6a8a3a, top: 0x9ab04a },
  },
  {
    id: "chicago",
    name: "CHICAGO",
    url: chicagoUrl,
    sky: 0x6aa8f8,
    ground: { base: 0x4a5668, top: 0x7a889c, dark: 0x343e4e, light: 0x9aa8bc },
    plants: { back: 0x2f7de0, front: 0x5a9af0 },
    grass: { blade: 0x4a9a3a, top: 0x9ad04a },
  },
  {
    id: "vegas",
    name: "LAS VEGAS",
    url: vegasUrl,
    sky: 0x1a1240,
    ground: { base: 0x2a1f4a, top: 0x5a3a9a, dark: 0x1a1230, light: 0xff4fa0 },
    plants: { back: 0x4a2a7a, front: 0x7a3a9a },
    grass: { blade: 0x2a8a4a, top: 0x6ad06a },
  },
  {
    id: "sanfrancisco",
    name: "SAN FRANCISCO",
    url: sfUrl,
    sky: 0x7ab0d8,
    ground: { base: 0x6a6f7a, top: 0x9a9fab, dark: 0x4a4f5a, light: 0xc0c4cc },
    plants: { back: 0x7a8fa8, front: 0x9ab0c4 },
    grass: { blade: 0x4a8a3a, top: 0x82b85a },
  },
];

export const themeForScore = (score) =>
  THEMES[Math.floor(score / THEME_STEP) % THEMES.length];
