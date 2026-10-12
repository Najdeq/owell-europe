import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

/**
 * Identyczne instrukcje PDF pod różnymi adresami (warianty jednego modelu,
 * np. grzejniki OW 7832/7833/7834 mają ten sam plik) Search Console zgłaszał
 * jako „Duplikat, użytkownik nie oznaczył strony kanonicznej". PDF nie ma
 * <link rel="canonical">, więc wskazujemy oryginał nagłówkiem HTTP
 * `Link: <…>; rel="canonical"` w dist/client/_headers.
 *
 * Kanoniczny = pierwszy alfabetycznie plik w grupie identycznych (sha256).
 * Uruchamiany PO scripts/csp.mjs — tamten dopisuje CSP na koniec pliku, do
 * ostatniej reguły, więc nasze bloki muszą trafić za nim.
 */

const KATALOG = "dist/client/pliki";
const HEADERS = "dist/client/_headers";
const ORIGIN = "https://owelleurope.pl";
const ZNACZNIK = "# pdf-kanoniczne";

const grupy = new Map();
for (const plik of readdirSync(KATALOG).filter((p) => p.toLowerCase().endsWith(".pdf")).sort()) {
  const hash = createHash("sha256").update(readFileSync(join(KATALOG, plik))).digest("hex");
  if (!grupy.has(hash)) grupy.set(hash, []);
  grupy.get(hash).push(plik);
}

const bloki = [];
for (const pliki of grupy.values()) {
  if (pliki.length < 2) continue;
  const [kanoniczny, ...duplikaty] = pliki;
  for (const dup of duplikaty) {
    bloki.push(`/pliki/${dup}\n  Link: <${ORIGIN}/pliki/${kanoniczny}>; rel="canonical"`);
  }
}

let headers = readFileSync(HEADERS, "utf-8");
// idempotencja: usuń bloki z poprzedniego uruchomienia
const i = headers.indexOf(ZNACZNIK);
if (i !== -1) headers = headers.slice(0, i);
headers = headers.trimEnd() + "\n";
if (bloki.length) headers += `\n${ZNACZNIK}\n${bloki.join("\n\n")}\n`;
writeFileSync(HEADERS, headers, "utf-8");

console.log(`[pdf] ${bloki.length} zduplikowanych instrukcji wskazuje na oryginał (rel=canonical)`);
