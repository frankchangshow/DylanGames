# Dylan Games

A very simple Next.js game launcher. The homepage scans `public/games/` during the Vercel build and creates cards automatically.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Add a new HTML game

1. Create a folder in `public/games/`.
2. Add an HTML file.
3. Commit to `main`.

Example:

```text
public/games/tower-defense-starters/
  tower_defense_starters.html
  style.css
  script.js
```

The launcher prefers `index.html` when it exists. If there is no `index.html`, it uses the first `.html` file in the folder.

Clicking the card opens `/play/tower-defense-starters` and loads the HTML file from that folder.

## Add a Scratch game

1. Create a folder in `public/games/`.
2. Add `game.json`.
3. Commit to `main`.

Example:

```json
{
  "title": "Scratch Race",
  "type": "scratch",
  "url": "https://scratch.mit.edu/projects/123456/embed"
}
```

Clicking the card opens `/play/scratch-race` and embeds the Scratch project.

## Add an external game

1. Create a folder in `public/games/`.
2. Add `game.json`.
3. Commit to `main`.

Example:

```json
{
  "title": "Water Chess",
  "type": "external",
  "url": "https://waterchess.vercel.app"
}
```

External games open in a new tab.

## Remove a game

Delete the game's folder from `public/games/`, then commit to `main`.

## Notes

- Every direct subfolder of `public/games/` is checked automatically during build.
- Folder names become play URLs, so use simple names like `tower-defense-starters`.
- Optional thumbnails can be named `thumbnail.png`, `thumbnail.jpg`, `thumbnail.jpeg`, `thumbnail.webp`, or `thumbnail.gif`.
- This works on GitHub and the Vercel Hobby Plan.
