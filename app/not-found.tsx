import Link from "next/link";

export default function NotFound() {
  return (
    <main className="emptyState fullPage">
      <h1>Page not found</h1>
      <p>That page is not in Chang Family Games right now.</p>
      <Link className="playButton" href="/">
        Back home
      </Link>
    </main>
  );
}
