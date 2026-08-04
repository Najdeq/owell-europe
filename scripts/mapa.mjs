import { writeFileSync } from "node:fs";

/**
 * Generuje src/data/mapa-swiata.json — kontury państw jako ścieżki SVG.
 *
 * Źródło: world-atlas (Natural Earth, 110m) — dane w domenie publicznej,
 * bez wymogu atrybucji. Pobieramy je RAZ i commitujemy wynik, żeby build
 * nie zależał od sieci ani od zewnętrznej biblioteki map (CLAUDE.md zakazuje
 * dokładania bibliotek — a leaflet/d3 byłyby tu armatą na muchę, bo mapa
 * jest statyczna i nieinteraktywna poza podświetlaniem krajów).
 *
 * Uruchamiać ręcznie tylko przy zmianie źródła danych:
 *   node scripts/mapa.mjs
 */
const ZRODLO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const WYJSCIE = "src/data/mapa-swiata.json";

// Odwzorowanie równoprostokątne (equirectangular): najprostsze sensowne —
// długość geograficzna wprost na X, szerokość na Y. Antarktydę obcinamy,
// bo zajmuje pas u dołu i nic nie wnosi.
const SZEROKOSC = 1000;
const MIN_LAT = -58;
const MAX_LAT = 84;

const rzut = ([lon, lat]) => {
  const x = ((lon + 180) / 360) * SZEROKOSC;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * (SZEROKOSC / 2);
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
};

const odp = await fetch(ZRODLO);
if (!odp.ok) throw new Error(`nie udało się pobrać geodanych: ${odp.status}`);
const topo = await odp.json();

// --- dekoder TopoJSON (kwantyzacja + łuki) ---------------------------------
// TopoJSON trzyma współrzędne jako różnice na siatce całkowitoliczbowej,
// a granice jako współdzielone „łuki". Rozpakowujemy je ręcznie — to ~20 linii
// i oszczędza dokładanie zależności topojson-client tylko na potrzeby builda.
const { scale, translate } = topo.transform;
const luki = topo.arcs.map((luk) => {
  let x = 0;
  let y = 0;
  return luk.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

// Indeks ujemny oznacza ten sam łuk przebiegnięty w drugą stronę (~i => -i-1).
const pobierzLuk = (i) => (i < 0 ? luki[~i].slice().reverse() : luki[i]);

const pierscienDoD = (indeksy) => {
  const punkty = [];
  for (const i of indeksy) {
    const luk = pobierzLuk(i);
    // pierwszy punkt kolejnego łuku dubluje ostatni punkt poprzedniego
    punkty.push(...(punkty.length ? luk.slice(1) : luk));
  }
  const d = punkty
    .map(rzut)
    .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
    .join("");
  return d ? `${d}Z` : "";
};

const kraje = {};
for (const geo of topo.objects.countries.geometries) {
  const nazwa = geo.properties?.name;
  if (!nazwa) continue;
  if (nazwa === "Antarctica") continue;

  const wielokaty =
    geo.type === "Polygon" ? [geo.arcs] : geo.type === "MultiPolygon" ? geo.arcs : [];

  const d = wielokaty
    .flatMap((wielokat) => wielokat.map(pierscienDoD))
    .filter(Boolean)
    .join("");

  if (d) kraje[nazwa] = d;
}

writeFileSync(
  WYJSCIE,
  JSON.stringify({ szerokosc: SZEROKOSC, wysokosc: SZEROKOSC / 2, kraje }, null, 0) + "\n"
);

const wagaKb = Math.round(JSON.stringify(kraje).length / 1024);
console.log(`[mapa] ${Object.keys(kraje).length} krajów → ${WYJSCIE} (${wagaKb} kB)`);
