import Link from "next/link";
import { notFound } from "next/navigation";
import PlayCounter from "@/src/components/PlayCounter";
import { getGameForKid, getPlayableGames, isKid } from "@/src/data/games";
import ReactGamePlayer from "@/src/react-games/ReactGamePlayer";

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
      title: "Game | Chang Family Games"
    };
  }

  const game = await getGameForKid(kid, gameId);

  return {
    title: game ? `${game.title} | Chang Family Games` : "Game | Chang Family Games"
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

  if (game.status === "coming-soon") {
    return (
      <main className="playPage comingSoonPlayPage">
        <div className="playBar">
          <Link href={`/${kid}`} className="backButton" aria-label={`Back to ${kid} games`}>
            ←
          </Link>
          <h1>{game.title}</h1>
        </div>
        <section className="comingSoonGamePanel">
          <div aria-hidden="true">🎮</div>
          <h2>{game.title} is coming soon</h2>
          <p>This game is on the game shelf, but it is not ready to play yet.</p>
          <Link href={`/${kid}`} className="comingSoonBackLink">
            Back to games
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="playPage">
      <PlayCounter kid={kid} gameId={game.id} />
      <div className="playBar">
        <Link href={`/${kid}`} className="backButton" aria-label={`Back to ${kid} games`}>
          ←
        </Link>
        <h1>{game.title}</h1>
      </div>
      {game.type === "react" ? (
        <div className="reactGameFrame">
          <ReactGamePlayer kid={kid} gameId={game.id} />
        </div>
      ) : (
        <iframe
          className="gameFrame"
          src={game.playUrl}
          title={game.title}
          allow="autoplay; fullscreen; gamepad; microphone; camera"
          allowFullScreen
        />
      )}
    </main>
  );
}
