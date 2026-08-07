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

## Panel CMS (/admin) — samodzielna publikacja wpisów na blogu

Panel to [Decap CMS](https://decapcms.org) (dawniej Netlify CMS) — edytuje
pliki `.md` w `src/content/blog/` wprost w repozytorium na GitHubie, przez
commit. Bez osobnej bazy danych: to, co widać w panelu, to dokładnie to,
co jest w repo.

**Kto może się zalogować:** każdy, kto ma dostęp do zapisu w repozytorium
`Najdeq/owell-europe` na GitHubie (właściciel + collaboratorzy). Panel nie
ma własnej listy użytkowników — dodanie/odebranie komuś dostępu do bloga
to dodanie/odebranie mu dostępu do repo w ustawieniach GitHuba.

### Konfiguracja (jednorazowo, ~5 minut)

1. **Utwórz aplikację OAuth na GitHubie:**
   [github.com/settings/developers](https://github.com/settings/developers)
   → **OAuth Apps** → **New OAuth App**.

   | Pole | Wartość |
   |------|---------|
   | Application name | `Owell CMS` (dowolna) |
   | Homepage URL | `https://owell-europe.dnajdul.workers.dev` |
   | Authorization callback URL | `https://owell-europe.dnajdul.workers.dev/api/decap/callback` |

2. Po utworzeniu: skopiuj **Client ID**, kliknij **Generate a new client
   secret** i skopiuj **Client Secret** (widoczny tylko raz).

3. W Cloudflare, w ustawieniach projektu (**Settings → Variables and
   Secrets** dla Workers / **Environment variables** dla Pages) dodaj:

   | Zmienna | Wartość | Typ |
   |---------|---------|-----|
   | `GITHUB_OAUTH_ID` | Client ID z kroku 2 | zwykła |
   | `GITHUB_OAUTH_SECRET` | Client Secret z kroku 2 | **Secret** (szyfrowana) |

   `GITHUB_OAUTH_SECRET` koniecznie jako Secret — inaczej byłby widoczny
   w panelu Cloudflare w postaci jawnej.

4. Redeploy (albo poczekaj na najbliższy `git push`), potem wejdź na
   `/admin/` i zaloguj się przez GitHuba.

### Przy zmianie domeny na docelową

Trzy miejsca do zaktualizowania jednocześnie — pominięcie któregoś
skutkuje błędem logowania:

- `public/admin/config.yml` — `base_url`, `site_url`, `display_url`
- aplikacja OAuth na GitHubie — Homepage URL i Authorization callback URL
- nic więcej: `/api/decap/auth` i `/api/decap/callback` budują adresy
  z bieżącego `url.origin`, więc same się dostosowują

### Jak to działa (dla porządku)

`src/pages/api/decap/auth.ts` i `callback.ts` implementują standardowy
handshake OAuth GitHuba, którego wymaga Decap CMS: `auth` przekierowuje do
ekranu zgody GitHuba (z `state` w ciasteczku HttpOnly jako ochroną przed
CSRF), `callback` wymienia zwrócony kod na token **po stronie serwera**
(sekret nigdy nie trafia do przeglądarki) i odsyła go do okna panelu przez
`postMessage`. To jedyne dwie trasy w całym serwisie z `prerender = false`
— działają na żądanie, reszta strony zostaje w pełni statyczna.

---

## Przed publicznym uruchomieniem

- [ ] `site.sklep` w `src/data/site.ts` — obecnie `null`, przez co CTA kierują
      na WhatsApp z komunikatem „sklep w przygotowaniu"
- [ ] Pozostałe `[DO UZUPEŁNIENIA]` — okres retencji danych w polityce
      prywatności, data deklaracji dostępności
- [ ] `PUBLIC_PRODUKCJA=true` dopiero po przepięciu docelowej domeny
- [ ] `GITHUB_OAUTH_ID` / `GITHUB_OAUTH_SECRET` w Cloudflare, żeby panel
      `/admin` działał — patrz sekcja „Panel CMS" wyżej

Pełna lista otwartych zadań: `AUDYT.md`.
