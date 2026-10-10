import { useCallback, useEffect, useState } from "react";
import Landing from "./components/Landing";
import QuoteApp from "./components/QuoteApp";
import SharedQuote from "./components/SharedQuote";
import Success from "./components/Success";
import { decodeShareHash } from "./lib/share";
import type { SharedPayload } from "./lib/share";

export type Route =
  | { name: "landing" }
  | { name: "app" }
  | { name: "success" }
  | { name: "shared"; payload: SharedPayload };

function parseRoute(): Route {
  // Share links always win: #q=<base64url>
  const shared = decodeShareHash(window.location.hash);
  if (shared) return { name: "shared", payload: shared };

  const hash = window.location.hash.replace(/^#/, "");
  // Support both `#/success` and a real `/success` path (hosts with SPA fallback).
  if (hash === "/success" || window.location.pathname === "/success") {
    return { name: "success" };
  }
  if (hash === "/app" || hash.startsWith("/app")) return { name: "app" };
  return { name: "landing" };
}

export function navigate(to: string): void {
  window.location.hash = to;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());

  const onHashChange = useCallback(() => setRoute(parseRoute()), []);

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [onHashChange]);

  // Scroll to top on route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name]);

  switch (route.name) {
    case "app":
      return <QuoteApp />;
    case "success":
      return <Success />;
    case "shared":
      return <SharedQuote payload={route.payload} />;
    default:
      return <Landing />;
  }
}
