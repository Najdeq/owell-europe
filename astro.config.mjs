// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://owelleurope.com',
  output: 'static',

  // Adapter dodany JAWNIE, choć strona jest statyczna. Cloudflare przy
  // projekcie typu Worker i tak wstrzykuje go automatycznie podczas builda —
  // trzymanie go w repo daje kontrolę nad konfiguracją i sprawia, że build
  // lokalny odpowiada temu na serwerze.
  //
  // `imageService: 'compile'` jest tu kluczowe: obrazy są przetwarzane
  // sharpem na etapie builda i lądują w dist/_astro/ jako gotowe pliki .webp.
  // Bez tego adapter ustawia tryb, w którym <Image> generuje adresy
  // /_image?href=... rozwiązywane dopiero w czasie żądania — a przy
  // output: 'static' nie ma runtime'u, który by je obsłużył, więc KAŻDE
  // zdjęcie zwraca 404 (CSS działa, bo nie idzie przez ten mechanizm).
  adapter: cloudflare({
    imageService: 'compile',
  }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap()]
});