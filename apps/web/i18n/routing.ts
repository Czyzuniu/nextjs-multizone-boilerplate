import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/auth/signin": {
      pl: "/zaloguj-sie",
    },
    "/auth/signup": {
      pl: "/rejestracja",
    },
  },
});
