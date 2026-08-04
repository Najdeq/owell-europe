# Owell Europe — kontekst projektu

## Czym jest ta strona

Strona brandowa marki małego AGD **Owell**, dostępna pod `https://owelleurope.com`.

**To NIE jest sklep.** Sprzedaż odbywa się wyłącznie przez **jeden własny sklep internetowy** (`site.sklep`) — bez marketplace'ów i bez sprzedaży stacjonarnej. Zadaniem tej strony jest budowa wiarygodności marki i przekierowanie ruchu do sklepu. Nigdy nie dodawaj koszyka, cen, płatności ani checkoutu.

**Główny KPI:** liczba kliknięć w link do sklepu (`marketplace_click` w GA4 — nazwa zdarzenia została z czasów modelu marketplace'owego).

**Grupa docelowa:** polski kupujący, który zobaczył produkt Owell na marketplace i wpisał nazwę marki w Google, żeby sprawdzić, czy to poważna firma.

**Bieżący stan i backlog:** patrz `AUDYT.md` w katalogu głównym.

## Stack

- **Astro 7** — `output: 'static'`, zero adapterów SSR
- **Tailwind v4** przez `@tailwindcss/vite` — konfiguracja w CSS przez `@theme`, **nie ma** `tailwind.config.js`
- **TypeScript** strict
- **Fonty lokalne** przez `@fontsource-variable/*` — nigdy z Google CDN (RODO)
- **Deploy:** Cloudflare Pages z podpiętego repo (`npm run build` → `dist`), automatycznie z `git push` na `main` — instrukcja w `DEPLOY.md`
- **Node:** ≥ 22.12.0

## Struktura

```
src/
  assets/produkty/       zdjęcia produktów (przez <Image> Astro)
  components/
    ui/                  Container, Section, Button, Eyebrow, Prose
    sections/            sekcje strony głównej
    Header.astro, Footer.astro, ConsentBanner.astro,
    Analytics.astro, WhatsAppWidget.astro, ScrollReveal.astro
  content/produkty/      pliki .md produktów
  data/site.ts           dane firmy, kontakt, kategorie, link do sklepu
  layouts/Base.astro
  pages/
  styles/                tokens.css, global.css
```

## Design system — zasady bezwzględne

1. **Kolory tylko przez zmienne CSS** z `src/styles/tokens.css`. Zero hardkodowanych wartości hex w komponentach.
2. **Ciemne tło nigdy nie jest czarne.** Baza to `--bg-0: #0F0E0C` — ciepła czerń z domieszką brązu. Czysta czerń wygląda tanio i męczy oczy.
3. **Głębia przez warstwy, nie przez cienie.** Wyżej w hierarchii = jaśniejsze tło (`--bg-0` → `--bg-1` → `--bg-2` → `--bg-3`). Cienie stosuj oszczędnie i miękko.
4. **Złoto to biżuteria, nie farba.** Używaj go na: CTA, cienkie linie, ikony, akcenty nagłówków, focus ring. **Nigdy** jako tło całej sekcji ani jako kolor akapitów.
5. **Stal to drugi materiał.** `--steel` (chłodny szarobłękit) służy do danych technicznych, etykiet i mikro-tekstu w monospace. Trzymanie ciepłego złota obok chłodnej stali jest tym, co odróżnia tę stronę od generycznego „ciemne tło + jeden jaskrawy akcent".
6. **Gradient metaliczny tylko punktowo** — logo, cienka ramka, mały przycisk. Nigdy na dużej powierzchni.
7. **Dużo powietrza.** Premium to przestrzeń i powściągliwość, nie zagęszczenie.

## Typografia

| Rola | Font | Zastosowanie |
|---|---|---|
| Display | **Archivo Variable** | H1–H3. Waga 600, tracking `-0.02em`. Duże nagłówki mogą używać szerszej osi width. |
| Body | **Inter Variable** | akapity, listy, nawigacja. Waga 400/500, line-height 1.6. |
| Data | **JetBrains Mono Variable** | dane techniczne, numery modeli, eyebrow, mikro-etykiety. Uppercase + `letter-spacing: 0.08em`. |

Mono dla danych technicznych to świadoma decyzja: liczby (moc, pojemność, temperatura) należą do świata inżynierii AGD i powinny wyglądać jak odczyt z urządzenia, nie jak tekst marketingowy.

**Wszystkie trzy fonty muszą poprawnie renderować polskie znaki:** ą ć ę ł ń ó ś ź ż Ą Ć Ę Ł Ń Ó Ś Ź Ż. Przy każdej zmianie fontu sprawdź tym ciągiem.

## Ruch i animacje

Zasada: jeden wyrazisty efekt na widok, reszta cicha. Wszystko czystym CSS,
zawsze z obsługą `prefers-reduced-motion`.

Aktualnie w użyciu:
- **Flip 3D kart kategorii** na `/produkty` — `rotateY(180deg) scale(1.12)`, tył karty przewijalny. Uwaga: efekt hover, więc na dotyku niedostępny.
- **Scroll reveal** — `[data-reveal]` + `ScrollReveal.astro` (IntersectionObserver dokłada `.is-revealed`). Opcjonalne opóźnienie przez `data-reveal-delay`.
- **Count-up liczb** — Hero (od razu po wczytaniu) i sekcja Liczby (przy wejściu w viewport).
- **Crossfade karuzeli** na `/o-nas` — procenty keyframe'ów liczone w frontmatterze i wstrzykiwane przez `<style set:html>` (CSS nie przyjmuje `var()` w selektorze keyframe). Używaj **dodatnich** `animation-delay` — ujemne odwracają kolejność.

## Czego NIE robić

- ❌ koszyka, cen, checkoutu, „dodaj do koszyka"
- ❌ bibliotek animacji (GSAP, Framer Motion, AOS) — czysty CSS + minimalny JS
- ❌ ciężkiego parallaxu na całych sekcjach
- ❌ karuzeli z autoodtwarzaniem
- ❌ fontów z Google CDN
- ❌ ładowania jakiegokolwiek skryptu analitycznego przed zgodą użytkownika
- ❌ superlatyw w tekstach („najlepszy na świecie", „rewolucyjny")
- ❌ emoji w interfejsie i treściach
- ❌ zaokrągleń większych niż `--radius-lg` — miękkie, ale nie „bąbelkowe"

## Wymogi jakościowe (sprawdzane przed każdym commitem)

- **WCAG 2.2 AA** — kontrast ≥ 4.5:1 dla tekstu, ≥ 3:1 dla dużego tekstu i elementów UI; widoczny focus na każdym elemencie interaktywnym; poprawna hierarchia nagłówków; sensowne `alt`
- **Core Web Vitals** — LCP < 2,5 s · INP < 200 ms · CLS < 0,1 (mierzone na mobile)
- **Mobile-first** — projektuj od 360px w górę
- `npm run build` musi przechodzić bez błędów i ostrzeżeń

## Zgodność prawna — nie do pominięcia

| Wymóg | Co to znaczy w kodzie |
|---|---|
| **GPSR** (Rozp. UE 2023/988) | Każdy produkt musi mieć na karcie: nazwę producenta, adres pocztowy, adres e-mail, a przy produkcji spoza UE — dane osoby odpowiedzialnej w UE. Plus strona `/bezpieczenstwo-produktu`. |
| **RODO** | Polityka prywatności, brak zewnętrznych zasobów wysyłających IP bez zgody (stąd fonty lokalne). |
| **Consent Mode v2** | Domyślnie wszystko `denied`. GA4 wstrzykiwany dynamicznie **dopiero po zgodzie** — nie wystarczy flaga. |
| **EAA / dostępność** | WCAG 2.2 AA + strona `/deklaracja-dostepnosci`. Obowiązuje od 28.06.2025. |
| **Dane rejestrowe** | Nazwa, adres, NIP, REGON w stopce, ciągnięte z `src/data/site.ts`. |

Nigdy nie usuwaj bloku GPSR z karty produktu „bo brzydko wygląda". Zaprojektuj go tak, żeby wyglądał dobrze.

## Ton tekstów

Rzeczowy, spokojny, konkretny. Krótkie zdania. Więcej dowodów niż przymiotników. Wzorce: Balmuda, Fellow Products — spokojna pewność siebie zamiast krzyku.

Przyciski nazywaj czynnością, która nastąpi: „Zobacz na Allegro", nie „Kliknij tutaj". Ta sama akcja ma tę samą nazwę w całym serwisie.

Komunikaty błędów mówią, co się stało i co zrobić dalej. Nie przepraszają i nie są ogólnikowe.

## Konwencje

- Komponenty: PascalCase (`ProductCard.astro`)
- Strony i slugi: kebab-case, po polsku (`/gdzie-kupic`, `/bezpieczenstwo-produktu`)
- Klucze w `site.ts`: camelCase
- Każde miejsce wymagające decyzji właściciela oznaczaj jako `[DO UZUPEŁNIENIA: opis]` — nigdy nie wymyślaj danych firmy, NIP-ów, dat założenia ani liczb
- Wszystkie linki zewnętrzne: `target="_blank" rel="noopener noreferrer"` + atrybut `data-marketplace` na linkach do platform sprzedażowych

## Komendy

```bash
npm run dev      # serwer deweloperski, localhost:4321
npm run build    # build produkcyjny do dist/
npm run preview  # podgląd builda lokalnie
```

Deploy: `git push` na `main` → Cloudflare Pages buduje i wdraża automatycznie.

**Indeksowanie jest domyślnie zablokowane** (`robots.txt` + meta noindex).
Włącza je dopiero zmienna `PUBLIC_PRODUKCJA=true`, ustawiana wyłącznie na
docelowej domenie. Szczegóły: `DEPLOY.md`.
