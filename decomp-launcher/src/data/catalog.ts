import type { Game, Mod } from "@/types";

// MOCK DATA. Later this file will load from AllRecomps (if permitted) or our own manifests.
const games: Game[] = [
  {
    id: "game-a",
    name: "Example Game A",
    platform: "Nintendo 64",
    description: "Native PC port of a classic platformer.",
    installed: true,
    version: "1.2.0",
    supportsMods: true,
  },
  {
    id: "game-b",
    name: "Example Game B",
    platform: "Game Boy Advance",
    description: "Community decomp with a native build.",
    installed: true,
    version: "0.9.1",
    supportsMods: false,
  },
  {
    id: "game-c",
    name: "Example Game C",
    platform: "PC",
    description: "Source-recreated engine for a retro racer.",
    installed: false,
    supportsMods: true,
  },
  {
    id: "game-d",
    name: "Example Game D",
    platform: "GameCube",
    description: "Recompiled action adventure.",
    installed: false,
    supportsMods: true,
  },
];

const mods: Mod[] = [
  {
    id: "m1",
    gameId: "game-a",
    name: "HD Texture Pack",
    author: "ModderOne",
    summary: "Higher resolution textures.",
  },
  {
    id: "m2",
    gameId: "game-a",
    name: "Hard Mode",
    author: "ModderTwo",
    summary: "Tougher enemies.",
  },
];

export const getGames = (): Game[] => games;
export const getMods = (gameId: string): Mod[] =>
  mods.filter((m) => m.gameId === gameId);
