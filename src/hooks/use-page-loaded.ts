"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` once the PageLoader has exited.
 * Listens for the custom "page-loader-exit" event dispatched by PageLoader.
 */
export function usePageLoaded(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handler = () => setLoaded(true);
    window.addEventListener("page-loader-exit", handler);
    return () => window.removeEventListener("page-loader-exit", handler);
  }, []);

  return loaded;
}
