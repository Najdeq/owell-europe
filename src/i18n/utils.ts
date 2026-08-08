import { ui, domyslnyJezyk, type Jezyk } from "./ui.ts";

export function getLangFromUrl(url: URL): Jezyk {
  const [, mozliwyJezyk] = url.pathname.split("/");
  if (mozliwyJezyk in ui) return mozliwyJezyk as Jezyk;
  return domyslnyJezyk;
}

function pobierz(sciezka: string, lang: Jezyk): unknown {
  let wartosc: unknown = ui[lang];
  for (const czesc of sciezka.split(".")) {
    wartosc = (wartosc as Record<string, unknown> | undefined)?.[czesc];
  }
  return wartosc;
}

/**
 * `t("hero.tytul")` zamiast `ui[lang].hero.tytul` — zwraca polski tekst,
 * gdy dany klucz nie ma jeszcze tłumaczenia w danym języku (rozjazd
 * słownika nie wywala strony, tylko cichnie pokazuje PL w tym miejscu).
 */
export function useTranslations(lang: Jezyk) {
  function t(sciezka: string): string {
    const wartosc = pobierz(sciezka, lang);
    if (typeof wartosc === "string") return wartosc;
    const fallback = pobierz(sciezka, domyslnyJezyk);
    return typeof fallback === "string" ? fallback : sciezka;
  }

  // Wariant dla wartości nie-tekstowych (np. { nazwa, opis } dla podkategorii).
  function tRaw<T>(sciezka: string): T | undefined {
    const wartosc = pobierz(sciezka, lang);
    if (wartosc !== undefined) return wartosc as T;
    return pobierz(sciezka, domyslnyJezyk) as T | undefined;
  }

  return Object.assign(t, { raw: tRaw });
}