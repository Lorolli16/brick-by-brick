import { useCallback, useRef, useSyncExternalStore } from "react";
import { z } from "zod";

/**
 * On-device saved data (browser localStorage) until real accounts arrive.
 *
 * - Every value is checked against a zod schema when read back, so hand-edited or
 *   outdated data falls back to defaults instead of crashing the app.
 * - The server render always uses the defaults; the browser swaps in saved data right
 *   after hydration (useSyncExternalStore), so there are no hydration mismatches.
 * - If storage is blocked (private mode, disabled cookies) values live in memory for
 *   the current page instead.
 * - Passwords are never stored.
 */

const PREFIX = "bxb.v1.";
const memory = new Map<string, string>();
const cache = new Map<string, { raw: string | null; value: unknown }>();
const listeners = new Set<() => void>();

function getRaw(key: string): string | null {
  try {
    const v = window.localStorage.getItem(PREFIX + key);
    if (v !== null) return v;
  } catch {
    /* storage blocked: fall through to memory */
  }
  return memory.get(key) ?? null;
}

function notify() {
  listeners.forEach((l) => l());
}

export function readStored<T>(key: string, fallback: T, schema: z.ZodType<T>): T {
  const raw = getRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value = fallback;
  if (raw !== null) {
    try {
      const parsed = schema.safeParse(JSON.parse(raw));
      if (parsed.success) value = parsed.data;
    } catch {
      /* corrupt JSON: use fallback */
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function writeStored<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try {
    window.localStorage.setItem(PREFIX + key, raw);
  } catch {
    /* storage blocked or full: memory copy still works for this page */
  }
  cache.set(key, { raw, value });
  notify();
}

export function removeStored(key: string) {
  memory.delete(key);
  cache.delete(key);
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
  notify();
}

/** Wipes everything Brick by Brick saved on this device. */
export function clearAllStored() {
  memory.clear();
  cache.clear();
  try {
    const ls = window.localStorage;
    Object.keys(ls)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => ls.removeItem(k));
  } catch {
    /* ignore */
  }
  notify();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key.startsWith(PREFIX)) cb(); // another tab changed our data
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Like useState, but saved on this device under `key`. */
export function useStored<T>(key: string, fallback: T, schema: z.ZodType<T>) {
  const initial = useRef(fallback).current; // stable default for server + first render
  const value = useSyncExternalStore(
    subscribe,
    () => readStored(key, initial, schema),
    () => initial,
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStored(key, initial, schema);
      writeStored(key, typeof next === "function" ? (next as (p: T) => T)(prev) : next);
    },
    [key, initial, schema],
  );
  return [value, set] as const;
}

// ---------------------------------------------------------------------------
// The app's saved data
// ---------------------------------------------------------------------------

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];
export const todayName = (d = new Date()): Day => DAYS[(d.getDay() + 6) % 7]!;

export const ME = "You";
export const FLATMATES = ["Marta", "Jordi", "Aisha"]; // placeholders until real accounts
export const PEOPLE = [ME, ...FLATMATES];

const text = (max: number) =>
  z
    .string()
    .max(max)
    .refine((v) => !/[<>]/.test(v));

export const accountSchema = z
  .object({ name: text(40), email: z.string().email().max(255) })
  .nullable();
export type Account = z.infer<typeof accountSchema>;

export const flatSchema = z.object({ name: text(30), code: z.string().regex(/^[A-Z0-9]{6}$/) });
export type Flat = z.infer<typeof flatSchema>;
export const DEFAULT_FLAT: Flat = { name: "Casa Eixample", code: "K7B2XQ" };

export const setupChoreSchema = z.object({
  n: text(40).pipe(z.string().min(2)),
  p: z.number().int().min(1).max(10),
  on: z.boolean(),
});
export const setupChoresSchema = z.array(setupChoreSchema).max(60);
export type SetupChore = z.infer<typeof setupChoreSchema>;
export const DEFAULT_SETUP_CHORES: SetupChore[] = (
  [
    ["Deep clean bathroom", 10],
    ["Deep clean kitchen", 9],
    ["Clean fridge", 7],
    ["Mop floors", 7],
    ["Sort recycling", 6],
    ["Shared laundry", 5],
    ["Wash dishes", 5],
    ["Vacuum or sweep", 4],
    ["Kitchen surfaces", 3],
    ["Balcony", 3],
    ["General waste", 2],
    ["Plants & living room", 2],
  ] as const
).map(([n, p]) => ({ n, p, on: true }));

export const assignmentSchema = z.object({
  id: z.number().int(),
  who: text(40),
  name: text(40),
  pts: z.number().int().min(1).max(10),
  day: z.enum(DAYS),
  status: z.enum(["todo", "done", "approved"]),
});
export const weekSchema = z.array(assignmentSchema).max(200);
export type Assignment = z.infer<typeof assignmentSchema>;

/**
 * Fair split: hand the biggest chores out first, always to whoever has the fewest
 * points so far, then spread each person's chores across the week.
 */
export function splitWeek(
  chores: { n: string; p: number }[],
  people: string[] = PEOPLE,
): Assignment[] {
  const totals = new Map(people.map((p) => [p, 0]));
  const byPerson = new Map<string, { n: string; p: number }[]>(people.map((p) => [p, []]));
  [...chores]
    .sort((a, b) => b.p - a.p)
    .forEach((c) => {
      const who = people.reduce(
        (best, p) => (totals.get(p)! < totals.get(best)! ? p : best),
        people[0]!,
      );
      totals.set(who, totals.get(who)! + c.p);
      byPerson.get(who)!.push(c);
    });
  let id = 1;
  return people.flatMap((who, pi) => {
    const list = byPerson.get(who)!;
    return list.map((c, i) => ({
      id: id++,
      who,
      name: c.n,
      pts: c.p,
      // spread evenly across the 7 days, offset per person so the flat's load varies by day
      day: DAYS[(Math.floor((i * 7) / Math.max(list.length, 1)) + pi * 2) % 7]!,
      status: "todo" as const,
    }));
  });
}

export const DEFAULT_WEEK: Assignment[] = splitWeek(DEFAULT_SETUP_CHORES);

export const approvalSchema = z.object({
  id: z.number().int(),
  who: text(40),
  chore: text(60),
  pts: z.number().int().min(1).max(10),
});
export const approvalsSchema = z.array(approvalSchema).max(100);
export type Approval = z.infer<typeof approvalSchema>;
export const DEFAULT_APPROVALS: Approval[] = [
  { id: 1, who: "Marta", chore: "Mop floors (whole flat)", pts: 7 },
  { id: 2, who: "Jordi", chore: "Wash dishes (big load)", pts: 5 },
];

export const profileSchema = z.object({
  name: text(40),
  bio: text(140),
  avatar: z.string().max(8),
  likes: z.array(text(40)).max(20),
  hidden: z.boolean(),
  notify: z.boolean(),
});
export type Profile = z.infer<typeof profileSchema>;
export const DEFAULT_PROFILE: Profile = {
  name: "",
  bio: "",
  avatar: "🧱",
  likes: [],
  hidden: false,
  notify: true,
};

export const boolSchema = z.boolean();

/** Six-character join code from the browser's secure random generator (no look-alike 0/O, 1/I). */
export function newJoinCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const useAccount = () => useStored<Account>("account", null, accountSchema);
export const useFlat = () => useStored<Flat>("flat", DEFAULT_FLAT, flatSchema);
export const useSetupChores = () =>
  useStored("setupChores", DEFAULT_SETUP_CHORES, setupChoresSchema);
export const useWeek = () => useStored("week", DEFAULT_WEEK, weekSchema);
export const useApprovals = () => useStored("approvals", DEFAULT_APPROVALS, approvalsSchema);
export const useProfile = () => useStored("profile", DEFAULT_PROFILE, profileSchema);
export const useVacation = () => useStored("vacation", false, boolSchema);
