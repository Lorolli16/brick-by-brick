// Browser-only build of the app for sharing as a single static page (no server).
// The router keeps its location in memory, because the share host's URL can't carry
// app paths. People who already signed up on this device start on the main app.
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { accountSchema, readStored } from "@/lib/store";
import "@/styles.css";

// The root route renders <html>/<body> for server rendering; here we mount into a div.
(routeTree.options as { shellComponent?: (p: { children: ReactNode }) => ReactNode }).shellComponent =
  ({ children }) => children;

const start = readStored("account", null, accountSchema) ? "/app" : "/";
const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: [start] }),
  context: { queryClient: new QueryClient() },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
