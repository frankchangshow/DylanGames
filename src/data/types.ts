export type Kid = "dylan" | "brayden" | "daddy";

export type GameType = "html" | "scratch" | "external" | "placeholder" | "react" | "nextjs" | "other";
export type GameStatus = "playable" | "coming-soon";

export type Game = {
  id: string;
  title: string;
  description: string;
  type: GameType;
  status?: GameStatus;
  playUrl: string;
  thumbnailUrl: string | null;
  uploadedAt?: number;
};
