import Link from "next/link";

export default function Home() {
  return (
    <main className="landingPage">
      <section className="landingHero" aria-labelledby="site-title">
        <p className="eyebrow">Pick a player</p>
        <h1 id="site-title">Chang Family Games</h1>
        <div className="kidButtons" aria-label="Game launchers">
          <Link className="kidButton dylanButton" href="https://dylan-games.com/">
            <span>Dylan Games</span>
          </Link>
          <Link className="kidButton braydenButton" href="https://braydengames.com/">
            <span>Brayden Games</span>
          </Link>
          <Link className="kidButton daddyButton" href="/daddy">
            <span>Daddy Games</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
