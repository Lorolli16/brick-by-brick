import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { QrCode, KeyRound, Home, ArrowLeft, Camera } from "lucide-react";
import { joinCodeSchema } from "@/lib/safety";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join your flat — Brick by Brick" },
      { name: "description", content: "Scan your flat's QR code or enter its 6-character code to join your household on Brick by Brick." },
      { property: "og:title", content: "Join your flat — Brick by Brick" },
      { property: "og:description", content: "Scan a QR code or type a 6-character code to join your household." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Join,
});

const card = "rounded-2xl bg-card p-5 shadow-[var(--shadow-soft)]";
const btn = "w-full rounded-full py-3 text-sm font-semibold transition active:scale-95";

function Join() {
  const nav = useNavigate();
  const [view, setView] = useState<"pick" | "qr" | "code" | "create" | "found">("pick");
  const [chars, setChars] = useState(Array(6).fill(""));
  const [err, setErr] = useState("");
  const [tries, setTries] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setChar = (i: number, v: string) => {
    const clean = v.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (clean.length > 1) { // pasted full code
      const arr = clean.slice(0, 6).split("").concat(Array(6).fill("")).slice(0, 6);
      setChars(arr); refs.current[Math.min(clean.length, 5)]?.focus(); return;
    }
    const next = [...chars]; next[i] = clean; setChars(next);
    if (clean && i < 5) refs.current[i + 1]?.focus();
  };

  const submit = () => {
    if (tries >= 5) return setErr("Too many tries. Take a breather and try again in a few minutes.");
    const r = joinCodeSchema.safeParse(chars.join(""));
    setTries((t) => t + 1);
    if (!r.success) return setErr(r.error.issues[0]?.message ?? "");
    setErr(""); setView("found");
  };

  return (
    <div className="mx-auto min-h-screen max-w-md px-6 py-8">
      <div className="flex items-center gap-2">
        {view !== "pick" && <button onClick={() => setView("pick")} aria-label="Back" className="rounded-full bg-card p-2 shadow-[var(--shadow-soft)]"><ArrowLeft className="h-4 w-4" /></button>}
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Step 1 of 3</p>
      </div>

      {view === "pick" && (
        <>
          <h1 className="mt-3 text-3xl font-bold">Find your flat</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ask a flatmate for the invite, or start a new flat.</p>
          <div className="mt-6 space-y-3">
            <Option icon={QrCode} title="Scan QR code" sub="Point your camera at a flatmate's screen" onClick={() => setView("qr")} />
            <Option icon={KeyRound} title="Enter code" sub="6 letters or numbers, like K7B2XQ" onClick={() => setView("code")} />
            <Option icon={Home} title="Create a new flat" sub="Be the first and invite the others" onClick={() => setView("create")} accent />
          </div>
        </>
      )}

      {view === "qr" && (
        <>
          <h1 className="mt-3 text-2xl font-bold">Scan the flat's code</h1>
          <div className="relative mt-6 aspect-square overflow-hidden rounded-3xl bg-foreground">
            <div className="absolute inset-10 rounded-2xl border-4 border-dashed border-accent" />
            <div className="absolute inset-x-10 top-1/2 h-0.5 animate-pulse bg-primary" />
            <Camera className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-background/40" />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">We'll ask for camera access. Nothing is recorded.</p>
          <button onClick={() => setView("found")} className={`${btn} mt-4 bg-primary text-primary-foreground`}>Simulate scan (preview)</button>
          <button onClick={() => setView("code")} className="mt-3 w-full text-sm font-semibold text-primary">Type the code instead</button>
        </>
      )}

      {view === "code" && (
        <>
          <h1 className="mt-3 text-2xl font-bold">Enter your flat code</h1>
          <p className="mt-1 text-sm text-muted-foreground">Find it in a flatmate's app under Flat → Invite.</p>
          <div className="mt-6 flex justify-between gap-2">
            {chars.map((c, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }} value={c} inputMode="text" autoCapitalize="characters" aria-label={`Character ${i + 1}`}
                onChange={(e) => setChar(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !c && i > 0) refs.current[i - 1]?.focus(); if (e.key === "Enter") submit(); }}
                className="h-14 w-12 rounded-xl border-2 bg-card text-center font-display text-2xl font-bold uppercase outline-none focus:border-primary" />
            ))}
          </div>
          {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
          <button onClick={submit} className={`${btn} mt-6 bg-primary text-primary-foreground`}>Join flat</button>
        </>
      )}

      {view === "create" && <CreateFlat onDone={() => nav({ to: "/setup" })} />}

      {view === "found" && (
        <div className={`${card} mt-8 text-center`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl">🏠</div>
          <h2 className="mt-3 text-2xl font-bold">Casa Eixample</h2>
          <p className="text-sm text-muted-foreground">Marta, Jordi and Aisha are waiting for you</p>
          <div className="mt-4 flex justify-center -space-x-2">
            {["M", "J", "A"].map((l) => <span key={l} className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-primary font-semibold text-primary-foreground">{l}</span>)}
          </div>
          <Link to="/setup" className={`${btn} mt-6 block bg-primary text-primary-foreground`}>Join Casa Eixample</Link>
        </div>
      )}
    </div>
  );
}

function Option({ icon: Icon, title, sub, onClick, accent }: { icon: typeof QrCode; title: string; sub: string; onClick: () => void; accent?: boolean }) {
  return (
    <button onClick={onClick} className={`${card} flex w-full items-center gap-4 text-left transition active:scale-[0.98]`}>
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}><Icon className="h-6 w-6" /></span>
      <span><span className="block font-semibold">{title}</span><span className="text-xs text-muted-foreground">{sub}</span></span>
    </button>
  );
}

function CreateFlat({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const code = "K7B2XQ";
  return (
    <>
      <h1 className="mt-3 text-2xl font-bold">Name your flat</h1>
      <input value={name} maxLength={30} onChange={(e) => setName(e.target.value)} placeholder="e.g. Casa Eixample" className="mt-4 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
      {name.trim() && (
        <div className={`${card} mt-5 text-center`}>
          <p className="text-sm text-muted-foreground">Share this with your flatmates</p>
          <QrPattern />
          <p className="font-display text-3xl font-bold tracking-[0.3em] text-primary">{code}</p>
          <p className="mt-1 text-xs text-muted-foreground">Code expires in 7 days</p>
        </div>
      )}
      <button disabled={!name.trim()} onClick={onDone} className={`${btn} mt-5 bg-primary text-primary-foreground disabled:opacity-40`}>Continue</button>
    </>
  );
}

function QrPattern() {
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 37 + (i % 7) * 13) % 5) < 2);
  return (
    <div className="mx-auto my-4 grid w-40 grid-cols-11 gap-0.5" aria-label="QR code">
      {cells.map((on, i) => <div key={i} className={`aspect-square rounded-[2px] ${on ? "bg-foreground" : "bg-muted"}`} />)}
    </div>
  );
}
