import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["es", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: Locale = "es";

function resolveLocale(raw: string | undefined): Locale {
  if (raw && SUPPORTED_LOCALES.includes(raw as Locale)) {
    return raw as Locale;
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get("NEXT_LOCALE")?.value);
  const messages = (await import(`./messages/${locale}.json`)).default;

  return { locale, messages };
});
