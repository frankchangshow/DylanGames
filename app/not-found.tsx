import Link from "next/link";

export default function NotFound() {
  return (
    <main className="emptyState fullPage">
      <h1>Game not found</h1>
      <p>That game is not in the launcher right now.</p>
      <Link className="playButton" href="/">
        Back home
      </Link>
    </main>
  );
}
