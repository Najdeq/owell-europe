/**
 * Kategorie sprzętu pokazywane na /produkty i jako osobne strony
 * /produkty/kategoria/[slug].
 *
 * `produkty` to lista identyfikatorów z kolekcji `produkty` (nazwy plików
 * w src/content/produkty). Pusta lista = kategoria zapowiedziana, ale bez
 * modeli w ofercie — na siatce dostaje kafelek „Wkrótce w ofercie".
 *
 * Kategoria jest celowo osobnym bytem od pola `kategoria` w pliku produktu:
 * tamto opisuje grupę (kuchnia / pielęgnacja / AGD turystyczne / dom),
 * a to — konkretny typ urządzenia, po którym klient faktycznie szuka.
 */
export interface Kategoria {
  slug: string;
  nazwa: string;
  grupa: string;
  opis: string;
  produkty: string[];
}

export const kategorie: Kategoria[] = [
  {
    slug: "czajnik-elektryczny",
    nazwa: "Czajnik elektryczny",
    grupa: "kuchnia",
    opis: "Szybkie gotowanie wody z regulacją temperatury — do kawy, herbaty i innych naparów.",
    produkty: ["ow-1360b", "ow-1360w"],
  },
  {
    slug: "rozdrabniacze-i-szatkownice",
    nazwa: "Rozdrabniacze i szatkownice",
    grupa: "kuchnia",
    opis: "Krojenie, szatkowanie i rozdrabnianie warzyw i owoców bez ręcznej pracy.",
    produkty: ["ow-4819"],
  },
  {
    slug: "blender-reczny",
    nazwa: "Blender ręczny",
    grupa: "kuchnia",
    opis: "Miksowanie, ubijanie i rozdrabnianie w jednym urządzeniu, bez wielu sprzętów na blacie.",
    produkty: ["ow-4634"],
  },
  {
    slug: "blender-kielichowy",
    nazwa: "Blender kielichowy",
    grupa: "kuchnia",
    opis: "Przygotowywanie smoothie, koktajli i zup w jednym naczyniu.",
    produkty: ["ow-4096"],
  },
  {
    slug: "opiekacz-do-kanapek",
    nazwa: "Opiekacz do kanapek",
    grupa: "kuchnia",
    opis: "Opiekanie kanapek i tostów w kilka minut, bez patelni i pilnowania.",
    produkty: ["ow-3300", "ow-3097"],
  },
  {
    slug: "maszynka-do-strzyzenia-wlosow",
    nazwa: "Maszynka do strzyżenia włosów",
    grupa: "pielegnacja",
    opis: "Strzyżenie włosów w domu, między wizytami u fryzjera.",
    produkty: ["ow-2856"],
  },
  {
    slug: "strzyzarka-dla-zwierzat",
    nazwa: "Strzyżarka dla zwierząt",
    grupa: "pielegnacja",
    opis: "Pielęgnacja sierści psów i kotów w domowych warunkach.",
    produkty: ["ow-2859"],
  },
  {
    slug: "lodowka-turystyczna",
    nazwa: "Lodówka turystyczna",
    grupa: "agd-turystyczne",
    opis: "Chłodzenie i utrzymywanie temperatury w podróży, zasilana z gniazda 12V lub 230V.",
    produkty: ["ow-8805"],
  },
  {
    slug: "pralko-wirowka-turystyczna",
    nazwa: "Pralko-wirówka turystyczna",
    grupa: "agd-turystyczne",
    opis: "Pranie i odwirowywanie w małych ilościach — do kempingu, przyczepy lub małych przestrzeni.",
    produkty: ["ow-8058"],
  },
  {
    slug: "grzejnik-elektryczny",
    nazwa: "Grzejnik elektryczny",
    grupa: "dom",
    opis: "Dogrzewanie pomieszczeń w chłodniejsze dni, bez instalacji i bez czekania.",
    produkty: ["ow-7832", "ow-7833", "ow-7834"],
  },
  {
    slug: "czyscik-parowy",
    nazwa: "Czyścik parowy",
    grupa: "dom",
    opis: "Czyszczenie powierzchni parą, bez chemii i szorowania.",
    produkty: ["ow-7101"],
  },
  {
    slug: "koce-i-poduszki-elektryczne",
    nazwa: "Koce i poduszki elektryczne",
    grupa: "dom",
    opis: "Ogrzewanie łóżka i ciała zimą, z regulacją temperatury.",
    produkty: ["ow-7449", "ow-7450"],
  },
];
