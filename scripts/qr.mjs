import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, extname } from "node:path";
import QRCode from "qrcode";

/**
 * Generuje src/data/qr.json — kod QR (SVG, biało-czarny) linkujący do
 * strony każdego produktu, we wszystkich 8 językach, do KodQR.astro na
 * stronie produktu ("zeskanuj, żeby otworzyć tę stronę na telefonie").
 *
 * Osobny prebuild script (ten sam wzorzec co blur.mjs/instrukcje.mjs), NIE
 * generowanie w komponencie Astro w locie: paczka `qrcode` po drodze
 * ładuje `pngjs` (obsługa PNG, nieużywana — my robimy tylko SVG), a `pngjs`
 * woła gołe `require("zlib"/"fs"/"assert"/"buffer")` w sposób, którego nie
 * da się zbundlować do środowiska Workers używanego przy prerenderowaniu
 * przez adapter Cloudflare — build wywala się błędem 500 z miniflare.
 * Uruchomione tutaj, w zwykłym Node (npm prebuild), ten problem w ogóle
 * nie występuje.
 *
 * Klucz w JSON-ie to "{jezyk}:{idProduktu}" (np. "pl:ow-4096") — nie ścieżka
 * URL, żeby KodQR.astro nie musiał zgadywać dokładnej postaci
 * Astro.url.pathname (ze/bez ukośnika na końcu itp.). Wartość to
 * { svg, url } — sam adres trzymamy obok SVG, bo przycisk "Udostępnij"
 * (Web Share API) wysyła oprócz obrazka też tekst z linkiem.
 */
const SITE = "https://owelleurope.pl"; // musi się zgadzać z `site` w astro.config.mjs
const JEZYKI = ["pl", "en", "de", "ru", "fr", "es", "cs", "it"];
const KATALOG_PRODUKTOW = "src/content/produkty";
const WYJSCIE = "src/data/qr.json";

const idy = readdirSync(KATALOG_PRODUKTOW)
  .filter((f) => extname(f) === ".md")
  .map((f) => basename(f, ".md"));

const wynik = {};

for (const id of idy) {
  for (const jezyk of JEZYKI) {
    const sciezka = jezyk === "pl" ? `/produkty/${id}/` : `/${jezyk}/produkty/${id}/`;
    const url = new URL(sciezka, SITE).toString();
    const svg = await QRCode.toString(url, {
      type: "svg",
      margin: 0,
      color: { dark: "#0F0E0C", light: "#FFFFFF" },
    });
    wynik[`${jezyk}:${id}`] = { svg, url };
  }
}

mkdirSync("src/data", { recursive: true });
writeFileSync(WYJSCIE, JSON.stringify(wynik) + "\n");
console.log(`[qr] wygenerowano ${Object.keys(wynik).length} kodów QR do ${WYJSCIE}`);
