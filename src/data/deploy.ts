/**
 * Czy to jest wdrożenie produkcyjne (docelowa domena), czy podgląd?
 *
 * Zasada jest celowo odwrotna do intuicyjnej: **domyślnie NIE indeksujemy**.
 * Wyszukiwarki dostają zgodę dopiero, gdy w zmiennych środowiskowych
 * ustawisz wprost `PUBLIC_PRODUKCJA=true`.
 *
 * Dlaczego tak: pomyłka w jedną stronę jest odwracalna w minutę (włączasz
 * zmienną i robisz redeploy), a w drugą — nie. Zaindeksowany adres podglądu
 * typu *.pages.dev zaczyna konkurować w Google z docelową domeną i potrafi
 * tam zostać tygodniami, także po usunięciu podglądu.
 *
 * Włączenie produkcji (Cloudflare Pages → Settings → Environment variables):
 *   PUBLIC_PRODUKCJA = true
 */
export const produkcja = import.meta.env.PUBLIC_PRODUKCJA === "true";

/** Podgląd = wszystko, co nie jest jawnie oznaczone jako produkcja. */
export const podglad = !produkcja;
