import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const produkty = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/produkty" }),
  schema: z.object({
    nazwa: z.string(),
    model: z.string(),
    // Kod kreskowy EAN-13 z tabliczki/pudełka. Trafia do schema.org/Product
    // jako `gtin13` — Google używa go do powiązania produktu z ofertami
    // w innych serwisach. Walidacja pilnuje formatu, żeby literówka nie
    // przeszła do danych strukturalnych.
    ean: z.string().regex(/^\d{13}$/, "EAN musi mieć dokładnie 13 cyfr").optional(),
    kategoria: z.enum(["kuchnia", "pielegnacja", "agd-turystyczne"]),
    tagline: z.string(),
    opis: z.string(),
    zdjecieGlowne: z.string(),
    galeria: z.array(z.string()).optional(),
    dane: z.array(
      z.object({
        etykieta: z.string(),
        wartosc: z.string(),
      })
    ),
    wyroznniki: z.array(
      z.object({
        tytul: z.string(),
        opis: z.string(),
      })
    ),
    gwarancjaMiesiace: z.number().default(24),
    // Pytania, które faktycznie zadają klienci o ten konkretny model
    // („czy zmieści się dwulitrowa butelka", „jak długi jest kabel").
    // Wyświetlają się na stronie produktu i trafiają do danych strukturalnych
    // FAQPage, więc Google może pokazać je bezpośrednio w wynikach.
    // Wpisuj tylko odpowiedzi, które da się obronić — to samo kryterium
    // co przy danych technicznych.
    pytania: z
      .array(z.object({ pytanie: z.string(), odpowiedz: z.string() }))
      .optional(),
    instrukcjaPdf: z.string().optional(),
    gpsr: z.object({
      producent: z.string(),
      adres: z.string(),
      emailProducenta: z.string(),
      osobaOdpowiedzialnaUE: z.string().optional(),
      ostrzezenia: z.array(z.string()).optional(),
    }),
    // Sprzedaż idzie przez jeden sklep (`site.sklep`), więc pole per-produkt
    // jest opcjonalne — używaj go tylko, gdy dany model ma inny adres docelowy.
    gdzieKupic: z.string().optional(),
    kolejnosc: z.number(),
    opublikowany: z.boolean().default(true),
  }),
});

export const collections = { produkty };
