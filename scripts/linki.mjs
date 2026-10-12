import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Dopisuje końcowy ukośnik do linków wewnętrznych, które prowadzą do stron
 * (/produkty → /produkty/), w zbudowanym HTML i w danych strukturalnych.
 *
 * Dlaczego: Cloudflare serwuje stronę tylko pod adresem z ukośnikiem, a wersję
 * bez niego przekierowuje (307). Linki bez ukośnika były rozsiane po
 * szablonach, treściach markdown (wpisy bloga) i BreadcrumbList — ponad 200
 * wystąpień. Google zaliczał adresy za przekierowaniem do „niezaindeksowanych"
 * w Search Console i tracił na nich budżet indeksowania. Poprawianie każdego
 * źródła z osobna nie przetrwałoby pierwszego nowego wpisu z linkiem
 * „/produkty/ow-…" bez ukośnika, więc normalizujemy wynik builda.
 *
 * Zmieniamy tylko adresy, dla których w dist/client istnieje <ścieżka>/index.html
 * — pliki (PDF, obrazy, rss.xml) i adresy z kotwicą/parametrem zostają nietknięte
 * w części po # i ?. Musi działać PRZED scripts/csp.mjs (npm postbuild).
 */

const DIST = "dist/client";
const ORIGIN = "https://owelleurope.pl";

function znajdzPlikiHtml(dir, out = []) {
  for (const nazwa of readdirSync(dir)) {
    const pelna = join(dir, nazwa);
    if (statSync(pelna).isDirectory()) znajdzPlikiHtml(pelna, out);
    else if (nazwa.endsWith(".html")) out.push(pelna);
  }
  return out;
}

const cache = new Map();
function jestStrona(sciezka) {
  if (!cache.has(sciezka)) cache.set(sciezka, existsSync(join(DIST, sciezka, "index.html")));
  return cache.get(sciezka);
}

// "/produkty" lub "/produkty#x" / "/produkty?y" → "/produkty/…"
function napraw(adres) {
  const m = adres.match(/^(\/[^#?]*?)([#?].*)?$/);
  if (!m) return adres;
  const [, sciezka, reszta = ""] = m;
  if (sciezka.endsWith("/") || /\.[a-z0-9]+$/i.test(sciezka)) return adres;
  return jestStrona(sciezka) ? `${sciezka}/${reszta}` : adres;
}

let zmienionych = 0;
let plikow = 0;

for (const plik of znajdzPlikiHtml(DIST)) {
  const html = readFileSync(plik, "utf-8");

  let nowy = html.replace(/(\shref=")(\/[^"]*)"/g, (calosc, przed, adres) => {
    const n = napraw(adres);
    if (n !== adres) zmienionych++;
    return `${przed}${n}"`;
  });

  // Dane strukturalne (BreadcrumbList, Product, Organization…) mają pełne URL-e.
  nowy = nowy.replace(
    /(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,
    (calosc, otw, json, zam) =>
      otw +
      json.replace(new RegExp(`"${ORIGIN}(/[^"]*)"`, "g"), (c, adres) => {
        const n = napraw(adres);
        if (n !== adres) zmienionych++;
        return `"${ORIGIN}${n}"`;
      }) +
      zam
  );

  if (nowy !== html) {
    writeFileSync(plik, nowy, "utf-8");
    plikow++;
  }
}

console.log(`[linki] dopisano ukośnik w ${zmienionych} linkach na ${plikow} stronach`);
