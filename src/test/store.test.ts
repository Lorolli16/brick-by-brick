import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  DAYS,
  DEFAULT_FLAT,
  PEOPLE,
  clearAllStored,
  flatSchema,
  newJoinCode,
  readStored,
  splitWeek,
  useFlat,
  useWeek,
  writeStored,
} from "@/lib/store";

beforeEach(() => {
  window.localStorage.clear();
  clearAllStored();
});

describe("saved data", () => {
  it("returns the default when nothing is saved", () => {
    expect(readStored("flat", DEFAULT_FLAT, flatSchema)).toEqual(DEFAULT_FLAT);
  });

  it("round-trips a saved value", () => {
    writeStored("flat", { name: "Born Bunch", code: "ABC123" });
    expect(readStored("flat", DEFAULT_FLAT, flatSchema)).toEqual({
      name: "Born Bunch",
      code: "ABC123",
    });
  });

  it("ignores tampered or corrupt data", () => {
    window.localStorage.setItem(
      "bxb.v1.flat",
      JSON.stringify({ name: "<script>", code: "ABC123" }),
    );
    expect(readStored("flat", DEFAULT_FLAT, flatSchema)).toEqual(DEFAULT_FLAT);
    window.localStorage.setItem("bxb.v1.flat", "{not json");
    expect(readStored("flat", DEFAULT_FLAT, flatSchema)).toEqual(DEFAULT_FLAT);
  });

  it("hook updates and persists, shared between components", () => {
    const a = renderHook(() => useFlat());
    const b = renderHook(() => useFlat());
    act(() => a.result.current[1]({ name: "Raval Roomies", code: "ZZZ999" }));
    expect(b.result.current[0].name).toBe("Raval Roomies");
    expect(JSON.parse(window.localStorage.getItem("bxb.v1.flat")!).name).toBe("Raval Roomies");
  });

  it("hook supports updater functions", () => {
    const { result } = renderHook(() => useWeek());
    const id = result.current[0][0]!.id;
    act(() =>
      result.current[1]((w) => w.map((x) => (x.id === id ? { ...x, status: "done" as const } : x))),
    );
    expect(result.current[0].find((x) => x.id === id)?.status).toBe("done");
  });

  it("clearAllStored wipes only our keys", () => {
    window.localStorage.setItem("other-app", "keep");
    writeStored("flat", { name: "X flat", code: "ABC123" });
    clearAllStored();
    expect(window.localStorage.getItem("bxb.v1.flat")).toBeNull();
    expect(window.localStorage.getItem("other-app")).toBe("keep");
  });
});

describe("splitWeek", () => {
  const chores = [
    { n: "A", p: 10 },
    { n: "B", p: 9 },
    { n: "C", p: 7 },
    { n: "D", p: 7 },
    { n: "E", p: 6 },
    { n: "F", p: 5 },
    { n: "G", p: 5 },
    { n: "H", p: 4 },
    { n: "I", p: 3 },
    { n: "J", p: 3 },
    { n: "K", p: 2 },
    { n: "L", p: 2 },
  ];

  it("assigns every chore once, to a known person, on a real day", () => {
    const week = splitWeek(chores);
    expect(week.map((a) => a.name).sort()).toEqual(chores.map((c) => c.n).sort());
    week.forEach((a) => {
      expect(PEOPLE).toContain(a.who);
      expect(DAYS).toContain(a.day);
      expect(a.status).toBe("todo");
    });
    expect(new Set(week.map((a) => a.id)).size).toBe(week.length);
  });

  it("keeps everyone's points close", () => {
    const week = splitWeek(chores);
    const totals = PEOPLE.map((p) =>
      week.filter((a) => a.who === p).reduce((s, a) => s + a.pts, 0),
    );
    expect(Math.max(...totals) - Math.min(...totals)).toBeLessThanOrEqual(
      Math.max(...chores.map((c) => c.p)),
    );
  });

  it("handles no chores", () => {
    expect(splitWeek([])).toEqual([]);
  });
});

describe("newJoinCode", () => {
  it("makes 6-character codes the join screen accepts", () => {
    for (let i = 0; i < 50; i++) expect(newJoinCode()).toMatch(/^[A-Z0-9]{6}$/);
  });
});
