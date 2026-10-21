// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// <lastmod> w sitemapie tylko tam, gdzie znamy prawdziwą datę: `dodano`
// produktu i `data` wpisu na blogu (wszystkie wersje językowe danej strony
// dostają tę samą). Data builda na każdym adresie byłaby nieprawdą — Google
// przestaje wtedy ufać lastmod w całej sitemapie.
function datyZFrontmattera(katalog, pole) {
  const daty = new Map();
  for (const plik of readdirSync(katalog)) {
    if (!plik.endsWith('.md')) continue;
    const m = readFileSync(`${katalog}/${plik}`, 'utf8').match(new RegExp(`^${pole}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm'));
    if (m) daty.set(plik.replace(/\.md$/, ''), m[1]);
  }
  return daty;
}
const datyProduktow = datyZFrontmattera('./src/content/produkty', 'dodano');
const datyWpisow = datyZFrontmattera('./src/content/blog', 'data');

// https://astro.build/config
export default defineConfig({
  site: 'https://owelleurope.pl',
  output: 'static',

  // Polski zostaje bez przedrostka (/, /produkty...), żeby nie przekierowywać
  // ani nie zrywać już zaindeksowanych URL-i. Pozostałe języki dostają
  // przedrostek (/en/, /de/...). routing.fallbackType: "rewrite" pokazuje
  // polską treść pod obcym URL-em zamiast przekierowywać, dla stron,
  // których jeszcze nie przetłumaczono — nigdy 404 zamiast tłumaczenia.
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en', 'de', 'ru', 'fr', 'es', 'cs', 'it'],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'rewrite',
    },
  },

  // Adapter dodany JAWNIE, choć strona jest statyczna. Cloudflare przy
  // projekcie typu Worker i tak wstrzykuje go automatycznie podczas builda —
  // trzymanie go w repo daje kontrolę nad konfiguracją.
  //
  // `imageService: 'compile'` jest tu kluczowe: obrazy są przetwarzane
  // sharpem na etapie builda i lądują w dist/_astro/ jako gotowe pliki .webp.
  // Bez tego adapter ustawia tryb, w którym <Image> generuje adresy
  // /_image?href=... rozwiązywane dopiero w czasie żądania — a przy
  // output: 'static' nie ma runtime'u, który by je obsłużył, więc KAŻDE
  // zdjęcie zwraca 404 (CSS działa, bo nie idzie przez ten mechanizm).
  //
  // Adapter podpinamy TYLKO przy `astro build`. W `astro dev` przełącza on
  // serwer deweloperski na runtime Workers (miniflare), a ten na Windows
  // wykłada się przy każdym przeładowaniu na cache optymalizatora Vite
  // ("The file does not exist ... deps_ssr/..."), przez co dev server zwraca
  // 500 po każdej edycji pliku. Cloudflare uruchamia `npm run build`,
  // więc na wdrożeniu adapter jest obecny tak czy inaczej.
  ...(process.argv.includes('build') ? { adapter: cloudflare({ imageService: 'compile' }) } : {}),

  vite: {
    plugins: [tailwindcss()],
    // Skrypty komponentów zawsze jako osobne pliki w /_astro/, nigdy wklejone
    // w HTML. Domyślnie Astro wkleja te poniżej 4 KB — każdy taki skrypt
    // wymagał osobnego sha256 w nagłówku CSP (scripts/csp.mjs), a Cloudflare
    // odrzuca linię _headers dłuższą niż 2000 znaków. Przy ~30 hashach wdrożenie
    // padło („Line exceeds limit of 2000 characters"). Pliki z własnej domeny
    // pokrywa 'self', więc CSP nie rośnie z każdym nowym komponentem.
    build: {
      assetsInlineLimit: 0,
    },
  },

  integrations: [
    sitemap({
      serialize(item) {
        const m = item.url.match(/\/(produkty|blog)\/([^/]+)\/$/);
        const data = m && (m[1] === 'produkty' ? datyProduktow : datyWpisow).get(m[2]);
        if (data) item.lastmod = new Date(data).toISOString();
        return item;
      },
    }),
  ]
});