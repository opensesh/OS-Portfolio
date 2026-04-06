"use client";

import { useState, useEffect } from "react";

// Module-level flag survives component mount/unmount cycles so that
// components remounting after client-side navigation immediately know
// the loader has already exited (the event only fires once).
let hasExited = false;

/**
 * Returns `true` once the PageLoader has exited.
 * Listens for the custom "page-loader-exit" event dispatched by PageLoader.
 */
export function usePageLoaded(): boolean {
  const [loaded, setLoaded] = useState(hasExited);

  useEffect(() => {
    if (hasExited) {
      setLoaded(true);
      return;
    }
    const handler = () => {
      hasExited = true;
      setLoaded(true);
    };
    window.addEventListener("page-loader-exit", handler);
    return () => window.removeEventListener("page-loader-exit", handler);
  }, []);

  return loaded;
}
