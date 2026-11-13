# Brick by Brick

Fair chores for shared flats: split chores by effort points, approve each other's
work, swap chores and climb the "best roommate" leaderboard.

**Live preview:** https://lorolli16.github.io/brick-by-brick/

**Design spec:** [docs/UX-UI-SPEC.md](docs/UX-UI-SPEC.md), full UX/UI description for rebuilding the app elsewhere.

## Run it locally

Needs [Node.js](https://nodejs.org) 20 or newer.

```sh
npm install
npm run dev        # http://localhost:5173 (port may vary; see terminal)
npm test           # unit tests (Vitest)
```

## Deploying

There are two builds of the same app:

| Build | Command | Use for |
|---|---|---|
| Full app (TanStack Start, server rendering) | `npm run build` | Vercel, Netlify, Cloudflare and other hosts that run a server |
| Static site (browser only) | `npm run build:static` | GitHub Pages or any static file host |

**GitHub Pages** deploys automatically on every push to `main`
(`.github/workflows/deploy-pages.yml`), which publishes the built site to the
`gh-pages` branch. If Pages is not on yet: repo **Settings → Pages →
Source: Deploy from a branch → gh-pages / (root)**. The static build reads `BASE_PATH`
(set to `/brick-by-brick/` by the workflow) so links work under the repo's sub-path.

## How data works

There is no backend yet. Accounts, the flat, chores, approvals and your profile
are saved in each visitor's own browser (localStorage, keys start with `bxb.v1.`),
see `src/lib/store.ts`. Passwords are never stored. People don't see each other's
data, and flatmates (Marta, Jordi, Aisha), leaderboards, swaps and chips are sample
data until real accounts exist. Profile → "Clear data on this device" resets everything.
