export const site = {
  nazwa: "Owell",
  tagline: "Małe AGD zaprojektowane z myślą o codziennym użytku",

  firma: {
    nazwaPelna: "Adler Sp. z o.o.",
    nip: "[DO UZUPEŁNIENIA: NIP]",
    regon: "[DO UZUPEŁNIENIA: REGON]",
    adres: "ul. Ordona 2A, 01-237 Warszawa, Polska",
  },

  kontakt: {
    email: "biuro@adler.com.pl",
    emailSerwis: "serwis@adler.com.pl",
    emailGpsr: "gpsr@adlereurope.eu",
  },

  marketplace: {
    allegro: "#DO-UZUPELNIENIA",
    temu: "#DO-UZUPELNIENIA",
    tiktokShop: "#DO-UZUPELNIENIA",
  },

  kategorie: [
    {
      slug: "kuchnia",
      nazwa: "Kuchnia",
      opis: "Opiekacze, czajniki, blendery i inne urządzenia do codziennego przygotowywania posiłków.",
    },
    {
      slug: "pielegnacja",
      nazwa: "Pielęgnacja",
      opis: "Maszynki do włosów i strzyżarki do zwierząt.",
    },
    {
      slug: "agd-turystyczne",
      nazwa: "AGD turystyczne",
      opis: "Kompaktowe urządzenia do samochodu, kempingu i małych przestrzeni.",
    },
  ],
} as const;

export type Kategoria = (typeof site.kategorie)[number]["slug"];
