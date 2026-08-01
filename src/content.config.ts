import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const produkty = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/produkty" }),
  schema: z.object({
    nazwa: z.string(),
    model: z.string(),
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
    instrukcjaPdf: z.string().optional(),
    gpsr: z.object({
      producent: z.string(),
      adres: z.string(),
      emailProducenta: z.string(),
      osobaOdpowiedzialnaUE: z.string().optional(),
      ostrzezenia: z.array(z.string()).optional(),
    }),
    gdzieKupic: z.string(),
    kolejnosc: z.number(),
    opublikowany: z.boolean().default(true),
  }),
});

export const collections = { produkty };
