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
    kategoria: z.enum(["kuchnia", "pielegnacja", "agd-turystyczne", "dom"]),
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

// Tłumaczenia treści produktów per język — TYLKO pola tekstowe. Zdjęcia, EAN,
// dane GPSR (tożsamość prawna producenta), kolejność i publikacja zostają
// wspólne ze źródłowym wpisem PL (patrz src/pages/en/produkty/[id].astro).
// Plik o tym samym id co w produkty/ = tłumaczenie tamtego produktu;
// brakujące pole = strona pokazuje polski oryginał w tym miejscu.
const produktyTlumaczenia = (jezyk: string) =>
  defineCollection({
    loader: glob({ pattern: "**/*.md", base: `./src/content/produkty-${jezyk}` }),
    schema: z.object({
      tagline: z.string().optional(),
      opis: z.string().optional(),
      dane: z
        .array(z.object({ etykieta: z.string(), wartosc: z.string() }))
        .optional(),
      wyroznniki: z
        .array(z.object({ tytul: z.string(), opis: z.string() }))
        .optional(),
      pytania: z
        .array(z.object({ pytanie: z.string(), odpowiedz: z.string() }))
        .optional(),
      // Tylko treść ostrzeżeń — tożsamość producenta (nazwa, adres, e-mail)
      // to ten sam podmiot prawny niezależnie od języka strony, więc nie
      // duplikujemy jej tutaj.
      ostrzezeniaGpsr: z.array(z.string()).optional(),
    }),
  });

const produktyEn = produktyTlumaczenia("en");
const produktyDe = produktyTlumaczenia("de");
const produktyRu = produktyTlumaczenia("ru");
const produktyFr = produktyTlumaczenia("fr");
const produktyEs = produktyTlumaczenia("es");
const produktyCs = produktyTlumaczenia("cs");
const produktyIt = produktyTlumaczenia("it");

// Blog jako fabryka kolekcji (jak produktyTlumaczenia) — angielska wersja to
// PEŁNE, osobne wpisy (własny tytuł, opis i treść markdown), nie nakładka
// tłumaczeń na PL. Treść artykułu to nie kilka pól do podmiany, tylko cały
// tekst, więc prościej trzymać kompletny odpowiednik niż warstwę tłumaczeń.
const blogCollection = (base: string) =>
  defineCollection({
    loader: glob({ pattern: "**/*.md", base }),
    schema: z.object({
      tytul: z.string(),
      // Krótki opis pod tytułem na liście wpisów i w meta description —
      // osobno od treści, żeby nie ucinać pierwszego akapitu na siłę.
      opis: z.string(),
      data: z.coerce.date(),
      // Ścieżka względem public/, np. "/blog/gpsr-co-to-jest.jpg". Osobne pole
      // od `zdjecieGlowne` w kolekcji produktów, bo blog nie korzysta z
      // astro:assets (wpisy dodaje się przez panel CMS, nie przez import w kodzie).
      okladka: z.string().optional(),
      autor: z.string().default("Owell"),
      tagi: z.array(z.string()).default([]),
      // Identyfikatory z kolekcji `produkty` (nazwy plików bez .md), np. "ow-8805".
      // Wypełnia je redaktor wpisu — na tej podstawie pod treścią renderuje się
      // karta produktu zamiast zwykłego linku tekstowego w treści.
      produkty: z.array(z.string()).default([]),
      // Domyślnie false — wpis dodany przez CMS nie trafia na żywo, dopóki
      // ktoś świadomie nie przełączy go na opublikowany. Bez tego każdy zapis
      // roboczy w panelu byłby od razu widoczny publicznie.
      opublikowany: z.boolean().default(false),
    }),
  });

const blog = blogCollection("./src/content/blog");
const blogEn = blogCollection("./src/content/blog-en");
const blogDe = blogCollection("./src/content/blog-de");
const blogRu = blogCollection("./src/content/blog-ru");
const blogFr = blogCollection("./src/content/blog-fr");
const blogEs = blogCollection("./src/content/blog-es");
const blogCs = blogCollection("./src/content/blog-cs");
const blogIt = blogCollection("./src/content/blog-it");

export const collections = {
  produkty,
  "produkty-en": produktyEn,
  "produkty-de": produktyDe,
  "produkty-ru": produktyRu,
  "produkty-fr": produktyFr,
  "produkty-es": produktyEs,
  "produkty-cs": produktyCs,
  "produkty-it": produktyIt,
  blog,
  "blog-en": blogEn,
  "blog-de": blogDe,
  "blog-ru": blogRu,
  "blog-fr": blogFr,
  "blog-es": blogEs,
  "blog-cs": blogCs,
  "blog-it": blogIt,
};
