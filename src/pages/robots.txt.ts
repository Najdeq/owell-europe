import type { APIRoute } from "astro";
import { produkcja } from "../data/deploy.ts";

// robots.txt generujemy zamiast trzymać w public/, żeby wdrożenia podglądowe
// (*.pages.dev) same zabraniały indeksowania. Statyczny plik zawsze pozwalałby
// na wszystko — patrz komentarz w src/data/deploy.ts.
export const GET: APIRoute = ({ site }) => {
  const tresc = produkcja
    ? [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${new URL("sitemap-index.xml", site)}`,
        "",
      ].join("\n")
    : [
        "# Wdrożenie podglądowe — nie indeksujemy.",
        "# Indeksowanie włącza zmienna PUBLIC_PRODUKCJA=true.",
        "User-agent: *",
        "Disallow: /",
        "",
      ].join("\n");

  return new Response(tresc, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
