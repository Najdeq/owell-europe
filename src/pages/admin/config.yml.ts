import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

/**
 * Konfiguracja panelu Decap CMS — /admin/config.yml. Dokumentacja:
 * https://decapcms.org/docs/configuration-options/
 *
 * Generowana przy buildzie (dawniej statyczny public/admin/config.yml), bo
 * pole „Produkty pod wpisem" to lista wyboru z AKTUALNEGO katalogu — każdy
 * nowy produkt pojawia się w panelu sam, bez ręcznej edycji listy.
 *
 * Pola muszą odpowiadać schematowi kolekcji `blog` w src/content.config.ts.
 * Pole, którego panel nie zna, może zniknąć z pliku przy zapisie wpisu
 * w panelu — dlatego tytulSeo i produkty (dodane po uruchomieniu panelu)
 * są tu jawnie.
 *
 * UWAGA przy zmianie domeny na docelową: zaktualizuj `base_url`, `site_url`
 * i `display_url` poniżej ORAZ redirect URI w aplikacji OAuth na GitHubie —
 * patrz DEPLOY.md, sekcja „Panel CMS".
 */
export const GET: APIRoute = async () => {
  const produkty = (await getCollection("produkty"))
    .filter((p) => p.data.opublikowany)
    .sort((a, b) => a.data.model.localeCompare(b.data.model, "pl", { numeric: true }))
    .map((p) => ({ label: `${p.data.model} — ${p.data.tagline}`, value: p.id }));

  // YAML jest nadzbiorem JSON, więc listę opcji i teksty z cudzysłowami
  // wstawiamy jako JSON — bez ręcznego escapowania.
  const j = (v: unknown) => JSON.stringify(v);

  const yaml = `# Plik generowany przy buildzie — źródło: src/pages/admin/config.yml.ts
backend:
  name: github
  repo: Najdeq/owell-europe
  branch: main
  base_url: https://owell-europe.dnajdul.workers.dev
  auth_endpoint: api/decap/auth

site_url: https://owell-europe.dnajdul.workers.dev
display_url: https://owell-europe.dnajdul.workers.dev

media_folder: "public/blog"
public_folder: "/blog"

collections:
  - name: "blog"
    label: "Blog"
    label_singular: "Wpis"
    folder: "src/content/blog"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    identifier_field: tytul
    summary: "{{tytul}} — {{opublikowany}}"
    fields:
      - { label: "Tytuł", name: "tytul", widget: "string" }
      - label: "Krótki tytuł dla Google (opcjonalnie)"
        name: "tytulSeo"
        widget: "string"
        required: false
        hint: ${j("Do ok. 60 znaków — tyle Google pokazuje w wynikach. Puste = pełny tytuł + „— Owell”. Nagłówek na stronie zawsze używa pełnego tytułu.")}
      - { label: "Opis (pod tytułem i w meta description)", name: "opis", widget: "text" }
      - { label: "Data publikacji", name: "data", widget: "datetime", format: "YYYY-MM-DD" }
      - { label: "Zdjęcie okładkowe", name: "okladka", widget: "image", required: false }
      - { label: "Autor", name: "autor", widget: "string", default: "Owell" }
      - { label: "Tagi", name: "tagi", widget: "list", required: false, default: [] }
      - label: "Produkty pod wpisem"
        name: "produkty"
        widget: "select"
        multiple: true
        required: false
        default: []
        hint: ${j("Karty wybranych produktów pokażą się pod treścią wpisu, a na stronach tych produktów — ramka z linkiem do poradnika.")}
        options: ${j(produkty)}
      - label: "Opublikowany"
        name: "opublikowany"
        widget: "boolean"
        default: false
        hint: "Wyłączone = wpis widoczny tylko w panelu, nie na żywej stronie."
      - { label: "Treść", name: "body", widget: "markdown" }
`;

  return new Response(yaml, { headers: { "Content-Type": "text/yaml; charset=utf-8" } });
};
