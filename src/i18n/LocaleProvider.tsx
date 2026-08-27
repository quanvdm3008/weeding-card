import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getStoredLocale, persistLocale, translate, type Locale } from "./translations";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale());
  useEffect(() => persistLocale(locale), [locale]);

  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    setLocale: setLocaleState,
    t: (key) => translate(key, locale),
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

// The hook intentionally shares the provider's module so there is one context instance.
// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
