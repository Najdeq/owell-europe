import type { APIRoute } from "astro";
import { envOAuth } from "./_env.ts";

// Endpoint działa na żądanie, nie jest prerenderowany razem z resztą
// statycznej strony — panel CMS potrzebuje logiki serwerowej (przekierowanie
// do GitHuba, wymiana kodu na token), której nie da się zrobić w buildzie.
export const prerender = false;

/**
 * Pierwszy krok logowania do panelu (/admin) przez GitHuba.
 *
 * Decap CMS otwiera to w osobnym okienku. Tu tylko przekierowujemy do ekranu
 * zgody GitHuba — właściwa wymiana kodu na token dzieje się w callback.ts,
 * żeby GITHUB_OAUTH_SECRET nigdy nie dotarł do przeglądarki.
 *
 * `state` w ciasteczku HttpOnly zabezpiecza przed CSRF: callback odrzuci
 * odpowiedź, jeśli zwrócony `state` nie zgadza się z tym zapisanym tutaj.
 */
export const GET: APIRoute = async ({ redirect, cookies, url }) => {
  const { clientId } = await envOAuth();

  if (!clientId) {
    return new Response(
      "Brak GITHUB_OAUTH_ID w zmiennych środowiskowych — patrz DEPLOY.md, sekcja „Panel CMS”.",
      { status: 500 }
    );
  }

  const state = crypto.randomUUID();
  cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const redirectUri = new URL("/api/decap/callback", url.origin).toString();
  const parametry = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
    state,
  });

  return redirect(`https://github.com/login/oauth/authorize?${parametry}`, 302);
};
