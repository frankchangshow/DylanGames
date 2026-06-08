import Link from "next/link";
import { getDylanGames } from "@/src/data/dylanGames";

function GameThumbnail({
  title,
  thumbnailUrl,
  featured = false,
  compact = false
}: {
  title: string;
  thumbnailUrl: string | null;
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <div className={featured ? "gameTileImage featuredTileImage" : compact ? "gameTileImage compactTileImage" : "gameTileImage"}>
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
  const featuredGame = games[0] || null;

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

      {featuredGame ? (
        <>
          <section className="featuredGameSection" aria-labelledby="featured-game-title">
            <div className="featuredStage">
              <GameThumbnail title={featuredGame.title} thumbnailUrl={featuredGame.thumbnailUrl} featured />
              <div className="featuredGameInfo">
                <p className="sectionEyebrow">Featured Game</p>
                <h2 id="featured-game-title">{featuredGame.title}</h2>
                <p>{featuredGame.description}</p>
                <Link
                  className="featuredPlayButton"
                  href={featuredGame.type === "external" ? featuredGame.playUrl : `/play/dylan/${featuredGame.id}`}
                  target={featuredGame.type === "external" ? "_blank" : undefined}
                  rel={featuredGame.type === "external" ? "noreferrer" : undefined}
                >
                  Play
                </Link>
              </div>
            </div>
          </section>

          <section className="allGamesSection" aria-labelledby="all-games-title">
            <h2 id="all-games-title">All Games</h2>
            <div className="discoveryList">
              {games.map((game) => {
                const href = game.type === "external" ? game.playUrl : `/play/dylan/${game.id}`;

                return (
                  <article className="discoveryCard" key={game.id}>
                    <GameThumbnail title={game.title} thumbnailUrl={game.thumbnailUrl} compact />
                    <div className="discoveryCardBody">
                      <h3>{game.title}</h3>
                      <p>{game.type === "react" ? "React Game" : game.type === "html" ? "HTML Game" : `${game.type} Game`}</p>
                      <strong>Playable</strong>
                    </div>
                    <p className="discoveryCardDescription">{game.description}</p>
                    <div className="discoveryCardAction">
                      <Link
                        className="tilePlayButton"
                        href={href}
                        target={game.type === "external" ? "_blank" : undefined}
                        rel={game.type === "external" ? "noreferrer" : undefined}
                      >
                        Play
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        <section className="emptyState" aria-label="No Dylan games yet">
          <h2>No games yet</h2>
          <p>Add a folder inside public/games/dylan with an HTML file to make a game card appear.</p>
        </section>
      )}
    </main>
  );
}
