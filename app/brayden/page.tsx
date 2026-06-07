import Link from "next/link";
import { getBraydenGames } from "@/src/data/braydenGames";

export default async function BraydenPage() {
  const games = await getBraydenGames();

  return (
    <main className="launcherPage braydenLauncher">
      <header className="launcherHero">
        <Link className="homeLink" href="/">
          Home
        </Link>
        <h1>Brayden Games</h1>
        <p>Coming soon</p>
      </header>

      <section className="gameGrid" aria-label="Brayden games">
        {games.map((game) => (
          <article className="gameCard placeholderCard" key={game.id}>
            <div className="thumbnail">
              <span>B</span>
            </div>
            <div className="cardBody">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <span className="disabledButton">Soon</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
