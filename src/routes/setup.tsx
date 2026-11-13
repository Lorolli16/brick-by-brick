import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Set up chores — Brick by Brick" },
      { name: "description", content: "Confirm your flat's chores and effort points, then generate your first fair week." },
      { property: "og:title", content: "Set up chores — Brick by Brick" },
      { property: "og:description", content: "Tune chore points together and generate the first fair week." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Setup,
});

const seed = [
  ["Deep clean bathroom", 10], ["Deep clean kitchen", 9], ["Clean fridge", 7], ["Mop floors", 7],
  ["Sort recycling", 6], ["Shared laundry", 5], ["Wash dishes", 5], ["Vacuum or sweep", 4],
  ["Kitchen surfaces", 3], ["Balcony", 3], ["General waste", 2], ["Plants & living room", 2],
] as const;

function Setup() {
  const [step, setStep] = useState<2 | 3>(2);
  const [chores, setChores] = useState(seed.map(([n, p]) => ({ n, p: p as number, on: true })));
  const [away, setAway] = useState(false);
  const total = chores.filter((c) => c.on).reduce((s, c) => s + c.p, 0);
  const people = 4;
  const bump = (i: number, d: number) => setChores((c) => c.map((x, j) => (j === i ? { ...x, p: Math.min(10, Math.max(1, x.p + d)) } : x)));

  return (
    <div className="mx-auto min-h-screen max-w-md px-6 py-8 pb-32">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Step {step} of 3</p>
      {step === 2 ? (
        <>
          <h1 className="mt-3 text-2xl font-bold">Confirm chores & points</h1>
          <p className="mt-1 text-sm text-muted-foreground">Points = effort. Agree on them together.</p>
          <div className="mt-5 space-y-2">
            {chores.map((c, i) => (
              <div key={c.n} className={`flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)] ${c.on ? "" : "opacity-40"}`}>
                <input type="checkbox" checked={c.on} onChange={() => setChores((x) => x.map((y, j) => (j === i ? { ...y, on: !y.on } : y)))} className="h-4 w-4 accent-[var(--primary)]" aria-label={`Include ${c.n}`} />
                <span className="flex-1 text-sm font-medium">{c.n}</span>
                <button onClick={() => bump(i, -1)} aria-label="Less" className="rounded-full bg-muted p-1"><Minus className="h-3 w-3" /></button>
                <span className="w-6 text-center font-display font-bold text-primary">{c.p}</span>
                <button onClick={() => bump(i, 1)} aria-label="More" className="rounded-full bg-muted p-1"><Plus className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
          <label className="mt-5 flex items-center justify-between rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
            <span><span className="block font-semibold">Vacation mode</span><span className="text-xs text-muted-foreground">Pauses your chores, keeps your streak</span></span>
            <input type="checkbox" checked={away} onChange={() => setAway(!away)} className="h-5 w-5 accent-[var(--primary)]" />
          </label>
        </>
      ) : (
        <>
          <h1 className="mt-3 text-2xl font-bold">Your first fair week 🧱</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} points split across {people} flatmates — about {Math.round(total / people)} each.</p>
          <div className="mt-5 space-y-3">
            {[["You", "Bathroom, Plants", 12], ["Marta", "Kitchen, Waste", 11], ["Jordi", "Fridge, Laundry", 12], ["Aisha", "Floors, Surfaces", 10]].map(([n, c, p]) => (
              <div key={n as string} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{(n as string)[0]}</span>
                <span className="flex-1"><span className="block font-semibold">{n}</span><span className="text-xs text-muted-foreground">{c}</span></span>
                <span className="font-display font-bold text-primary">{p} pts</span>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md bg-background px-6 py-4">
        {step === 2
          ? <button onClick={() => setStep(3)} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">Generate first week · {total} pts</button>
          : <Link to="/app" className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">Let's go!</Link>}
      </div>
    </div>
  );
}
