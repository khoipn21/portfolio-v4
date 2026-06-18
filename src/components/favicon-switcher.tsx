"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

// Per-theme favicon hrefs (PNG 32x32 for crisp rendering in tabs)
const FAVICONS: Record<string, string> = {
  dark: "/favicon-dark-32x32.png",
  light: "/favicon-light-32x32.png",
  mint: "/favicon-mint-32x32.png",
};

/**
 * Swaps the document favicon to match the active theme.
 * Renders nothing; runs as a client-side side effect.
 */
export function FaviconSwitcher() {
  const { theme } = useTheme();

  useEffect(() => {
    const href = FAVICONS[theme ?? "dark"] ?? FAVICONS.dark;

    let link = document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][data-theme-favicon]'
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.setAttribute("data-theme-favicon", "true");
      document.head.appendChild(link);
    }
    link.href = href;
  }, [theme]);

  return null;
}
