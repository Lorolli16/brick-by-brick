import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PEOPLE, splitWeek, useSetupChores, useVacation, useWeek } from "@/lib/store";

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

function Setup() {
  const [step, setStep] = useState<2 | 3>(2);
  const [chores, setChores] = useSetupChores();
  const [away, setAway] = useVacation();
  const [, setWeek] = useWeek();
  const week = useMemo(() => splitWeek(chores.filter((c) => c.on)), [chores]);
  const [newName, setNewName] = useState("");
  const [newPts, setNewPts] = useState(3);
  const [addErr, setAddErr] = useState("");
  const addChore = () => {
    const n = newName.trim().replace(/[<>]/g, "");
    if (n.length < 2) return setAddErr("Give the chore a name (2+ letters).");
    if (chores.some((c) => c.n.toLowerCase() === n.toLowerCase())) return setAddErr("That chore is already on the list.");
    setChores((c) => [...c, { n, p: newPts, on: true }]); setNewName(""); setNewPts(3); setAddErr("");
  };
  const total = chores.filter((c) => c.on).reduce((s, c) => s + c.p, 0);
  const people = PEOPLE.length;
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
                <button onClick={() => setChores((x) => x.filter((_, j) => j !== i))} aria-label={`Remove ${c.n}`} className="rounded-full p-1 text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border-2 border-dashed bg-card p-3">
            <p className="text-sm font-semibold">Add a chore your flat has</p>
            <div className="mt-2 flex items-center gap-2">
              <input value={newName} maxLength={40} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChore()} placeholder="e.g. Clean the terrace" className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm" />
              <button onClick={() => setNewPts((v) => Math.max(1, v - 1))} aria-label="Fewer points" className="rounded-full bg-muted p-1"><Minus className="h-3 w-3" /></button>
              <span className="w-5 text-center font-display font-bold text-primary">{newPts}</span>
              <button onClick={() => setNewPts((v) => Math.min(10, v + 1))} aria-label="More points" className="rounded-full bg-muted p-1"><Plus className="h-3 w-3" /></button>
            </div>
            {addErr && <p className="mt-1 text-xs text-destructive">{addErr}</p>}
            <button onClick={addChore} className="mt-2 w-full rounded-full bg-secondary py-2 text-sm font-semibold text-secondary-foreground">+ Add chore</button>
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
            {PEOPLE.map((n) => {
              const mine = week.filter((a) => a.who === n);
              return (
                <div key={n} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">{n[0]}</span>
                  <span className="flex-1"><span className="block font-semibold">{n}</span><span className="text-xs text-muted-foreground">{mine.map((a) => a.name).join(", ") || "Nothing this week"}</span></span>
                  <span className="font-display font-bold text-primary">{mine.reduce((s, a) => s + a.pts, 0)} pts</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md bg-background px-6 py-4">
        {step === 2
          ? <button onClick={() => setStep(3)} disabled={total === 0} className="disabled:opacity-40 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground">Generate first week · {total} pts</button>
          : <Link to="/app" onClick={() => setWeek(week)} className="block w-full rounded-full bg-primary py-3 text-center text-sm font-semibold text-primary-foreground">Let's go!</Link>}
      </div>
    </div>
  );
}
