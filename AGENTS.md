# Repository Guidelines

## Project Structure & Module Organization

- `pages/`: Nextra/Next.js routes and MDX content (e.g., `pages/fundamentals/custom-subagents.mdx`). Navigation lives in `_meta.ts` files (root + per-section).
- `components/`: Reusable React components for MDX/pages.
- `styles/`: Global styling.
- `public/`: Static assets and downloads (images, `robots.txt`, `sitemap.xml`, etc.).
- `course-materials/`: Source course materials and templates used to author content.

Note: Some legacy docs mention a `website/` subfolder; this repository’s Next.js site runs from the repo root.

## Build, Test, and Development Commands

- `npm install`: Install dependencies (Node.js 18+ recommended).
- `npm run dev`: Start the local dev server at `http://localhost:3000`.
- `npm run build`: Create a static export in `out/`, then generate sitemap + Pagefind search index via `postbuild`.
- `npm run preview`: Serve `out/` on port 3000 to verify the static export.

## Coding Style & Naming Conventions

- Use TypeScript/TSX for new React code; the project is `strict` (see `tsconfig.json`).
- Prefer 2-space indentation for JS/TS/MDX and follow existing patterns in nearby files.
- Use kebab-case for MDX paths and keep section folders stable (e.g., `pages/vibe-coding/go-live.mdx`).
- Use `_meta.ts` for navigation (do not introduce `_meta.json`).

## Testing Guidelines

There is no automated test suite. Before opening a PR, run `npm run build` and do a quick smoke-check using `npm run preview`.

## Commit & Pull Request Guidelines

- Commits are short, imperative, and descriptive (e.g., `Add …`, `Fix …`, `Update …`, `Revert …`); include issue refs like `(#4)` when relevant.
- PRs should include: summary + rationale, screenshots for layout/visual changes, and confirmation that `npm run build` succeeds.
- Do not commit build artifacts or vendor dirs (`.next/`, `out/`, `node_modules/`).

## Security & Configuration Tips

- Don’t commit secrets or local-only config (e.g., `.env.local`).
- Keep analytics/tracking changes explicit and well-described in the PR.
