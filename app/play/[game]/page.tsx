import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, getGames } from "@/lib/games";

export const dynamic = "force-dynamic";

type PlayPageProps = {
  params: Promise<{
    game: string;
  }>;
};

export async function generateStaticParams() {
  const games = await getGames();
  return games
    .filter((game) => game.type !== "external")
    .map((game) => ({
      game: game.id
    }));
}

export async function generateMetadata({ params }: PlayPageProps) {
  const { game: gameId } = await params;
  const game = await getGame(gameId);

  return {
    title: game ? `${game.title} | Dylan Games` : "Game | Dylan Games"
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { game: gameId } = await params;
  const game = await getGame(gameId);

  if (!game || game.type === "external") {
    notFound();
  }

  return (
    <main className="playPage">
      <div className="playBar">
        <Link href="/" className="backButton" aria-label="Back to all games">
          ←
        </Link>
        <h1>{game.title}</h1>
      </div>
      <iframe
        className="gameFrame"
        src={game.playUrl}
        title={game.title}
        allow="autoplay; fullscreen; gamepad; microphone; camera"
        allowFullScreen
      />
    </main>
  );
}
