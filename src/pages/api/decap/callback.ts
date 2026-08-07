import type { APIRoute } from "astro";

export const prerender = false;

/** Ucieczka danych wstrzykiwanych do inline-scriptu odpowiedzi — token */
/** i nazwa dostawcy nie powinny nigdy zawierać tych znaków, ale to jedyne */
/** miejsce w serwisie, gdzie sklejamy JS ze zmiennej z zewnątrz (GitHub), */
/** więc zabezpieczenie jest tanie i nie kosztuje nic na wypadek pomyłki. */
const uciecz = (s: string) => s.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

/**
 * Drugi krok logowania: GitHub odsyła tu użytkownika z `code` w query.
 * Wymieniamy go na token (server-side, żeby GITHUB_OAUTH_SECRET nigdy nie
 * trafił do przeglądarki) i odsyłamy wynik do okna panelu przez postMessage.
 *
 * Protokół handshake jest wymogiem Decap CMS (dziedziczy go z Netlify CMS):
 * ta strona NAJPIERW wysyła "authorizing:<provider>", i dopiero gdy panel
 * odpowie własnym postMessage, wysyła wiadomość z tokenem. Bez tej wymiany
 * token potrafi zostać wysłany, zanim panel zdąży podpiąć nasłuchiwanie,
 * i logowanie ciche się nie powiedzie.
 */
export const GET: APIRoute = async ({ locals, url, cookies }) => {
  const env = (locals as { runtime?: { env?: Record<string, string> } }).runtime?.env ?? {};
  const clientId = env.GITHUB_OAUTH_ID;
  const clientSecret = env.GITHUB_OAUTH_SECRET;

  const kodStanu = url.searchParams.get("state");
  const zapisanyStan = cookies.get("decap_oauth_state")?.value;
  cookies.delete("decap_oauth_state", { path: "/" });

  const kod = url.searchParams.get("code");

  const strona = (tresc: string, status = 200) =>
    new Response(tresc, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });

  if (!clientId || !clientSecret) {
    return strona(
      "Brak GITHUB_OAUTH_ID lub GITHUB_OAUTH_SECRET w zmiennych środowiskowych.",
      500
    );
  }
  if (!kod || !kodStanu || kodStanu !== zapisanyStan) {
    return strona("Logowanie odrzucone: nieprawidłowy stan (możliwa próba CSRF).", 400);
  }

  const odp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: kod }),
  });

  const dane = (await odp.json()) as { access_token?: string; error_description?: string };

  if (!dane.access_token) {
    return strona(`Wymiana kodu na token nie powiodła się: ${dane.error_description ?? "brak tokenu"}`, 502);
  }

  const komunikat = uciecz(
    JSON.stringify({ token: dane.access_token, provider: "github" })
  );

  return strona(`<!doctype html>
<html lang="pl"><body>
<script>
(function () {
  function odbierz(e) {
    window.opener.postMessage(
      'authorization:github:success:${komunikat}',
      e.origin
    );
    window.removeEventListener("message", odbierz, false);
  }
  window.addEventListener("message", odbierz, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
Logowanie zakończone — to okno można zamknąć.
</body></html>`);
};
