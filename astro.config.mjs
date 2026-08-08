// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://owelleurope.com',
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
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});