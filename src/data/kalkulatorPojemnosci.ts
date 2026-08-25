/**
 * Wizualizacja pojemności produktu w codziennych jednostkach ("1,75 l to
 * ok. 6 szklanek") — czysto poglądowa, stąd osobny plik zamiast pola w
 * schemacie kolekcji `produkty` (jak zdjecia.ts/galeria.ts/kategorie.ts).
 * Puste dla produktu = KalkulatorPojemnosci.astro nic nie renderuje.
 *
 * `pojemnoscMl`/`jednostkaMl` to zaokrąglone, orientacyjne wartości — nie
 * dane techniczne z tabliczki znamionowej (te są w `dane` w pliku produktu).
 * Wybór jednostki ma być intuicyjny dla kupującego, nie precyzyjny co do
 * mililitra.
 */
export type JednostkaTyp = "szklanka" | "filizanka" | "puszka" | "porcja";

export interface KalkulatorPojemnosci {
  pojemnoscMl: number;
  jednostkaMl: number;
  jednostkaTyp: JednostkaTyp;
}

export const kalkulatorPojemnosci: Record<string, KalkulatorPojemnosci> = {
  "ow-1360b": { pojemnoscMl: 1700, jednostkaMl: 250, jednostkaTyp: "filizanka" },
  "ow-1360w": { pojemnoscMl: 1700, jednostkaMl: 250, jednostkaTyp: "filizanka" },
  "ow-4096": { pojemnoscMl: 1750, jednostkaMl: 300, jednostkaTyp: "szklanka" },
  "ow-4634": { pojemnoscMl: 700, jednostkaMl: 250, jednostkaTyp: "porcja" },
  "ow-4819": { pojemnoscMl: 900, jednostkaMl: 225, jednostkaTyp: "porcja" },
  "ow-8805": { pojemnoscMl: 22000, jednostkaMl: 330, jednostkaTyp: "puszka" },
};