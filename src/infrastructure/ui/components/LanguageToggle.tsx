"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition, useCallback } from "react";

const LOCALES = ["es", "en"] as const;

function setCookie(name: string, value: string) {
  globalThis.document.cookie = `${name}=${value};path=/;max-age=31536000;SameSite=Lax`;
}

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (newLocale: string) => {
      setCookie("NEXT_LOCALE", newLocale);
      startTransition(() => {
        router.refresh();
      });
    },
    [router, startTransition]
  );

  return (
    <div className="language-toggle">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          className={`language-toggle-btn${loc === locale ? " active" : ""}`}
          disabled={isPending}
          onClick={() => handleChange(loc)}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
