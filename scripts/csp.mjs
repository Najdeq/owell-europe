import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

/**
 * Dopisuje nagłówek Content-Security-Policy do dist/client/_headers, z listą
 * sha256 wszystkich inline <script> faktycznie obecnych w zbudowanej stronie.
 *
 * Dlaczego to osobny skrypt uruchamiany PO buildzie (npm postbuild), a nie
 * statyczna linijka w public/_headers: część inline-skryptów ma treść, która
 * zależy od danych (np. wyszukiwarka modelu osadza listę produktów przez
 * define:vars — inną dla każdego z 8 języków). Ich sha256 zmienia się, gdy
 * zmienia się katalog produktów. Statyczny CSP w public/_headers po pierwszej
 * takiej zmianie zacząłby po cichu blokować własny skrypt strony (przeglądarka
 * nie wykona scriptu, którego hash nie pasuje do polityki) — bez błędu builda,
 * bez ostrzeżenia, tylko martwa wyszukiwarka na produkcji. Licząc hashe z
 * TEGO builda za każdym razem, CSP jest zawsze zgodny z tym, co faktycznie
 * trafia do przeglądarki.
 *
 * Statyczne nagłówki (X-Frame-Options itd.) zostają w public/_headers —
 * tamte się nie zmieniają między buildami, więc mają być pod kontrolą wersji
 * i czytelne dla człowieka. Tylko CSP jest generowany.
 *
 * script-src bez 'unsafe-inline' — stąd wymóg hashowania. style-src ma
 * 'unsafe-inline': część komponentów ustawia inline style="..." (np.
 * opóźnienia animacji karuzeli/reveal) — CSP nie ma odpowiednika hashowania
 * dla atrybutów style w statycznie budowanej stronie, a ryzyko wstrzyknięcia
 * przez CSS jest nieporównywalnie niższe niż przez JS. font-src ma `data:` —
 * część czcionek (@fontsource-variable) osadza fallback jako base64 wprost
 * w CSS, bez tego przeglądarka blokowała ich wczytanie. script-src też ma
 * `data:` — gtag.js sam sonduje wsparcie dynamic import przez pusty
 * <script src="data:application/javascript,">, niezależnie od naszego kodu.
 *
 * Zweryfikowane ręcznie: build → lokalny serwer z tymi nagłówkami → pełne
 * przejście po stronie z włączonymi View Transitions (astro:transitions):
 * nawigacja kategoria → produkt, galeria zdjęć, lupa na hover, menu mobilne,
 * wyszukiwarka modelu, przeciąganie karuzeli, przełącznik motywu i języka,
 * akordeon FAQ, widget WhatsApp, baner zgody na cookies, zgoda na GA4 —
 * zero błędów CSP w konsoli.
 */

const DIST = "dist/client";
const HEADERS_FILE = join(DIST, "_headers");

function znajdzPlikiHtml(dir, out = []) {
  for (const nazwa of readdirSync(dir)) {
    const pelna = join(dir, nazwa);
    if (statSync(pelna).isDirectory()) znajdzPlikiHtml(pelna, out);
    else if (nazwa.endsWith(".html")) out.push(pelna);
  }
  return out;
}

const pliki = znajdzPlikiHtml(DIST);
const hashe = new Set();
// dotyczy script BEZ src= (zewnętrzny plik) i BEZ type="application/ld+json"
// (dane strukturalne, nigdy nie wykonywane jako skrypt — CSP script-src ich
// nie dotyczy, więc nie trzeba ich hashować).
const scriptTagRe = /<script(\s[^>]*)?>([\s\S]*?)<\/script>/g;

for (const plik of pliki) {
  const html = readFileSync(plik, "utf-8");
  let dopasowanie;
  scriptTagRe.lastIndex = 0;
  while ((dopasowanie = scriptTagRe.exec(html))) {
    const atrybuty = dopasowanie[1] ?? "";
    const tresc = dopasowanie[2];
    if (/type\s*=\s*["']application\/ld\+json["']/.test(atrybuty)) continue;
    if (/\bsrc\s*=/.test(atrybuty)) continue;
    if (tresc.trim() === "") continue;
    hashe.add(createHash("sha256").update(tresc, "utf-8").digest("base64"));
  }
}

const scriptSrc = [
  "'self'",
  // gtag.js sam sonduje wsparcie dynamic import przez pusty
  // <script type="module" src="data:application/javascript,">, niezależnie
  // od naszego kodu — bez tego przeglądarka blokuje tę (nieszkodliwą, pustą)
  // sondę i loguje błąd CSP w konsoli przy każdym wczytaniu GA4.
  "data:",
  "https://www.googletagmanager.com",
  ...[...hashe].sort().map((h) => `'sha256-${h}'`),
].join(" ");

const csp = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

let obecne = readFileSync(HEADERS_FILE, "utf-8");
// usuń ewentualną linijkę CSP z poprzedniego uruchomienia (idempotencja przy
// wielokrotnym buildzie bez czyszczenia dist/)
obecne = obecne.replace(/\n\s*Content-Security-Policy:.*(?=\n|$)/g, "");

const zaktualizowane = obecne.trimEnd() + `\n  Content-Security-Policy: ${csp}\n`;
writeFileSync(HEADERS_FILE, zaktualizowane, "utf-8");

console.log(
  `[csp] ${pliki.length} stron, ${hashe.size} unikalnych hashy inline-skryptów, CSP dopisany do ${HEADERS_FILE}`
);