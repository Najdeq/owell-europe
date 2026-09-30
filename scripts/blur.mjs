import { readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

/**
 * Generuje src/data/blur.json — rozmyte miniaturki (base64) wszystkich
 * zdjęć produktów (hero + galeria), do efektu "blur-up" przy ładowaniu
 * ProduktGaleria.astro: rozmyta wersja wypełnia kadr natychmiast (jest
 * wpieczona w HTML), prawdziwe zdjęcie doczytuje się nad nią i po
 * zdekodowaniu całkowicie ją zasłania (opaque JPEG na tej samej pozycji) —
 * bez dodatkowego JS na "load", sama warstwa CSS wystarcza.
 *
 * Osobny skrypt (npm prebuild), bo to Node-side sharp, nie coś, co da się
 * policzyć w komponencie Astro w runtime Workers przy imageService:'compile'.
 * Klucz w JSON-ie to nazwa pliku bez rozszerzenia — dokładnie to, co
 * ProduktGaleria.astro odtwarza z produktId + index (np. "ow-4096",
 * "ow-4096-1") bez potrzeby przekazywania osobnej listy kluczy.
 */
const KATALOGI = ["src/assets/produkty/hero", "src/assets/produkty/galeria"];
const WYJSCIE = "src/data/blur.json";
const ROZSZERZENIA = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const wynik = {};

for (const dir of KATALOGI) {
  if (!existsSync(dir)) continue;
  for (const plik of readdirSync(dir)) {
    const pelna = join(dir, plik);
    if (statSync(pelna).isDirectory()) continue;
    if (!ROZSZERZENIA.has(extname(plik).toLowerCase())) continue;

    const klucz = basename(plik, extname(plik));
    const buffer = await sharp(pelna)
      .resize(24, 24, { fit: "inside" })
      .jpeg({ quality: 35 })
      .toBuffer();
    wynik[klucz] = `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
}

mkdirSync("src/data", { recursive: true });
writeFileSync(WYJSCIE, JSON.stringify(wynik) + "\n");
console.log(`[blur] wygenerowano ${Object.keys(wynik).length} placeholderów do ${WYJSCIE}`);
