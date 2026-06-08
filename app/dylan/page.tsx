import Link from "next/link";
import { getDylanGames } from "@/src/data/dylanGames";

function GameThumbnail({
  title,
  thumbnailUrl
}: {
  title: string;
  thumbnailUrl: string | null;
}) {
  return (
    <div className="gameTileImage">
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt="" />
      ) : (
        <div className="placeholderTile" aria-hidden="true">
          <span className="placeholderEmoji">🎮</span>
          <span className="placeholderInitial">{title.charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

export default async function DylanPage() {
  const games = await getDylanGames();

  return (
    <main className="dylanDiscoveryPage">
      <header className="dylanDiscoveryHeader">
        <div className="dylanHeaderIcon" aria-hidden="true">
          🎮
        </div>
        <div>
          <h1>Dylan Games</h1>
          <p>Pick a game and start playing!</p>
        </div>
        <Link className="homeLink dylanHeaderHome" href="/">
          Home
        </Link>
      </header>

      {games.length > 0 ? (
        <section className="allGamesSection" aria-labelledby="all-games-title">
          <h2 id="all-games-title">All Games</h2>
          <div className="discoveryGrid">
            {games.map((game) => {
              const href = game.type === "external" ? game.playUrl : `/play/dylan/${game.id}`;

              return (
                <Link
                  className="discoveryCard"
                  href={href}
                  key={game.id}
                  aria-label={`Play ${game.title}`}
                  target={game.type === "external" ? "_blank" : undefined}
                  rel={game.type === "external" ? "noreferrer" : undefined}
                >
                  <GameThumbnail title={game.title} thumbnailUrl={game.thumbnailUrl} />
                  <div className="discoveryCardBody">
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                    <span className="tilePlayButton">Play</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="emptyState" aria-label="No Dylan games yet">
          <h2>No games yet</h2>
          <p>Add a folder inside public/games/dylan with an HTML file to make a game card appear.</p>
        </section>
      )}
    </main>
  );
}
