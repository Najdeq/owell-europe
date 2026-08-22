export const site = {
  nazwa: "Owell",
  tagline: "Małe AGD zaprojektowane z myślą o codziennym użytku",

  firma: {
    nazwaPelna: "Owell Sp. z o.o.",
    nip: "7792594644",
    regon: "542783519",
    adres: "ul. Gąsiorowskich 6, 60-704 Poznań, Polska",
  },

  kontakt: {
    email: "sklep@owelleurope.com",
    emailSerwis: "serwis@owelleurope.com",
    emailGpsr: "gpsr@adlereurope.eu",
    whatsapp: "+48 537 899 499",
    // Numer do linku wa.me — same cyfry, bez spacji i znaku "+" (wymóg formatu wa.me).
    whatsappWa: "48537899499",
    godzinyPracy: "9:00–17:00",
  },

  gwarancjaMiesiace: 24,

  // Adres własnego sklepu internetowego. `null` = sklep jeszcze nie wystartował.
  // Po wykupieniu domeny wystarczy wpisać tu URL — reszta strony zadziała sama.
  sklep: null as string | null,

  // Sklep na Allegro — DZIŚ to jedyny działający kanał sprzedaży, więc strona
  // musi go wskazywać jako oficjalny. Do czasu uruchomienia własnego sklepu
  // wszystkie CTA „Gdzie kupić" prowadzą właśnie tutaj.
  //
  // UWAGA na przyszłość: nie wolno wrócić do formuł typu „sprzedajemy wyłącznie
  // przez własny sklep" ani ostrzegać przed ofertami na innych platformach,
  // dopóki Allegro jest aktywne — taki tekst podważa wiarygodność własnych
  // aukcji u klienta, który trafia tu właśnie z Allegro, żeby sprawdzić markę.
  allegro: "https://allegro.pl/uzytkownik/Owell" as string | null,

  // Skala i doświadczenie produkcyjne stojące za marką Owell — liczby
  // przekazane przez właściciela. Decyzja: prezentujemy je wprost jako
  // dorobek Owella, bez nazywania osobnej grupy produkcyjnej.
  grupa: {
    lataHistorii: 35,
    odRokuWPolsce: 2002,
    liczbaProduktow: 1200,
    liczbaKrajow: 60,

    // Kraje zaznaczane na mapie zasięgu (MapaZasiegu.astro). Klucze muszą
    // odpowiadać nazwom z src/data/mapa-swiata.json (angielskie, z Natural
    // Earth) — obok podajemy polską nazwę do wyświetlenia.
    //
    // Pusta lista = sekcja w ogóle się nie renderuje, żeby nie pokazywać
    // pustej mapy.
    // Mapa obejmuje Europę, Turcję i Afrykę Północną — deklarowane „ponad 60
    // krajów" jest szersze niż to, co da się z niej wyczytać, dlatego podpis
    // pod mapą mówi, ile krajów zaznaczono, i nie udaje pełnej listy.
    rynki: [
      { mapa: "Poland", nazwa: "Polska" },
      { mapa: "Germany", nazwa: "Niemcy" },
      { mapa: "Czechia", nazwa: "Czechy" },
      { mapa: "Slovakia", nazwa: "Słowacja" },
      { mapa: "Hungary", nazwa: "Węgry" },
      { mapa: "Austria", nazwa: "Austria" },
      { mapa: "Switzerland", nazwa: "Szwajcaria" },
      { mapa: "France", nazwa: "Francja" },
      { mapa: "Belgium", nazwa: "Belgia" },
      { mapa: "Netherlands", nazwa: "Holandia" },
      { mapa: "Luxembourg", nazwa: "Luksemburg" },
      { mapa: "United Kingdom", nazwa: "Wielka Brytania" },
      { mapa: "Ireland", nazwa: "Irlandia" },
      { mapa: "Iceland", nazwa: "Islandia" },
      { mapa: "Norway", nazwa: "Norwegia" },
      { mapa: "Sweden", nazwa: "Szwecja" },
      { mapa: "Finland", nazwa: "Finlandia" },
      { mapa: "Denmark", nazwa: "Dania" },
      { mapa: "Estonia", nazwa: "Estonia" },
      { mapa: "Latvia", nazwa: "Łotwa" },
      { mapa: "Lithuania", nazwa: "Litwa" },
      { mapa: "Belarus", nazwa: "Białoruś" },
      { mapa: "Ukraine", nazwa: "Ukraina" },
      { mapa: "Moldova", nazwa: "Mołdawia" },
      { mapa: "Romania", nazwa: "Rumunia" },
      { mapa: "Bulgaria", nazwa: "Bułgaria" },
      { mapa: "Slovenia", nazwa: "Słowenia" },
      { mapa: "Croatia", nazwa: "Chorwacja" },
      { mapa: "Bosnia and Herz.", nazwa: "Bośnia i Hercegowina" },
      { mapa: "Serbia", nazwa: "Serbia" },
      { mapa: "Montenegro", nazwa: "Czarnogóra" },
      { mapa: "Kosovo", nazwa: "Kosowo" },
      { mapa: "Macedonia", nazwa: "Macedonia Północna" },
      { mapa: "Albania", nazwa: "Albania" },
      { mapa: "Greece", nazwa: "Grecja" },
      { mapa: "Italy", nazwa: "Włochy" },
      { mapa: "Spain", nazwa: "Hiszpania" },
      { mapa: "Portugal", nazwa: "Portugalia" },
      { mapa: "Turkey", nazwa: "Turcja" },
      { mapa: "Cyprus", nazwa: "Cypr" },
      { mapa: "Morocco", nazwa: "Maroko" },
      { mapa: "Algeria", nazwa: "Algieria" },
      { mapa: "Tunisia", nazwa: "Tunezja" },
    ] as { mapa: string; nazwa: string }[],
  },

  // Profile w mediach społecznościowych / inne oficjalne strony marki —
  // schema.org Organization.sameAs.
  sameAs: [
    "https://www.instagram.com/owelleurope.eu/",
    "https://www.tiktok.com/@owelleurope.eu",
  ] as string[],

  kategorie: [
    {
      slug: "kuchnia",
      nazwa: "Kuchnia",
      opis: "Opiekacze, czajniki, blendery i drobny sprzęt do gotowania — urządzenia, których używasz codziennie, nie od święta. Prosta obsługa i materiały odporne na częste mycie.",
    },
    {
      slug: "pielegnacja",
      nazwa: "Pielęgnacja",
      opis: "Maszynka do włosów i strzyżarka do zwierząt — sprzęt do regularnej pielęgnacji w domu. Ostrza i akumulator dobrane pod kątem częstego użytku, nie jednorazowego zabiegu.",
    },
    {
      slug: "agd-turystyczne",
      nazwa: "AGD turystyczne",
      opis: "Lodówka turystyczna i pralko-wirówka — kompaktowe urządzenia do samochodu, kempingu i małych przestrzeni. Mniejsze niż sprzęt domowy, ale zaprojektowane z tą samą uwagą na trwałość.",
    },
    {
      slug: "dom",
      nazwa: "Dom",
      opis: "Grzejnik, czyścik parowy i koce elektryczne — sprzęt do codziennego komfortu w domu, poza kuchnią i pielęgnacją.",
    },
  ],

  opinie: [] as Opinia[],
} as const;

export type Kategoria = (typeof site.kategorie)[number]["slug"];

export interface Opinia {
  cytat: string;
  autor: string;
  zrodlo: "Allegro" | "Google" | "Ceneo";
  data: string;
  zweryfikowany?: boolean;
}
