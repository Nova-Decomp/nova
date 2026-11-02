export type Game = {
  id: string;
  name: string;
  platform: string; // original platform, e.g. "Nintendo 64"
  description: string;
  installed: boolean;
  version?: string;
  supportsMods: boolean;
};

export type Mod = {
  id: string;
  gameId: string;
  name: string;
  author: string;
  summary: string;
};

export type SetupType = "none" | "app-prompts" | "place-files" | "extract-tool";

export type SetupInfo = {
  type: SetupType;
  requires: string;
  guide: string[];
};

export type CatalogEntry = {
  id: string;
  name: string;
  repo: string;
  description: string;
  stars: number;
  latestTag: string;
  prerelease: boolean;
  publishedAt: string;
  platforms: ("windows" | "linux" | "macos")[];
  gamePlatform?: string;
  setup?: SetupInfo;
  reviewed: boolean;
};