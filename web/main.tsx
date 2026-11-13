// Browser-only (static) build of the app, for static hosts such as GitHub Pages.
// The full app (`npm run dev` / `npm run build`) uses TanStack Start with server rendering;
// this entry renders the same routes entirely in the browser, under the site's base path.
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createBrowserHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { accountSchema, readStored } from "@/lib/store";
import "@/styles.css";

// The root route renders <html>/<body> for server rendering; here we mount into a div.
(
  routeTree.options as { shellComponent?: (p: { children: ReactNode }) => ReactNode }
).shellComponent = ({ children }) => children;

const basepath = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

// GitHub Pages has no app-wide fallback: deep links are served by 404.html, which is a
// copy of this page, so the router still sees the real path. Signed-up people who
// open the site root go straight to their flat.
const history = createBrowserHistory();
const atRoot = history.location.pathname.replace(/\/$/, "") === basepath.replace(/\/$/, "");
if (atRoot && readStored("account", null, accountSchema))
  history.replace(`${basepath === "/" ? "" : basepath}/app`);

const router = createRouter({
  routeTree,
  history,
  basepath,
  context: { queryClient: new QueryClient() },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
