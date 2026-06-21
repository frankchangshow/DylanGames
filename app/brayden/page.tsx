import Link from "next/link";
import GameCardStats from "@/src/components/GameCardStats";
import { getBraydenGames } from "@/src/data/braydenGames";
import type { Game } from "@/src/data/types";

const gameTypeLabels: Record<Game["type"], string> = {
  external: "Others",
  html: "HTML",
  nextjs: "Next.js",
  other: "Others",
  placeholder: "Soon",
  react: "React",
  scratch: "Scratch"
};

function BraydenThumbnail({
  title,
  thumbnailUrl
}: {
  title: string;
  thumbnailUrl: string | null;
}) {
  return (
    <div className="braydenTileImage">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={`${title} thumbnail`} />
      ) : (
        <div className="braydenPlaceholderTile" aria-hidden="true">
          <span className="braydenPlaceholderEmoji">🎮</span>
          <span className="braydenPlaceholderInitial">{title.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

export default async function BraydenPage() {
  const games = await getBraydenGames();
  const playableGameIds = games.filter((game) => (game.status || "playable") === "playable").map((game) => game.id);
  const newestUploadedAt = Math.max(0, ...games.map((game) => game.uploadedAt || 0));

  return (
    <main className="braydenDiscoveryPage">
      <header className="braydenDiscoveryHeader">
        <Link className="braydenHomeLink" href="https://chang-games.vercel.app/">
          Home
        </Link>
        <div>
          <h1>Brayden Games</h1>
          <p>Pick a game and start playing</p>
        </div>
      </header>

      <section className="braydenGamesSection" aria-labelledby="brayden-games-title">
        <div className="braydenSectionHeader">
          <h2 id="brayden-games-title">All Games</h2>
          <span>{games.length} games</span>
        </div>

        <div className="braydenGameGrid">
          {games.map((game) => {
            const status = game.status || "playable";
            const isComingSoon = status === "coming-soon";
            const href = game.type === "external" ? game.playUrl : `/play/brayden/${game.id}`;

            return (
              <Link
                className={`braydenGameCard ${isComingSoon ? "isComingSoon" : ""}`}
                href={href}
                key={game.id}
                aria-label={isComingSoon ? `${game.title} coming soon` : `Play ${game.title}`}
                target={game.type === "external" ? "_blank" : undefined}
                rel={game.type === "external" ? "noreferrer" : undefined}
              >
                <div className="braydenThumbWrap">
                  <BraydenThumbnail title={game.title} thumbnailUrl={game.thumbnailUrl} />
                  <span className="braydenTypeBadge">{gameTypeLabels[game.type]}</span>
                  {isComingSoon ? <span className="braydenStatusBadge">Soon</span> : null}
                </div>
                <div className="braydenCardBody">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <GameCardStats
                    kid="brayden"
                    gameId={game.id}
                    gameIds={playableGameIds}
                    isNew={(game.uploadedAt || 0) === newestUploadedAt && newestUploadedAt > 0}
                    variant="brayden"
                  />
                  <span className="braydenPlayButton">{isComingSoon ? "Coming Soon" : "Play"}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
