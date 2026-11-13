# Brick by Brick — UX & UI specification

This document describes the app exactly as built (November 2026), so it can be rebuilt
in another codebase or tool and look and behave the same. Where something is sample
data or not yet functional, it says so.

Live reference: https://lorolli16.github.io/brick-by-brick/

---

## 1. Product in one paragraph

Brick by Brick helps people who share a flat split household chores fairly. Each chore
has **effort points** (1–10). The app splits the week's chores so everyone carries
roughly the same number of points, flatmates **approve** each other's finished chores,
can **swap** chores, earn **chips** (small perks like a Skip Pass), and compete on a
flat leaderboard and a global **"best roommate"** leaderboard. Tone: friendly,
encouraging, a little playful; never nagging.

**Platform:** mobile-first web app. Everything is laid out for a phone in portrait;
on wider screens the same phone-width column is centred.

---

## 2. Brand

### Logo
- File: `src/assets/logo.png` (512×512). Icons: `public/favicon.png` (64×64),
  `public/apple-touch-icon.png` (180×180).
- Mark: three bold, slightly overlapping capital **B** letters, left to right in
  **navy, rust, ochre**, on a white rounded-square tile with a thin dark-grey rim.
  The three B's are "brick by brick" and match the app's three brand colours in order.
- Shown at 96×96 px on the sign-in screen (corner radius 28 px, soft shadow) and
  40×40 px in the app header (corner radius 20 px).
- Alt text: "Brick by Brick logo".

### Name and taglines
- Product name: **Brick by Brick** (always three words, title case).
- Sign-in subtitle: "A fair flat, one chore at a time."
- Short description: "Fair chores for shared flats, brick by brick."

### Voice
- Second person, short sentences, light emoji at the end of a line (🧱 🎉 😎 🧽 👑 🔥 ✨).
- Celebrate effort ("Nice!", "Looking sharp."), never shame.
- Error messages say what to do, e.g. "Give the chore a name (2+ letters)."

---

## 3. Design tokens

Single light theme (there is no dark mode in the current app).

### Colours

| Token | Role | oklch (source of truth) | Hex (approx.) |
|---|---|---|---|
| `background` | Page background (warm off-white) | `oklch(0.975 0.006 75)` | `#F9F6F2` |
| `foreground` | Main text; toast background | `oklch(0.29 0.014 260)` | `#272C32` |
| `card` | Cards, inputs, bottom nav | `oklch(1 0 0)` | `#FFFFFF` |
| `primary` | **Navy** — main buttons, active states, headings in brand colour | `oklch(0.32 0.075 250)` | `#0F3457` |
| `primary-foreground` | Text on navy | `oklch(0.99 0 0)` | `#FCFCFC` |
| `rust` | **Rust** — flat name label, Marta's avatar | `oklch(0.47 0.13 32)` | `#963828` |
| `accent` | **Ochre** — streak pill, chips, winner card, highlights | `oklch(0.64 0.13 65)` | `#C17924` |
| `accent-foreground` | Text on ochre | `oklch(0.99 0 0)` | `#FCFCFC` |
| `secondary` | Soft blush tint — icon tiles, avatar bg, today row | `oklch(0.94 0.025 35)` | `#FBE6E0` |
| `secondary-foreground` | Text on blush | `oklch(0.45 0.12 32)` | `#8B3627` |
| `muted` | Segmented-control track, neutral buttons, unselected chips | `oklch(0.94 0.008 85)` | `#EEEBE5` |
| `muted-foreground` | Secondary text, inactive nav | `oklch(0.5 0.015 260)` | `#5E646C` |
| `success` | Approve button, "Waiting ✓" text | `oklch(0.68 0.12 155)` | `#53AE77` |
| `destructive` | Delete, "Send back", errors (same hue as rust) | `oklch(0.47 0.13 32)` | `#963828` |
| `border` / `input` | Hairlines, input borders | `oklch(0.9 0.01 85)` | `#E1DED7` |
| `ring` | Focus ring | = primary | `#0F3457` |

### Typography
- **Display:** Poppins 500 / 600 / 700 — all `h1`, `h2`, `h3`, plus numbers and codes
  (points, scores, join codes, ranks).
- **Body:** Inter 400 / 500 / 600 — everything else.
- Both from Google Fonts.

| Use | Size / line | Weight |
|---|---|---|
| Screen title (sign-in, "Find your flat") | 30 px | 700 |
| Step screen title | 24 px | 700 |
| App header name | 20 px | 700, navy |
| Section heading ("This week") | 18 px | 600 |
| Body / buttons | 14 px | 400 body, 600 buttons |
| Captions, metadata | 12 px | 400–600 |
| Bottom-nav labels | 10 px | 400 |
| Eyebrow labels ("STEP 1 OF 3", flat name) | 12 px, uppercase, letter-spacing 0.1em | 600 |

### Shape, space, depth
- Base radius 16 px. Scale used: inputs/tiles **20 px** (`rounded-xl`), cards
  **24 px** (`rounded-2xl`), big media **28 px** (`rounded-3xl`), buttons/pills
  **fully round**.
- Soft shadow (only shadow in the app): `0 8px 24px -12px` of foreground at 25%.
  Cards have the shadow and **no border**.
- Spacing base 4 px. Card padding 16 px (20 px on onboarding cards). Gap between
  stacked cards 16 px in the app, 8–12 px in lists.
- Layout column: max width **448 px**, centred. Side padding 24 px on onboarding,
  20 px inside the app.
- Press feedback: buttons scale to 95% while pressed (98% for big option cards).

---

## 4. Components

| Component | Spec |
|---|---|
| **Card** | White, radius 24 px, padding 16 px, soft shadow. |
| **Primary button** | Navy fill, white text, 14 px semibold, fully round, padding 8×16 px (12 px vertical when full-width). |
| **Secondary button** | Blush fill, rust-dark text. |
| **Accent button** | Ochre fill, white text. |
| **Neutral button** | Muted fill, dark text. |
| **Success / destructive button** | Green / rust fill, white text. |
| **Outline button** | White fill, 1 px border, dark text ("Continue with Google"). |
| **Text button** | No fill, 12–14 px semibold navy (or rust for destructive). |
| **Segmented control** | Muted track, fully round, 4 px inner padding; each option flex-1, 8 px vertical padding, 14 px semibold. Selected = white pill + navy text + soft shadow; others muted text. Optional 16 px icon before the label. |
| **Text input** | White, 1 px border, radius 20 px, 12×16 px padding, 14 px; focus = 2 px navy ring. In-card inputs use the page background colour and 8×12 px padding. |
| **Toggle row** | A card with title (semibold) + 12 px muted subtitle on the left and a 20 px native checkbox tinted navy on the right; the whole row is clickable. |
| **Chip (preference)** | Fully round, 4×12 px, 12 px semibold. Selected = ochre fill/white text; unselected = muted fill/muted text. |
| **Pill badge** | Ochre fill, white 12 px semibold, fully round ("Skip Pass active", "🔥 6 wks"). |
| **Avatar** | Circle 40 px, initial letter semibold. Colours per person: You = navy, Marta = rust, Jordi = ochre, Aisha = blush. Profile avatar = 80 px blush circle with a 36 px emoji. |
| **Icon tile** | 48 px square, radius 20 px, blush (or ochre for the highlighted option), 24 px line icon. |
| **Progress ring** | 96 px SVG, radius 42, stroke 10; track muted, progress navy with round caps; starts at 12 o'clock, fills clockwise, animates on change. |
| **Leaderboard row** | Card with rank (32 px wide, display bold 18 px; 🥇🥈🥉 for top 3), name + 12 px muted subline, value right-aligned in navy display bold 18 px. The current user's row has a 2 px navy ring. |
| **Toast** | Fixed 96 px above the bottom, 20 px from the sides, max 384 px wide, radius 20 px, dark (foreground) fill, light text, centred 14 px. Disappears after 2.5 s. `role="status"`. |
| **Bottom navigation** | Fixed to the bottom, white, top hairline, 8 px vertical padding, items spread evenly. Each item = 20 px line icon above a 10 px label. Active = navy, inactive = muted. |
| **Sticky footer action** | On setup: fixed bottom bar in the page background colour with one full-width primary button. |
| **Icons** | Lucide line icons throughout. |

---

## 5. Navigation map

```
Sign in / Sign up  ──(Sign up)──▶  Find your flat (Step 1 of 3)  ──▶  Chore setup (Step 2 of 3)  ──▶  First fair week (Step 3 of 3)  ──▶  App
        │                                                                                                                          ▲
        └──────────────────────────────────────(Log in)──────────────────────────────────────────────────────────────────────────────┘
App tabs (bottom nav): My week · House · Approvals · Swaps · Leaderboard · Chips · Me
Hidden screen: Safety checklist (opened from Me)
```

- URLs: `/` sign-in, `/join`, `/setup`, `/app` (tabs switch inside `/app` without changing the URL).
- Someone who has already signed up on the device and opens the site root goes straight to `/app`.
- **Log out** (header link) returns to sign-in and forgets the account, but keeps the flat's data.

---

## 6. Screens

### 6.1 Sign in / Sign up (`/`)
Vertically centred column, 24 px side padding.
1. Logo 96 px.
2. "Brick by Brick" — 30 px bold, centred.
3. "A fair flat, one chore at a time." — 14 px muted, centred.
4. Segmented control: **Sign up** (default) | **Log in**. Switching clears errors.
5. Fields (all full width, 12 px apart):
   - First name (Sign up only), max 40 characters.
   - Email (type email), max 255.
   - Password, placeholder "Password (8+ characters)", max 72.
6. Error line in rust, 14 px, under the fields.
7. "Forgot password?" text button (Log in only; not functional yet).
8. Primary full-width button: "Create account" / "Log in".
9. Divider: hairline — "or" — hairline (12 px muted).
10. Outline full-width button "Continue with Google" (preview only: skips validation and continues).
11. Footer, 12 px muted, centred: "By continuing you agree to the house rules: be kind, do your bit. 🧱"

**Validation, in order:** Sign up without a name → "What should your flatmates call you?";
bad email → "That email looks off"; password shorter than 8 → "At least 8 characters".
**Result:** Sign up → Find your flat. Log in → App. The name and email are saved on the
device; the password is never stored. Log in with an unknown email uses the part of the
email before "@" as the display name.

### 6.2 Find your flat (`/join`) — Step 1 of 3
Top row: round white back button (16 px arrow, hidden on the first view) + eyebrow
"STEP 1 OF 3" in navy.

**Choose (default view)**
- Title "Find your flat" (30 px), subtitle "Ask a flatmate for the invite, or start a new flat."
- Three option cards (full width, icon tile + title + 12 px muted subtitle):
  1. QR icon — "Scan QR code" — "Point your camera at a flatmate's screen"
  2. Key icon — "Enter code" — "6 letters or numbers, like K7B2XQ"
  3. House icon on **ochre** tile — "Create a new flat" — "Be the first and invite the others"

**Scan QR**
- Title "Scan the flat's code". A square dark viewfinder (radius 28 px) with an inset
  dashed ochre frame (4 px), a pulsing navy scan line across the middle and a faded
  camera icon in the centre.
- Caption "We'll ask for camera access. Nothing is recorded."
- Primary "Simulate scan (preview)" → Flat found. Text button "Type the code instead".

**Enter code**
- Title "Enter your flat code", subtitle "Find it in a flatmate's app under Flat → Invite."
- Six boxes in a row (48×56 px, 2 px border, radius 20 px, 24 px display bold, uppercase;
  navy border on focus). Typing moves to the next box; Backspace on an empty box moves
  back; pasting a whole code fills all boxes; Enter submits. Only A–Z and 0–9 are kept.
- Primary "Join flat". Invalid → "Codes are 6 letters or numbers". After 5 attempts →
  "Too many tries. Take a breather and try again in a few minutes."

**Flat found**
- Centred card: 64 px ochre circle with 🏠, "Casa Eixample" (24 px bold),
  "Marta, Jordi and Aisha are waiting for you", three overlapping 40 px navy avatars
  (M, J, A) with white 2 px outlines, primary "Join Casa Eixample" → Setup.

**Create a new flat**
- Title "Name your flat", input (max 30, placeholder "e.g. Casa Eixample").
- As soon as a name is typed, a centred card appears: "Share this with your flatmates",
  an 11×11 QR-style grid (160 px), the join code in 30 px navy display bold with wide
  letter-spacing, and "Code expires in 7 days". The code is 6 random characters
  (no look-alikes 0/O/1/I).
- Primary "Continue" (disabled until a name is typed) → Setup.

### 6.3 Chore setup (`/setup`) — Step 2 of 3
- Eyebrow "STEP 2 OF 3", title "Confirm chores & points", subtitle "Points = effort. Agree on them together."
- One row card per chore (8 px apart): checkbox "include" · chore name (flex) · minus ·
  points (display bold navy) · plus · trash (rust). Points stay between 1 and 10.
  Excluded chores fade to 40% opacity.
- **Add box** (white, 2 px dashed border): "Add a chore your flat has", input
  "e.g. Clean the terrace" (max 40) with − / points (default 3) / + beside it, and a full
  secondary "+ Add chore" button. Enter also adds. Errors: "Give the chore a name (2+
  letters)." / "That chore is already on the list."
- Toggle row: "Vacation mode" — "Pauses your chores, keeps your streak".
- Sticky footer button: "Generate first week · {total} pts" (disabled when nothing is included).

**Default chores (points):** Deep clean bathroom 10, Deep clean kitchen 9, Clean fridge 7,
Mop floors 7, Sort recycling 6, Shared laundry 5, Wash dishes 5, Vacuum or sweep 4,
Kitchen surfaces 3, Balcony 3, General waste 2, Plants & living room 2.

### 6.4 Your first fair week — Step 3 of 3
- Title "Your first fair week 🧱", subtitle "{total} points split across 4 flatmates — about {round(total ÷ 4)} each."
- One card per person (You, Marta, Jordi, Aisha): navy initial avatar, name, comma list
  of their chores (or "Nothing this week"), "{n} pts" right-aligned in navy display bold.
- Sticky footer "Let's go!" → saves the week → App.

**Fair split rule:** sort chores by points, highest first; give each chore to whoever has
the fewest points so far (ties go to the earlier person in the list You, Marta, Jordi,
Aisha). Then spread each person's chores evenly across Mon–Sun, offsetting each person
by two days so the flat's busy days vary.

### 6.5 App shell (`/app`)
- **Header** (20 px sides, 24 px top): logo 40 px + stack of [flat name: 12 px uppercase
  rust, letter-spaced] over ["Brick by Brick": 20 px bold navy]. Right side: ochre pill
  with flame icon "6 wks" (streak; sample value) and a 12 px muted "Log out" link.
- Content column below with 16 px gaps; 112 px bottom padding so the nav never covers content.
- **Bottom nav (7 items):** My week (house icon) · House (building) · Approvals (double
  check) · Swaps (repeat arrows) · Leaderboard (trophy) · Chips (ticket) · Me (person).
- **Rate limit:** Done, Approve / Send back and swap actions allow 5 per minute; beyond
  that the toast says "Whoa, slow down! Try again in a minute."

### 6.6 My week (default tab)
- **Summary card:** progress ring (points done ÷ my total) beside: "{done}" in 30 px
  display bold with "/{total} pts" in 18 px muted; line "Today: {chore} 🧽" or "Nothing due
  today 😎"; ochre pill "Skip Pass active".
- Heading "This week", then my chores sorted Mon → Sun. Each card: chore name (semibold),
  "{pts} pts · {Today | Mon…Sun}". Today's unfinished chore gets a 2 px navy ring.
- Right side: primary pill **Done** → becomes green text "Waiting ✓" (sent for approval);
  approved chores show "Approved ✓✓". Toast: "Nice! Sent to your roommates for a thumbs up."
- No chores → card "No chores for you this week 🎉".

### 6.7 House
- Segmented control **Day** | **Whole week**.
- **Day:** a row of 7 day pills (flex, radius 20 px, 12 px semibold); selected = navy,
  others white; today's pill has " •" after the name. Opens on today. Then one card per
  person: coloured avatar, name, each chore as "🧱 {chore}" or "Day off 😎".
- **Whole week:** a white card holding a table — first column day names, one column per
  person (names in navy display font), cells list that day's chores or "—"; today's row
  has the blush background. Scrolls sideways inside the card if needed.

### 6.8 Approvals
- Heading "Waiting for your thumbs up". One card per request: "{name} finished {chore}",
  "{pts} pts · auto-approves in 48h", buttons **Approve** (green) and **Needs another
  pass** (neutral).
- Approve → card disappears, toast "+{pts} pts for {name}!".
- Needs another pass → the card expands: input "What needs another pass?" (max 140) and
  a rust **Send** button. Note rules: required ("Please add a short note"), ≤140
  ("Keep it under 140 characters"), no < or > ("Please avoid < and > characters").
  Send → card disappears, toast "Sent back to {name} with your note."
- Empty: centred card "All caught up! 🎉".

### 6.9 Swaps (sample data)
- Heading "Swaps & favors". Offer cards: "{name} offers: {chore}" / "{name} wants to
  trade: {chore}", "{pts} pts · expires in 24h", secondary **Take it**.
- Full-width primary **Propose a trade**. Both show toast "Offer posted! It expires in 24 hours."

### 6.10 Leaderboard (sample data)
- Segmented control with icons: **My flat** (people) | **Best roommate** (globe); opens on Best roommate.
- **My flat:** ochre winner card: "THIS WEEK'S WINNER" (12 px uppercase), "Marta 👑 21 pts"
  (24 px display bold), dark pill "Use Winner's Swap". Then rows ranked by points with
  subline "this week".
- **Best roommate:** intro (14 px muted): "Ranked by a fairness score: on-time chores,
  approvals given, and streak — not just raw points, so small flats compete fairly."
  Rows: name, "{flat} · {city} · 🔥{streak}", score. Footer (12 px muted, centred):
  "Only first names and flat nicknames are shown. You can hide yourself in settings."

### 6.11 Chips (sample data)
- Heading "Chips wallet". Ticket-style cards with a 2 px dashed ochre border:
  "🎟️ Skip Pass" / "Expires Sun 22 Nov" and "🎟️ Winner's Swap" / "Expires tonight",
  each with an ochre **Use chip** pill (not functional yet).

### 6.12 Me (profile)
- Heading "My profile".
- Avatar card: 80 px emoji avatar, then 8 choices as 36 px circles (🧱 🦊 🐼 🌵 🎧 🍕 🚲 🌻);
  selected has a navy ring.
- Card with labelled inputs: "Display name" (max 40) and "About me" (max 80).
- Card "Chores I prefer" / "We try to give you these first." with toggle chips:
  Deep clean bathroom, Wash dishes, Plants & living room, Shared laundry, Mop floors, Sort recycling.
- Toggle rows: "Vacation mode" (Pauses your chores, keeps your streak) · "Reminders"
  (A friendly nudge on chore day; on by default) · "Hide me from global leaderboard"
  (Your flat still sees your points).
- Card button with shield icon "Safety & privacy checklist" → Safety screen.
- Primary full-width **Save profile**. Edits are a draft until saved. Validation: name
  ≥2 letters ("Your name needs at least 2 letters."), no < or >; About me optional, same
  note rules as approvals. Toast "Profile saved! Looking sharp. ✨".
- Card: "Your chores and profile are saved on this device only, until real accounts
  arrive." + rust text button "Clear data on this device" → inline confirm with
  **Yes, clear it all** (rust) and **Keep it** (neutral). Yes wipes everything and returns to sign-in.

### 6.13 Safety checklist (from Me)
Heading "Safety checklist", then one card per item (title semibold, description 14 px muted):
input validation & sanitising; rate limits; security headers & HTTPS; XSS; no exposed API
keys; hashed passwords & session expiry (comes with real accounts); SQL injection, CORS,
CSRF (with real data); safe file upload (not needed: no photos); dependency scans & GDPR.

---

## 7. Data and state

Saved on the device (browser localStorage, keys prefixed `bxb.v1.`), validated when read
back so damaged data falls back to defaults:

| Key | Contents |
|---|---|
| `account` | `{ name, email }` (never the password) |
| `flat` | `{ name, code }` — default "Casa Eixample" / "K7B2XQ" |
| `setupChores` | `[{ n: name, p: points, on: included }]` |
| `week` | `[{ id, who, name, pts, day: Mon…Sun, status: todo | done | approved }]` |
| `approvals` | `[{ id, who, chore, pts }]` |
| `profile` | `{ name, bio, avatar, likes[], hidden, notify }` |
| `vacation` | `true | false` (shared by setup and profile) |

Flatmates (Marta, Jordi, Aisha), leaderboards, swaps, chips and the streak are sample data
until real accounts and a shared backend exist.

---

## 8. Accessibility and behaviour notes
- All icon-only buttons have labels ("Back", "Less", "More", "Remove {chore}", "Avatar 🦊",
  "Character 1…6", "Include {chore}").
- Everything people type is shown as plain text; < and > are rejected in free text.
- Toasts use `role="status"` so screen readers announce them.
- Touch targets: buttons at least 36 px tall; whole toggle rows are clickable.
