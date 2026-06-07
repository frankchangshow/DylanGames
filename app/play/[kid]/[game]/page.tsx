import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameForKid, getPlayableGames, isKid } from "@/src/data/games";

export const dynamicParams = false;

type PlayPageProps = {
  params: Promise<{
    kid: string;
    game: string;
  }>;
};

export async function generateStaticParams() {
  const games = await getPlayableGames();
  return games.map(({ kid, game }) => ({
    kid,
    game: game.id
  }));
}

export async function generateMetadata({ params }: PlayPageProps) {
  const { kid, game: gameId } = await params;

  if (!isKid(kid)) {
    return {
      title: "Game | Chang Brother Games"
    };
  }

  const game = await getGameForKid(kid, gameId);

  return {
    title: game ? `${game.title} | Chang Brother Games` : "Game | Chang Brother Games"
  };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { kid, game: gameId } = await params;

  if (!isKid(kid)) {
    notFound();
  }

  const game = await getGameForKid(kid, gameId);

  if (!game || game.type === "external" || game.type === "placeholder") {
    notFound();
  }

  return (
    <main className="playPage">
      <div className="playBar">
        <Link href={`/${kid}`} className="backButton" aria-label={`Back to ${kid} games`}>
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
