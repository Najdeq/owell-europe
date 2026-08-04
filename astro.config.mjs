// @ts-check
import { defineConfig, sharpImageService } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://owelleurope.com',
  output: 'static',

  image: {
    // Wymuszamy sharpa JAWNIE. Cloudflare przy projekcie typu Worker sam
    // dokłada swój adapter Astro, a ten podmienia serwis obrazów na taki,
    // który zamiast wygenerować pliki w trakcie builda produkuje adresy
    // /_image?href=... obsługiwane dopiero w czasie żądania. Przy
    // output: 'static' nie ma czego takiego obsłużyć i KAŻDE zdjęcie
    // zwraca 404 (CSS działa, bo nie idzie przez ten mechanizm).
    // Z jawnym sharpem obrazy są przetwarzane na etapie builda i lądują
    // jako zwykłe pliki w dist/_astro/.
    service: sharpImageService(),
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});