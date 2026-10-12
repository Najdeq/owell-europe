import type { APIRoute } from "astro";
import { envOAuth } from "./_env.ts";

export const prerender = false;

/** Ucieczka danych wstrzykiwanych do inline-scriptu odpowiedzi — token */
/** i nazwa dostawcy nie powinny nigdy zawierać tych znaków, ale to jedyne */
/** miejsce w serwisie, gdzie sklejamy JS ze zmiennej z zewnątrz (GitHub), */
/** więc zabezpieczenie jest tanie i nie kosztuje nic na wypadek pomyłki. */
const uciecz = (s: string) => s.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

/**
 * Jedyne adresy, pod którymi działa panel /admin. Token trafia WYŁĄCZNIE do
 * okna z jednego z nich. Wcześniej odsyłaliśmy go pod `e.origin`, czyli do
 * kogokolwiek, kto otworzył okienko logowania: obca strona mogła otworzyć
 * /api/decap/auth w popupie, a gdy ofiara miała już zautoryzowaną aplikację
 * OAuth, GitHub przepuszczał ją bez pytania — i token (scope `repo`, zapis do
 * wszystkich repozytoriów konta) wpadał w ręce tej strony.
 */
const DOZWOLONE_ORIGINY = [
  "https://owelleurope.pl",
  "https://www.owelleurope.pl",
  "https://owell-europe.dnajdul.workers.dev",
];

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
export const GET: APIRoute = async ({ url, cookies }) => {
  const { clientId, clientSecret } = await envOAuth();

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
  const dozwolone = uciecz(JSON.stringify([...new Set([...DOZWOLONE_ORIGINY, url.origin])]));

  return strona(`<!doctype html>
<html lang="pl"><body>
<script>
(function () {
  var dozwolone = ${dozwolone};
  if (!window.opener) return;
  function odbierz(e) {
    // Token tylko dla okna panelu z naszej domeny — inne odpowiedzi ignorujemy.
    if (dozwolone.indexOf(e.origin) === -1 || e.source !== window.opener) return;
    window.opener.postMessage(
      'authorization:github:success:${komunikat}',
      e.origin
    );
    window.removeEventListener("message", odbierz, false);
  }
  window.addEventListener("message", odbierz, false);
  // Sam sygnał startu nie zawiera tokenu, ale też wysyłamy go tylko do
  // dozwolonych adresów (postMessage z niepasującym originem jest pomijany).
  dozwolone.forEach(function (o) {
    window.opener.postMessage("authorizing:github", o);
  });
})();
</script>
Logowanie zakończone — to okno można zamknąć.
</body></html>`);
};
