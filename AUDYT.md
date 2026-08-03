# Audyt strony Owell Europe

Data: 2026-08-03 · Ocena w chwili audytu: **6,8/10**

## Status realizacji

| # | Zadanie | Status |
|---|---------|--------|
| 1 | `site.sklep` | ⏳ czeka na domenę — CTA tymczasowo kierują na WhatsApp/mail, zero martwych linków |
| 2 | Niepotwierdzone liczby | ✅ zastąpione danymi weryfikowalnymi |
| 3 | Strony produktowe | ✅ 10 stron `/produkty/[model]` |
| 4 | Wyszukiwarka po modelu | ✅ na `/produkty` i `/wsparcie` |
| 5 | LCP (poster, eager logo) | ✅ |
| 6 | Schema Product + FAQPage | ✅ |
| 7 | Rejestracja produktu → +12 mies. | ⬜ decyzja biznesowa |

Cel strony: budowanie wiarygodności marki dla kogoś, kto zobaczył produkt Owell
na marketplace i sprawdza w Google, czy to prawdziwa firma. To NIE jest sklep.

---

## Oceny etapowe

| # | Etap | Ocena | Główny problem |
|---|------|-------|----------------|
| 1 | Struktura i nawigacja | 8/10 | Brak stron produktowych i wyszukiwarki po modelu |
| 2 | Treść i copywriting | 7/10 | 12 miejsc `[DO UZUPEŁNIENIA]` |
| 3 | Design wizualny | 8/10 | Video bez `poster` |
| 4 | **Wiarygodność i zaufanie** | **5/10** | 5 niepotwierdzonych liczb |
| 5 | **Konwersja** | **3/10** | `site.sklep` = martwy link |
| 6 | SEO i dane strukturalne | 6/10 | Brak schema Product i FAQPage |
| 7 | Wydajność | 7/10 | Logo `loading="lazy"` nad linią zagięcia |
| 8 | Dostępność | 8/10 | — |
| 9 | Zgodność prawna | 9/10 | — (najmocniejsza część) |
| 10 | Mobile | 7/10 | Flip 3D niedostępny na dotyku |

---

## Backlog wg priorytetu

### 🔴 1. Uzupełnić `site.sklep`
`src/data/site.ts` → `sklep: "#DO-UZUPELNIENIA"`.
Wszystkie CTA „Gdzie kupić" (header, hero, menu mobilne, sekcja CTA, stopka,
`/gdzie-kupic`) prowadzą donikąd. To samo `gdzieKupic` w 10 plikach
`src/content/produkty/*.md`.
**Blokada:** potrzebny realny URL sklepu.

### 🔴 2. Zweryfikować lub usunąć 5 niepotwierdzonych liczb
Strona z hasłem „Marka AGD, którą można sprawdzić" podaje liczby, których
sprawdzić się nie da. Jedna wprost przeczy innej sekcji.

| Plik | Liczba | Uwaga |
|------|--------|-------|
| `sections/Liczby.astro` | 100 tys.+ sprzedanych urządzeń | brak źródła |
| `sections/Liczby.astro` | 4.8 średnia ocena | brak źródła |
| `sections/Liczby.astro` | 95 tys.+ obsłużonych zamówień | brak źródła |
| `sections/Dlaczego.astro` | 15 lat doświadczenia | sprzeczne z „2025 rok założenia" w Hero |
| `sections/Dlaczego.astro` | 23 rynki w UE | brak źródła |

**Rekomendacja:** zamienić na fakty weryfikowalne (CE, GPSR, deklaracje
zgodności, 24 mies. gwarancji, liczba modeli) — ten sam efekt zaufania,
zero ryzyka.
**Blokada:** decyzja, które wartości są prawdziwe.

### 🟠 3. Strony produktowe `/produkty/[model]`
Dane są już w kolekcji (`src/content/produkty/*.md`): specyfikacja, wyróżniki,
GPSR, instrukcja PDF. Brakuje tylko szablonu. Każda strona = osobny wynik
w Google + realne zakończenie ścieżki „sprawdzam markę".

### 🟠 4. Wyszukiwarka po numerze modelu
Klient trzyma pudełko z „OW 3300" i szuka. Dziś nie znajdzie nic.
To dokładnie scenariusz, dla którego powstała ta strona.

### 🟡 5. Wydajność (LCP)
- `<video>` w Hero bez `poster` → pusta ramka do czasu pobrania 2,7 MB.
- Logo w headerze ma `loading="lazy"` mimo że jest nad linią zagięcia.
- Żaden obraz nie ma `fetchpriority="high"` (5/5 obrazów na home = lazy).
- Video 2,7 MB `autoplay` odpala się też na komórce.

### 🟡 6. Dane strukturalne
- Brak schema `Product` na produktach (10 produktów z gotowymi danymi).
- Brak `FAQPage` na `/faq` (8 pytań marnuje się bez rich snippet).

### 🟢 7. Rejestracja produktu → +12 mies. gwarancji
Wzorzec od Boscha i Philipsa: 24 → 36 mies. po rejestracji.
Daje powód do wizyty na stronie-wizytówce bez e-commerce, buduje bazę
klientów, wyróżnia na tle Adlera (który tego nie ma).

---

## Pozostałe `[DO UZUPEŁNIENIA]`
- `polityka-prywatnosci.astro` — okres retencji danych, inni odbiorcy danych
- `deklaracja-dostepnosci.astro` — data deklaracji, pozostałe ograniczenia
- `bezpieczenstwo-produktu.astro` — aktualne działania serwisowe / wycofania
- `/produkty` — 4 kategorie bez produktu (grzejnik, blender kielichowy,
  czyścik parowy, koce elektryczne)
- 4 kategorie bez zdjęcia (OW 4819, OW 2856, OW 2859, OW 8058)

---

## Research konkurencji

### Adler Europe (spółka-matka)
Design przestarzały, ale funkcjonalnie kompletny: 7 kategorii z podkategoriami,
wyszukiwarka po numerze modelu, karta produktu z instrukcją PDF, sekcja
„Do pobrania" (katalog PDF, zdjęcia hi-res dla dystrybutorów), lokalizator
sklepów, aktualności z targów IFA, ekspozycja atestów i certyfikatów.

### Bosch / Philips
Obie marki: **rejestracja produktu → przedłużona gwarancja**
(Bosch +1 rok przy rejestracji w 4 tygodnie, Philips konto MyPhilips).

### Wniosek
Owell wygląda **lepiej** od konkurencji, ale konkurencja ma **funkcje**,
których Owell nie ma: wyszukiwarkę modelu, strony produktowe, instrukcje
do pobrania, rejestrację produktu. Dla celu „klient sprawdza markę" brak
strony produktowej dla modelu z pudełka to krytyczna luka.

### Źródła
- https://www.adler.com.pl/index.php/Main/Onas
- https://www.adler.com.pl/index.php/Main/Produkty/29
- https://www.bosch-home.pl/serwis/gwarancja/gwarancja-producenta
- https://www.philips.pl/c-w/wsparcie-konsumenta/gwarancja/warranty-pe.html
