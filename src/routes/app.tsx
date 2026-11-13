import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Home, CheckCheck, Repeat, Trophy, Ticket, ShieldCheck, Flame, Globe, Users } from "lucide-react";
import { commentSchema, createRateLimiter } from "@/lib/safety";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Brick by Brick — fair chores for shared flats" },
      { name: "description", content: "Split flat chores fairly, approve each other's work and climb the best roommate leaderboard." },
      { property: "og:title", content: "Brick by Brick" },
      { property: "og:description", content: "Fair chores for shared flats, with streaks, swaps and a global best roommate leaderboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

type Chore = { id: number; name: string; pts: number; due: string; note?: string; status: "todo" | "done" | "approved" };
const initialChores: Chore[] = [
  { id: 1, name: "Deep clean bathroom", pts: 10, due: "Today", note: "Limescale: use vinegar", status: "todo" },
  { id: 2, name: "Sort and take out recycling", pts: 6, due: "Wed", status: "todo" },
  { id: 3, name: "Water plants & tidy living room", pts: 2, due: "Fri", status: "approved" },
];
const approvalsSeed = [
  { id: 1, who: "Marta", chore: "Mop floors (whole flat)", pts: 7 },
  { id: 2, who: "Jordi", chore: "Wash dishes (big load)", pts: 5 },
];
const flat = [
  { name: "Marta", pts: 21 }, { name: "You", pts: 18 }, { name: "Jordi", pts: 15 }, { name: "Aisha", pts: 12 },
];
const global = [
  { name: "Lucía R.", flat: "Gràcia Gang", city: "Barcelona", score: 98, streak: 14 },
  { name: "Tom B.", flat: "Raval Roomies", city: "Barcelona", score: 95, streak: 11 },
  { name: "Marta S.", flat: "Casa Eixample", city: "Barcelona", score: 93, streak: 9 },
  { name: "Ines K.", flat: "Lavapiés Crew", city: "Madrid", score: 91, streak: 12 },
  { name: "You", flat: "Casa Eixample", city: "Barcelona", score: 88, streak: 6 },
  { name: "Pau M.", flat: "Born Bunch", city: "Barcelona", score: 86, streak: 7 },
];

const tabs = [
  { id: "home", label: "My week", icon: Home },
  { id: "approve", label: "Approvals", icon: CheckCheck },
  { id: "swap", label: "Swaps", icon: Repeat },
  { id: "board", label: "Leaderboard", icon: Trophy },
  { id: "chips", label: "Chips", icon: Ticket },
  { id: "safety", label: "Safety", icon: ShieldCheck },
] as const;
type Tab = (typeof tabs)[number]["id"];

const card = "rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]";
const btn = "rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95";

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [chores, setChores] = useState(initialChores);
  const [approvals, setApprovals] = useState(approvalsSeed);
  const [toast, setToast] = useState("");
  const limiter = useMemo(() => createRateLimiter(5, 60000), []);
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const guarded = (fn: () => void) => () => (limiter() ? fn() : say("Whoa, slow down! Try again in a minute."));

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-28">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Casa Eixample</p>
          <h1 className="text-2xl font-bold">Brick by Brick</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
          <Flame className="h-4 w-4" /> 6 wks
        </div>
        <Link to="/" className="ml-2 text-xs font-semibold text-muted-foreground">Log out</Link>
      </header>
      <main className="space-y-4 px-5 pt-2">
        {tab === "home" && <HomeTab chores={chores} onDone={(id) => guarded(() => { setChores((c) => c.map((x) => (x.id === id ? { ...x, status: "done" } : x))); say("Nice! Sent to your roommates for a thumbs up."); })()} />}
        {tab === "approve" && <ApproveTab items={approvals} onResolve={(id, msg) => guarded(() => { setApprovals((a) => a.filter((x) => x.id !== id)); say(msg); })()} />}
        {tab === "swap" && <SwapTab onOffer={() => guarded(() => say("Offer posted! It expires in 24 hours."))()} />}
        {tab === "board" && <BoardTab />}
        {tab === "chips" && <ChipsTab />}
        {tab === "safety" && <SafetyTab />}
      </main>
      {toast && <div role="status" className="fixed inset-x-5 bottom-24 mx-auto max-w-sm rounded-xl bg-foreground px-4 py-3 text-center text-sm text-background">{toast}</div>}
      <nav className="fixed inset-x-0 bottom-0 mx-auto flex max-w-md justify-around border-t bg-card py-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 px-1 text-[11px] ${tab === t.id ? "text-primary" : "text-muted-foreground"}`}>
            <t.icon className="h-5 w-5" />{t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function HomeTab({ chores, onDone }: { chores: Chore[]; onDone: (id: number) => void }) {
  const total = chores.reduce((s, c) => s + c.pts, 0);
  const done = chores.filter((c) => c.status !== "todo").reduce((s, c) => s + c.pts, 0);
  const pct = done / total;
  return (
    <>
      <div className={`${card} flex items-center gap-5`}>
        <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
          <circle cx="50" cy="50" r="42" className="fill-none stroke-muted" strokeWidth="10" />
          <circle cx="50" cy="50" r="42" className="fill-none stroke-primary transition-all" strokeWidth="10" strokeLinecap="round" strokeDasharray={264} strokeDashoffset={264 * (1 - pct)} />
        </svg>
        <div>
          <p className="font-display text-3xl font-bold">{done}<span className="text-lg text-muted-foreground">/{total} pts</span></p>
          <p className="text-sm text-muted-foreground">Your turn: bathroom day! 🛁</p>
          <p className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">Skip Pass active</p>
        </div>
      </div>
      <h2 className="pt-2 text-lg font-semibold">This week</h2>
      {chores.map((c) => (
        <div key={c.id} className={`${card} flex items-center justify-between ${c.due === "Today" && c.status === "todo" ? "ring-2 ring-primary" : ""}`}>
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.pts} pts · {c.due}{c.note ? ` · ${c.note}` : ""}</p>
          </div>
          {c.status === "todo" ? (
            <button onClick={() => onDone(c.id)} className={`${btn} bg-primary text-primary-foreground`}>Done</button>
          ) : (
            <span className="text-xs font-semibold text-success">{c.status === "done" ? "Waiting ✓" : "Approved ✓✓"}</span>
          )}
        </div>
      ))}
    </>
  );
}

function ApproveTab({ items, onResolve }: { items: typeof approvalsSeed; onResolve: (id: number, msg: string) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  if (!items.length) return <p className={`${card} text-center text-muted-foreground`}>All caught up! 🎉</p>;
  return (
    <>
      <h2 className="text-lg font-semibold">Waiting for your thumbs up</h2>
      {items.map((a) => (
        <div key={a.id} className={card}>
          <p className="font-semibold">{a.who} finished {a.chore}</p>
          <p className="text-xs text-muted-foreground">{a.pts} pts · auto-approves in 48h</p>
          {open === a.id ? (
            <div className="mt-3 space-y-2">
              <input maxLength={140} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What needs another pass?" className="w-full rounded-xl border bg-background px-3 py-2 text-sm" />
              {err && <p className="text-xs text-destructive">{err}</p>}
              <button className={`${btn} bg-destructive text-destructive-foreground`} onClick={() => {
                const r = commentSchema.safeParse(note);
                if (!r.success) return setErr(r.error.issues[0]?.message ?? "Invalid note");
                setErr(""); setNote(""); setOpen(null); onResolve(a.id, `Sent back to ${a.who} with your note.`);
              }}>Send</button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <button onClick={() => onResolve(a.id, `+${a.pts} pts for ${a.who}!`)} className={`${btn} bg-success text-success-foreground`}>Approve</button>
              <button onClick={() => setOpen(a.id)} className={`${btn} bg-muted text-foreground`}>Needs another pass</button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function SwapTab({ onOffer }: { onOffer: () => void }) {
  const offers = [
    { who: "Marta", what: "Take out recycling", pts: 6, kind: "Offers" },
    { who: "Jordi", what: "Vacuum or sweep", pts: 4, kind: "Wants to trade" },
  ];
  return (
    <>
      <h2 className="text-lg font-semibold">Swaps & favors</h2>
      {offers.map((o) => (
        <div key={o.what} className={`${card} flex items-center justify-between`}>
          <div><p className="font-semibold">{o.who} {o.kind.toLowerCase()}: {o.what}</p><p className="text-xs text-muted-foreground">{o.pts} pts · expires in 24h</p></div>
          <button onClick={onOffer} className={`${btn} bg-secondary text-secondary-foreground`}>Take it</button>
        </div>
      ))}
      <button onClick={onOffer} className={`${btn} w-full bg-primary py-3 text-primary-foreground`}>Propose a trade</button>
    </>
  );
}

function BoardTab() {
  const [scope, setScope] = useState<"flat" | "global">("global");
  return (
    <>
      <div className="flex rounded-full bg-muted p-1">
        {(["flat", "global"] as const).map((s) => (
          <button key={s} onClick={() => setScope(s)} className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 text-sm font-semibold ${scope === s ? "bg-card text-primary shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}>
            {s === "flat" ? <Users className="h-4 w-4" /> : <Globe className="h-4 w-4" />}{s === "flat" ? "My flat" : "Best roommate"}
          </button>
        ))}
      </div>
      {scope === "flat" ? (
        <>
          <div className={`${card} bg-accent text-accent-foreground`}>
            <p className="text-xs font-semibold uppercase">This week's winner</p>
            <p className="font-display text-2xl font-bold">Marta 👑 21 pts</p>
            <button className={`${btn} mt-2 bg-foreground text-background`}>Use Winner's Swap</button>
          </div>
          {flat.map((p, i) => <Row key={p.name} rank={i + 1} name={p.name} sub="this week" value={`${p.pts} pts`} me={p.name === "You"} />)}
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Ranked by a fairness score: on-time chores, approvals given, and streak — not just raw points, so small flats compete fairly.</p>
          {global.map((p, i) => <Row key={p.name} rank={i + 1} name={p.name} sub={`${p.flat} · ${p.city} · 🔥${p.streak}`} value={`${p.score}`} me={p.name === "You"} />)}
          <p className="text-center text-xs text-muted-foreground">Only first names and flat nicknames are shown. You can hide yourself in settings.</p>
        </>
      )}
    </>
  );
}

function Row({ rank, name, sub, value, me }: { rank: number; name: string; sub: string; value: string; me?: boolean }) {
  const medal = ["🥇", "🥈", "🥉"][rank - 1];
  return (
    <div className={`${card} flex items-center gap-3 ${me ? "ring-2 ring-primary" : ""}`}>
      <span className="w-8 text-center font-display text-lg font-bold">{medal ?? rank}</span>
      <div className="flex-1"><p className="font-semibold">{name}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
      <span className="font-display text-lg font-bold text-primary">{value}</span>
    </div>
  );
}

function ChipsTab() {
  return (
    <>
      <h2 className="text-lg font-semibold">Chips wallet</h2>
      {[{ n: "Skip Pass", e: "Expires Sun 22 Nov" }, { n: "Winner's Swap", e: "Expires tonight" }].map((c) => (
        <div key={c.n} className={`${card} flex items-center justify-between border-2 border-dashed border-accent`}>
          <div><p className="font-display text-lg font-bold">🎟️ {c.n}</p><p className="text-xs text-muted-foreground">{c.e}</p></div>
          <button className={`${btn} bg-accent text-accent-foreground`}>Use chip</button>
        </div>
      ))}
    </>
  );
}

function SafetyTab() {
  const items: [string, string][] = [
    ["Input validation & sanitising", "Notes are checked for length and blocked from containing code. Live in this preview."],
    ["Rate limits", "Max 5 actions a minute per person. Live in this preview."],
    ["Security headers & HTTPS everywhere", "Every page is sent with protective browser headers over HTTPS. Live."],
    ["XSS attacks", "Everything people type is shown as plain text, never run as code. Live."],
    ["No exposed API keys / .env / rotating secrets", "No keys are in the app. Secrets will live only on the server."],
    ["Hashed passwords & session expiry", "Comes with real accounts (next step)."],
    ["SQL injection, CORS, CSRF", "Handled by the database's access rules when real data is added (next step)."],
    ["Safe file upload", "Not needed: the blueprint rules out photos."],
    ["Scan dependencies & compliance", "Run a security scan before publishing; GDPR applies for EU flats."],
  ];
  return (
    <>
      <h2 className="text-lg font-semibold">Safety checklist</h2>
      {items.map(([t, d]) => (
        <div key={t} className={card}><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
      ))}
    </>
  );
}
