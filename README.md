# Dylan Games

A very simple Next.js game launcher. The homepage automatically scans `public/games/` and shows every game it finds.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add a new HTML game

1. Create a folder in `public/games/`.
2. Add `index.html`.
3. Optional: add `thumbnail.png`, `thumbnail.jpg`, `thumbnail.webp`, or `thumbnail.gif`.
4. Deploy.

Example:

```text
public/games/stop-then-go/
  index.html
  thumbnail.png
```

The game will appear automatically on the homepage. Clicking it opens `/play/stop-then-go` and loads `/games/stop-then-go/index.html`.

## Add a Scratch game

1. Create a folder in `public/games/`.
2. Add `game.json`.
3. Optional: add a thumbnail image.
4. Deploy.

Example:

```json
{
  "title": "Scratch Race",
  "type": "scratch",
  "url": "https://scratch.mit.edu/projects/123456/embed"
}
```

The game will appear automatically. Clicking it opens `/play/scratch-race` and embeds the Scratch project.

## Add an external game

1. Create a folder in `public/games/`.
2. Add `game.json`.
3. Optional: add a thumbnail image.
4. Deploy.

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

- Every subfolder of `public/games/` is checked automatically.
- HTML games need an `index.html`.
- Scratch and external games need a `game.json` with `title`, `type`, and `url`.
- This works on GitHub and the Vercel Hobby Plan.
