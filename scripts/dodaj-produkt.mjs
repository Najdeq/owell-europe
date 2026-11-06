// Narzędzie do dodawania produktu z katalogu Adlera (nie część builda).
//
// Użycie (z katalogu owell-europe):
//   node scripts/dodaj-produkt.mjs ow_6882 1 6,7,8,2,5
//     arg1: SKU Adlera (ow_XXXX)
//     arg2: numer zdjęcia głównego (0 = big_ow_XXXX.jpg, 1 = big_ow_XXXX_1.jpg…)
//     arg3: numery zdjęć galerii po przecinku, w kolejności wyświetlania
//
// Co robi: pobiera zdjęcia w 3000 px z adler.com.pl/dane/print/<sku>/ do
// src/assets/produkty/{hero,galeria}/, instrukcję PDF do public/pliki/, i dopisuje
// importy zdjęć w src/data/zdjecia.ts, src/data/galeria.ts oraz 8 szablonach
// stron produktu. Treść (src/content/produkty*/<id>.md) i podkategorię
// (src/data/kategorie.ts) dopisuje się ręcznie.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const [sku, heroNr, galeriaArg] = process.argv.slice(2);
if (!sku || heroNr === undefined || !galeriaArg) {
  console.error("Użycie: node scripts/dodaj-produkt.mjs ow_XXXX <nr-zdjecia-glownego> <nr,nr,…>");
  process.exit(1);
}
const id = sku.replace("_", "-"); // ow-6882
const num = id.replace("ow-", ""); // 6882
const fotoVar = "fotoOw" + num;
const galVar = (i) => `foto_${sku}_${i}`;
const galeria = galeriaArg.split(",").map(Number);
const B = `http://www.adler.com.pl/dane/print/${sku}`;
const url = (n) => `${B}/big_${sku}${n === 0 ? "" : "_" + n}.jpg`;

async function pobierz(src, dest) {
  const r = await fetch(src);
  if (!r.ok) throw new Error(`${r.status} ${src}`);
  writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
  console.log("pobrano", dest);
}

await pobierz(url(+heroNr), `src/assets/produkty/hero/${id}.jpg`);
for (const [i, n] of galeria.entries()) await pobierz(url(n), `src/assets/produkty/galeria/${id}-${i + 1}.jpg`);
try {
  await pobierz(`http://www.adler.com.pl/dane/manuals/${sku}.pdf`, `public/pliki/${id}-instrukcja.pdf`);
} catch (e) {
  console.warn("BRAK instrukcji:", e.message);
}

// Dopisuje linię po ostatnim dopasowaniu wzorca (zachowuje CRLF/LF pliku).
function poOstatnim(plik, wzorzec, linia) {
  const t = readFileSync(plik, "utf8");
  if (t.includes(linia.trim())) return;
  const eol = t.includes("\r\n") ? "\r\n" : "\n";
  const linie = t.split(eol);
  let idx = -1;
  linie.forEach((l, i) => wzorzec.test(l) && (idx = i));
  if (idx < 0) throw new Error(`nie znaleziono ${wzorzec} w ${plik}`);
  linie.splice(idx + 1, 0, linia);
  writeFileSync(plik, linie.join(eol));
}

const strony = [
  ["src/data/zdjecia.ts", "../assets"],
  ["src/pages/produkty/[id].astro", "../../assets"],
  ...["en", "de", "ru", "fr", "es", "cs", "it"].map((l) => [`src/pages/${l}/produkty/[id].astro`, "../../../assets"]),
];
for (const [plik, rel] of strony) {
  if (!existsSync(plik)) throw new Error("brak " + plik);
  poOstatnim(plik, /^import fotoOw\w+ from ".*\/hero\//, `import ${fotoVar} from "${rel}/produkty/hero/${id}.jpg";`);
  poOstatnim(plik, /^  "ow-[\w]+": fotoOw\w+,$/, `  "${id}": ${fotoVar},`);
}

const g = "src/data/galeria.ts";
for (let i = 1; i <= galeria.length; i++)
  poOstatnim(g, /^import foto_ow_/, `import ${galVar(i)} from "../assets/produkty/galeria/${id}-${i}.jpg";`);
poOstatnim(g, /^  "ow-[\w]+": \[foto_ow_/, `  "${id}": [${galeria.map((_, i) => galVar(i + 1)).join(", ")}],`);
console.log("OK", id);
