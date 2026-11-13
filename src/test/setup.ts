import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Node 25+ ships its own experimental localStorage/sessionStorage globals, which hide
// jsdom's working ones in tests. Put jsdom's back.
declare const jsdom: { window: Window } | undefined;
if (typeof jsdom !== "undefined") {
  for (const k of ["localStorage", "sessionStorage"] as const) {
    Object.defineProperty(globalThis, k, { configurable: true, value: jsdom.window[k] });
  }
}
