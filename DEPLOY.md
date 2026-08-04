# Wdrożenie

## Podgląd na Cloudflare Pages (bez własnej domeny)

Cloudflare Pages daje darmowy adres `*.pages.dev` — **własna domena nie jest
potrzebna**. To ten adres wysyłasz osobom do obejrzenia strony.

### Konfiguracja (jednorazowo, ~3 minuty)

1. Wejdź na [dash.cloudflare.com](https://dash.cloudflare.com) → załóż konto
   lub zaloguj się.
2. Menu po lewej: **Workers & Pages** → **Create** → zakładka **Pages** →
   **Connect to Git**.
3. Autoryzuj GitHuba i wybierz repozytorium **`Najdeq/owell-europe`**.
4. W ustawieniach builda wpisz:

   | Pole | Wartość |
   |------|---------|
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Production branch | `main` |

5. **Save and Deploy.**

Po ~2 minutach dostajesz adres w rodzaju `owell-europe.pages.dev`.
Każdy `git push` na `main` automatycznie buduje nową wersję — nie trzeba
niczego wgrywać ręcznie.

### Zmienne środowiskowe

W **Settings → Environment variables** dodaj:

| Zmienna | Wartość | Po co |
|---------|---------|-------|
| `PUBLIC_GA_ID` | `G-VJFGPED4P8` | Google Analytics (ładuje się dopiero po zgodzie) |

`PUBLIC_PRODUKCJA` **zostaw nieustawioną** — patrz niżej.

---

## Indeksowanie w Google — uwaga

Domyślnie **każde wdrożenie blokuje wyszukiwarki**: `robots.txt` zwraca
`Disallow: /`, a każda strona ma `<meta name="robots" content="noindex">`.

Indeksowanie włącza dopiero zmienna:

```
PUBLIC_PRODUKCJA = true
```

Ustaw ją **wyłącznie** na docelowej domenie produkcyjnej. Dopóki adres to
`*.pages.dev`, zostaw ją wyłączoną.

Powód: zaindeksowany adres podglądu konkuruje w Google z docelową domeną
i potrafi tam zostać tygodniami — także po usunięciu podglądu. Pomyłka
w stronę „za dużo blokad" naprawia się w minutę, w drugą stronę nie.

Logika: `src/data/deploy.ts`, `src/pages/robots.txt.ts`.

---

## Podpięcie własnej domeny (później)

1. Cloudflare Pages → projekt → **Custom domains** → **Set up a domain**.
2. Wpisz `owelleurope.com`.
3. Cloudflare poda rekordy DNS do ustawienia w panelu **nazwa.pl**
   (tam obecnie stoi domena — dziś pokazuje stronę parkingową).
4. Po przepięciu domeny ustaw `PUBLIC_PRODUKCJA=true` i zrób redeploy.

---

## Przed publicznym uruchomieniem

- [ ] `site.sklep` w `src/data/site.ts` — obecnie `null`, przez co CTA kierują
      na WhatsApp z komunikatem „sklep w przygotowaniu"
- [ ] Pozostałe `[DO UZUPEŁNIENIA]` — okres retencji danych w polityce
      prywatności, data deklaracji dostępności
- [ ] `PUBLIC_PRODUKCJA=true` dopiero po przepięciu docelowej domeny

Pełna lista otwartych zadań: `AUDYT.md`.
