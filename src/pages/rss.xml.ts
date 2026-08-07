import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../data/site.ts";

export const GET: APIRoute = async (context) => {
  const wszystkie = await getCollection("blog", (w) => w.data.opublikowany);
  const wpisy = wszystkie.sort((a, b) => b.data.data.valueOf() - a.data.data.valueOf());

  return rss({
    title: `${site.nazwa} — Blog`,
    description:
      "Poradniki i informacje o małym AGD: jak dbać o sprzęt, na co zwracać uwagę przy zakupie, jak działają certyfikaty bezpieczeństwa.",
    site: context.site!,
    items: wpisy.map((w) => ({
      title: w.data.tytul,
      description: w.data.opis,
      pubDate: w.data.data,
      link: `/blog/${w.id}/`,
      categories: w.data.tagi,
    })),
    customData: `<language>pl-pl</language>`,
  });
};
