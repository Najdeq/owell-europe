/**
 * Zmienne środowiskowe Workera (GITHUB_OAUTH_ID / GITHUB_OAUTH_SECRET) dla
 * logowania do panelu CMS.
 *
 * Od Astro 6 adapter Cloudflare nie udostępnia ich już przez
 * `Astro.locals.runtime.env` — samo odwołanie rzuca wyjątek, przez co oba
 * endpointy zwracały pustą odpowiedź 500. Właściwe źródło to moduł
 * `cloudflare:workers`. Import jest dynamiczny i w try/catch, bo w `astro dev`
 * (gdzie adapter celowo nie jest podpięty — patrz astro.config.mjs) ten moduł
 * nie istnieje; wtedy endpoint zwróci czytelny komunikat o braku zmiennych.
 *
 * Plik zaczyna się od `_`, więc Astro nie traktuje go jako trasy.
 */
export async function envOAuth(): Promise<{ clientId?: string; clientSecret?: string }> {
  try {
    const { env } = (await import("cloudflare:workers")) as { env: Record<string, string | undefined> };
    return { clientId: env.GITHUB_OAUTH_ID, clientSecret: env.GITHUB_OAUTH_SECRET };
  } catch {
    return {};
  }
}
