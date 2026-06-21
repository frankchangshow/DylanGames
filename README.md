# Chang Brother Games

A simple Next.js game launcher for two kids.

## Pages

- `/` shows a landing page with buttons for Dylan Games and Brayden Games.
- `/dylan` shows Dylan's game launcher.
- `/brayden` shows Brayden's placeholder launcher.
- `/daddy` shows Daddy's game launcher.
- `/play/[kid]/[game]` plays a game in a full-page iframe.

## Game folders

Finished Dylan HTML games live here:

```text
public/games/dylan/
```

Brayden games live here:

```text
public/games/brayden/
```

Daddy games live here:

```text
public/games/daddy/
```

React/TSX Dylan games live here:

```text
src/react-games/dylan/
```

## Add a Dylan HTML game

1. Create a folder in `public/games/dylan/`.
2. Add an HTML file.
3. Commit to `main`.

Example:

```text
public/games/dylan/tower-defense-starters/
  index.html
  style.css
  script.js
```

The launcher prefers `index.html`. If there is no `index.html`, it uses the first `.html` file in the folder.

The card appears automatically after Vercel rebuilds.

## Add a Dylan React game

React games are source code, so they must live under `src/react-games/dylan/`, not `public/games/dylan/`.

1. Create a folder in `src/react-games/dylan/`.
2. Add a client component file.
3. Add the game to `src/data/dylanGames.ts`.
4. Add it to `src/react-games/ReactGamePlayer.tsx`.
5. Commit to `main`.

Example:

```text
src/react-games/dylan/my-react-game/MyReactGame.tsx
```

The play route renders React games directly. HTML games still run in an iframe.

## Add a Brayden HTML game later

1. Create a folder in `public/games/brayden/`.
2. Add an HTML file.
3. Update `src/data/braydenGames.ts` to use discovery instead of the placeholder.
4. Commit to `main`.

## Add a Daddy HTML game

1. Create a folder in `public/games/daddy/`.
2. Add an HTML file.
3. Commit to `main`.

Example:

```text
public/games/daddy/arcade-fighter/
  index.html
  thumbnail.png
```

The Daddy launcher appears at `/daddy`.

## Add a Scratch or external game

Create a folder and add `game.json`.

Scratch example:

```json
{
  "title": "Scratch Race",
  "description": "A fun Scratch racing game.",
  "type": "scratch",
  "url": "https://scratch.mit.edu/projects/123456/embed"
}
```

External example:

```json
{
  "title": "Water Chess",
  "description": "Open Water Chess in a new tab.",
  "type": "external",
  "url": "https://waterchess.vercel.app"
}
```

## Remove a game

Delete the game's folder from `public/games/dylan/` or `public/games/brayden/`, then commit to `main`.

## Notes

- Dylan games are auto-discovered during the Vercel build.
- Folder names become play URLs, so use simple names like `tower-defense-starters`.
- Optional thumbnails can be named `thumbnail.png`, `thumbnail.jpg`, `thumbnail.jpeg`, `thumbnail.webp`, or `thumbnail.gif`.
- No login, admin page, CMS, blog, or extra branches are needed.

## Global play counts with Supabase

The launcher can show global play counts if Supabase is configured. If Supabase is not configured yet, the site still works and shows `0 plays`.

Create this table and function in the Supabase SQL editor:

```sql
create table if not exists public.game_play_counts (
  kid text not null,
  game_id text not null,
  play_count bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (kid, game_id)
);

create or replace function public.increment_play_count(
  target_kid text,
  target_game_id text
)
returns bigint
language plpgsql
security definer
as $$
declare
  new_count bigint;
begin
  insert into public.game_play_counts (kid, game_id, play_count)
  values (target_kid, target_game_id, 1)
  on conflict (kid, game_id)
  do update set
    play_count = public.game_play_counts.play_count + 1,
    updated_at = now()
  returning play_count into new_count;

  return new_count;
end;
$$;
```

Add these environment variables in Vercel:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The service role key must stay server-side. Do not put it in game files or browser code.
