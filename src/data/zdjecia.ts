import fotoOw1360b from "../assets/produkty/hero/ow-1360b.jpg";
import fotoOw1360w from "../assets/produkty/hero/ow-1360w.jpg";
import fotoOw2856 from "../assets/produkty/hero/ow-2856.jpg";
import fotoOw2859 from "../assets/produkty/hero/ow-2859.jpg";
import fotoOw3097 from "../assets/produkty/hero/ow-3097.jpg";
import fotoOw3300 from "../assets/produkty/hero/ow-3300.jpg";
import fotoOw4634 from "../assets/produkty/hero/ow-4634.jpg";
import fotoOw4819 from "../assets/produkty/hero/ow-4819.jpg";
import fotoOw8058 from "../assets/produkty/hero/ow-8058.jpg";
import fotoOw8805 from "../assets/produkty/hero/ow-8805.jpg";
import fotoOw7832 from "../assets/produkty/hero/ow-7832.jpg";
import fotoOw7833 from "../assets/produkty/hero/ow-7833.jpg";
import fotoOw7834 from "../assets/produkty/hero/ow-7834.jpg";
import fotoOw7101 from "../assets/produkty/hero/ow-7101.jpg";
import fotoOw7449 from "../assets/produkty/hero/ow-7449.jpg";
import fotoOw7450 from "../assets/produkty/hero/ow-7450.jpg";

/**
 * Zdjęcia produktów pod identyfikatorem z kolekcji. Trzymamy je w jednym
 * module, bo potrzebują ich trzy strony (katalog, kategoria, produkt),
 * a `import` obrazu musi być statyczny — Astro/Vite nie potrafi rozwiązać
 * ścieżki budowanej w locie ze zmiennej.
 */
export const zdjecia: Record<string, ImageMetadata> = {
  "ow-1360b": fotoOw1360b,
  "ow-1360w": fotoOw1360w,
  "ow-2856": fotoOw2856,
  "ow-2859": fotoOw2859,
  "ow-3097": fotoOw3097,
  "ow-3300": fotoOw3300,
  "ow-4634": fotoOw4634,
  "ow-4819": fotoOw4819,
  "ow-8058": fotoOw8058,
  "ow-8805": fotoOw8805,
  "ow-7832": fotoOw7832,
  "ow-7833": fotoOw7833,
  "ow-7834": fotoOw7834,
  "ow-7101": fotoOw7101,
  "ow-7449": fotoOw7449,
  "ow-7450": fotoOw7450,
};
