import bambooUrl from "../../assets/lakorobe/backgroundBamboo.png";
import desertUrl from "../../assets/runner-themes/desert.jpg";
import snowUrl from "../../assets/runner-themes/neige.jpg";
import nycUrl from "../../assets/runner-themes/the-statue-of-liberty.jpg";
import dcUrl from "../../assets/runner-themes/washington-dc-usa.jpg";

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
];

export const themeForScore = (score) =>
  THEMES[Math.floor(score / THEME_STEP) % THEMES.length];
