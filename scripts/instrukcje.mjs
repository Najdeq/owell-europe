import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Generuje src/data/instrukcje.json — spis instrukcji PDF leżących w public/pliki/
 * wraz z rozmiarem każdego pliku.
 *
 * Dlaczego osobny skrypt, a nie odczyt dysku na stronie:
 * strony Astro są prerenderowane w środowisku Cloudflare Workers, gdzie
 * `node:fs` NIE ISTNIEJE — próba użycia go wywala build komunikatem
 * "No such module node:fs". Ten skrypt uruchamia się wcześniej (npm prebuild),
 * jeszcze w Node, więc ma normalny dostęp do plików.
 *
 * Dzięki temu lista instrukcji i ich rozmiary są zawsze zgodne ze stanem
 * faktycznym — wrzucasz PDF do public/pliki/ i pojawia się sam, bez edycji kodu.
 */
const KATALOG = "public/pliki";
const WYJSCIE = "src/data/instrukcje.json";

const spis = {};

if (existsSync(KATALOG)) {
  for (const plik of readdirSync(KATALOG)) {
    if (!plik.toLowerCase().endsWith(".pdf")) continue;
    // ow-8058-instrukcja.pdf → ow-8058
    const id = plik.replace(/-instrukcja\.pdf$/i, "").replace(/\.pdf$/i, "");
    const bajty = statSync(join(KATALOG, plik)).size;
    spis[id] = {
      url: `/${KATALOG.replace(/^public\//, "")}/${plik}`,
      mb: +(bajty / (1024 * 1024)).toFixed(1),
    };
  }
}

mkdirSync("src/data", { recursive: true });
writeFileSync(WYJSCIE, JSON.stringify(spis, null, 2) + "\n");
console.log(`[instrukcje] zapisano ${Object.keys(spis).length} pozycji do ${WYJSCIE}`);
