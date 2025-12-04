import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getServerClient } from "@workspace/clients/src/supabase/server";

const PUBLIC_ROUTES: Record<string, string[]> = {
  en: ["/auth/signin", "/auth/signup"],
  pl: ["/zaloguj-sie", "/rejestracja"],
};

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  const locale = request.nextUrl.locale || routing.defaultLocale;
  const pathWithoutLocale = request.nextUrl.pathname.replace(`/${locale}`, "");
  const isProtected = !PUBLIC_ROUTES[locale]?.includes(pathWithoutLocale);

  if (!isProtected) {
    return response;
  }

  const supabaseServerClient = await getServerClient();

  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/signin`, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - api routes
    // - trpc routes
    // - _next system routes
    // - _vercel system routes
    // - files with extensions (e.g., favicon.ico)
    // - static assets
    // - /admin or anything starting with /admin
    "/((?!api|trpc|_next|_vercel|.*\\..*|favicon.ico|robots.txt|sitemap.xml|images|admin).*)",
  ],
};
