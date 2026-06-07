export type Kid = "dylan" | "brayden";

export type GameType = "html" | "scratch" | "external" | "placeholder" | "react";

export type Game = {
  id: string;
  title: string;
  description: string;
  type: GameType;
  playUrl: string;
  thumbnailUrl: string | null;
};
