import Link from "next/link";
import { getDylanGames } from "@/src/data/dylanGames";

export default async function DylanPage() {
  const games = await getDylanGames();

  return (
    <main className="launcherPage dylanLauncher">
      <header className="launcherHero">
        <Link className="homeLink" href="/">
          Home
        </Link>
        <h1>Dylan Games</h1>
        <p>Pick a game and jump in.</p>
      </header>

      {games.length > 0 ? (
        <section className="gameGrid robloxGrid" aria-label="Dylan games">
          {games.map((game) => {
            const href = game.type === "external" ? game.playUrl : `/play/dylan/${game.id}`;

            return (
              <article className="gameCard robloxCard" key={game.id}>
                <div className="thumbnail">
                  {game.thumbnailUrl ? (
                    <img src={game.thumbnailUrl} alt="" />
                  ) : (
                    <span>{game.title.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="cardBody">
                  <h2>{game.title}</h2>
                  <p>{game.description}</p>
                  <Link
                    className="playButton"
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
