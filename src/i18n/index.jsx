import { createContext, Fragment, useCallback, useContext, useEffect, useState } from 'react';
import bg from './bg.js';
import en from './en.js';

const dictionaries = { bg, en };
const STORAGE_KEY = 'pg-lang';

// Language on first load: ?lang=en in the link, then the visitor's last choice, then Bulgarian
function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl && dictionaries[fromUrl]) return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && dictionaries[saved]) return saved;
  } catch { /* storage blocked – fall back to Bulgarian */ }
  return 'bg';
}

const LangContext = createContext({ lang: 'bg', t: bg, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);
  const t = dictionaries[lang];

  const setLang = useCallback((next) => {
    if (next === lang || !dictionaries[next]) return;
    // short fade while the texts swap (see .lang-switching in global.css)
    document.documentElement.classList.add('lang-switching');
    setTimeout(() => {
      setLangState(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
      requestAnimationFrame(() => document.documentElement.classList.remove('lang-switching'));
    }, 180);
  }, [lang]);

  // Keep <html lang>, the tab title and the description in the active language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
    // reflect the language in the address bar so the link can be shared
    try {
      const url = new URL(window.location.href);
      if (lang === 'bg') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
      window.history.replaceState(null, '', url);
    } catch { /* ignore */ }
  }, [lang, t]);

  return <LangContext.Provider value={{ lang, t, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// "без *вредители*" → без <em>вредители</em>
export function rich(text) {
  return text.split('*').map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
}
