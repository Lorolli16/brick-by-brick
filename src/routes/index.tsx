import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/brick_by_brick_logo.png.asset.json";
import { emailSchema, passwordSchema } from "@/lib/safety";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brick by Brick — sign in" },
      { name: "description", content: "Sign in or create your Brick by Brick account to share chores fairly with your flatmates." },
      { property: "og:title", content: "Brick by Brick" },
      { property: "og:description", content: "Fair chores for shared flats, brick by brick." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Auth,
});

const field = "w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary";
const btn = "w-full rounded-full py-3 text-sm font-semibold transition active:scale-95";

function Bricks() {
  return <img src={logo.url} alt="Brick by Brick logo" className="mx-auto h-24 w-24 rounded-3xl shadow-[var(--shadow-soft)]" />;
}

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "up" && !name.trim()) return setErr("What should your flatmates call you?");
    const e1 = emailSchema.safeParse(email); if (!e1.success) return setErr(e1.error.issues[0]?.message ?? "");
    const p1 = passwordSchema.safeParse(pw); if (!p1.success) return setErr(p1.error.issues[0]?.message ?? "");
    setErr("");
    nav({ to: mode === "up" ? "/join" : "/app" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
      <Bricks />
      <h1 className="mt-5 text-center text-3xl font-bold">Brick by Brick</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">A fair flat, one chore at a time.</p>

      <div className="mt-8 flex rounded-full bg-muted p-1">
        {(["up", "in"] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); setErr(""); }} className={`flex-1 rounded-full py-2 text-sm font-semibold ${mode === m ? "bg-card text-primary shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}>
            {m === "up" ? "Sign up" : "Log in"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "up" && <input className={field} placeholder="First name" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />}
        <input className={field} type="email" placeholder="Email" autoComplete="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={field} type="password" placeholder="Password (8+ characters)" autoComplete={mode === "up" ? "new-password" : "current-password"} maxLength={72} value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        {mode === "in" && <button type="button" className="text-xs font-semibold text-primary">Forgot password?</button>}
        <button className={`${btn} bg-primary text-primary-foreground`}>{mode === "up" ? "Create account" : "Log in"}</button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>
      <button type="button" onClick={() => nav({ to: mode === "up" ? "/join" : "/app" })} className={`${btn} border bg-card text-foreground`}>Continue with Google</button>
      <p className="mt-6 text-center text-xs text-muted-foreground">By continuing you agree to the house rules: be kind, do your bit. 🧱</p>
    </div>
  );
}
