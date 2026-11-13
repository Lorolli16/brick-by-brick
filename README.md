# Brick by Brick

Fair chores for shared flats: split chores by effort points, approve each other's
work, swap chores and climb the "best roommate" leaderboard.

Started in Lovable; now developed locally.

## Run it

Needs [Node.js](https://nodejs.org) 20 or newer.

```sh
npm install
npm run dev        # http://localhost:5173 (port may vary; see terminal)
```

Other scripts: `npm test` (Vitest), `npm run lint`, `npm run build`.

## How data works

There is no backend yet. Accounts, the flat, chores, approvals and your profile
are saved in the browser's localStorage (keys start with `bxb.v1.`), see
`src/lib/store.ts`. Passwords are never stored. Flatmates (Marta, Jordi, Aisha),
leaderboards, swaps and chips are sample data until real accounts exist.
Profile -> "Clear data on this device" resets everything.
