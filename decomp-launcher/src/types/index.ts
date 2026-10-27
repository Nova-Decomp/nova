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
