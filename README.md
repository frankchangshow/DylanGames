# Dylan Games

A very simple Next.js game launcher. The homepage always renders a small hardcoded launcher list so `/` stays reliable on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add a new HTML game

1. Create a folder in `public/games/`.
2. Add `index.html`.
3. Add the game to `lib/games.ts`.
4. Deploy.

Example:

```text
public/games/stop-then-go/
  index.html
  thumbnail.png
```

Clicking it opens `/play/stop-then-go` and loads `/games/stop-then-go/index.html`.

## Add a Scratch game

1. Add the Scratch embed URL to `lib/games.ts`.
2. Set `type` to `scratch`.
3. Deploy.

Example:

```json
{
  "title": "Scratch Race",
  "type": "scratch",
  "url": "https://scratch.mit.edu/projects/123456/embed"
}
```

Clicking it opens `/play/scratch-race` and embeds the Scratch project.

## Add an external game

1. Add the external URL to `lib/games.ts`.
2. Set `type` to `external`.
3. Deploy.

Example:

```json
{
  "title": "Water Chess",
  "type": "external",
  "url": "https://waterchess.vercel.app"
}
```

External games open in a new tab.

## Notes

- The launcher uses the list in `lib/games.ts`.
- The homepage does not read the filesystem at runtime.
- HTML games need an `index.html`.
- This works on GitHub and the Vercel Hobby Plan.
