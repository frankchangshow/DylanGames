import Link from "next/link";
import { getGames } from "@/lib/games";

export const dynamic = "force-dynamic";

export default async function Home() {
  const games = await getGames();

  return (
    <main className="home">
      <header className="hero">
        <h1>🎮 Dylan Games</h1>
      </header>

      {games.length > 0 ? (
        <section className="gameGrid" aria-label="Available games">
          {games.map((game) => {
            const href = game.type === "external" ? game.playUrl : `/play/${game.id}`;

            return (
              <article className="gameCard" key={game.id}>
                <div className="thumbnail">
                  {game.thumbnailUrl ? (
                    <img src={game.thumbnailUrl} alt="" />
                  ) : (
                    <span>{game.title.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="cardBody">
                  <h2>{game.title}</h2>
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
        <section className="emptyState" aria-label="No games yet">
          <h2>No games yet</h2>
          <p>Add a folder inside public/games to make your first game card appear.</p>
        </section>
      )}
    </main>
  );
}
