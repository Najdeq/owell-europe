/**
 * Dodatkowe zdjęcia produktów (poza głównym z `zdjecia.ts`), do galerii na
 * stronie produktu. Puste = produkt ma tylko jedno zdjęcie, komponent
 * ProduktGaleria.astro wtedy nie pokazuje miniatur (zachowanie sprzed
 * wprowadzenia galerii, bez regresji wizualnej).
 *
 * Żeby dodać zdjęcia: wrzuć plik do src/assets/produkty/galeria/<id>-N.jpg,
 * zaimportuj go tutaj i dopisz do tablicy pod właściwym id. Kolejność w
 * tablicy = kolejność miniatur.
 */
export const galeria: Record<string, ImageMetadata[]> = {};