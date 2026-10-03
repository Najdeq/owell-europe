import type { Jezyk } from "./ui.ts";

/**
 * <title> i meta description strony produktu.
 *
 * Wcześniej tytuł brzmiał „Owell OW 2960 (OW 2960) — Owell" — sam numer modelu,
 * bez słowa o tym, czym jest produkt, więc Google nie łączył strony z frazami
 * typu „golarka do głowy". Typ produktu bierzemy z taglinu (już przetłumaczonego
 * w kolekcjach produkty-xx), dzięki czemu tytuł jest w języku strony i nie
 * wymaga osobnego pola w każdym pliku produktu.
 */

// Spójniki, przed którymi ucinamy typ produktu: „Czajnik elektryczny LED 1,7 l
// z regulacją temperatury…" → „Czajnik elektryczny LED 1,7 l".
const spojniki: Record<Jezyk, string[]> = {
  pl: [" z ", " ze "],
  en: [" with "],
  de: [" mit "],
  ru: [" с ", " со "],
  fr: [" avec "],
  es: [" con "],
  cs: [" s ", " se "],
  it: [" con "],
};

// Powyżej tej długości Google zwykle ucina tytuł w wynikach.
const MAKS_TYTUL = 62;

export function tytulProduktu(tagline: string, model: string, jezyk: Jezyk): string {
  // Przecinek lub dwukropek ZE SPACJĄ — sam przecinek to też separator
  // dziesiętny („1,7 l", „0,8–19 mm"), którego nie wolno rozcinać.
  const separator = tagline.search(/[,:]\s/);
  let typ = separator === -1 ? tagline : tagline.slice(0, separator);
  let uciety = false;
  for (const s of spojniki[jezyk]) {
    const i = typ.indexOf(s);
    if (i >= 10) {
      typ = typ.slice(0, i);
      uciety = true;
    }
  }
  typ = typ.trim();

  let tytul = `${typ} Owell ${model}`;

  // Po przecinku w taglinie są konkretne cechy („6 głowic, golenie do 0,1 mm")
  // — dokładamy je, dopóki tytuł mieści się w wynikach. Po dwukropku jest
  // wyliczanka zawartości zestawu, która w tytule wyglądałaby jak urwane zdanie.
  // To samo po ucięciu na spójniku: „…z rozdrabniaczem, ubijaczką i spieniaczem"
  // — dalsze człony należą do uciętej wyliczanki, nie są osobnymi cechami.
  if (separator !== -1 && tagline[separator] === "," && !uciety) {
    const cechy: string[] = [];
    for (const cecha of tagline.slice(separator + 1).split(/,\s/).map((c) => c.trim())) {
      const kandydat = `${tytul} – ${[...cechy, cecha].join(", ")}`;
      if (kandydat.length > MAKS_TYTUL) break;
      cechy.push(cecha);
    }
    if (cechy.length) tytul = `${tytul} – ${cechy.join(", ")}`;
  }

  return tytul;
}

export function opisProduktu(tagline: string, dopisek: string): string {
  const zdanie = /[.!?]$/.test(tagline) ? tagline : `${tagline}.`;
  return `${zdanie} ${dopisek}`;
}
