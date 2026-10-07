import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';
import { useLang } from '../i18n/index.jsx';
import bg from '../i18n/bg.js';

// Section ids are the same in every language
const SECTION_IDS = bg.tabs.map((t) => t.href);

// BG | EN switch. On phones only the other language is shown, as one round button.
function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = useLang();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label="Език / Language">
      {['bg', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          className={lang === code ? 'is-active' : ''}
          aria-pressed={lang === code}
          aria-label={lang === code ? undefined : t.langSwitch.aria}
          onClick={() => setLang(code)}
        >
          {lang === code && <motion.span layoutId={`lang-bg-${className}`} className="lang-switch-bg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="lang-switch-label">{code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export default function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [pastHero, setPastHero] = useState(false);
  const tabsRef = useRef(null);

  // Solid after the hero; hides after scrolling down a bit, shows again after scrolling up a bit.
  // Direction changes only count after 40px, so small smooth-scroll steps don't make it flicker.
  useEffect(() => {
    let anchor = window.scrollY;
    let isHidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setPastHero(y > window.innerHeight * 0.85);
      if (y < 600) {
        isHidden = false;
        anchor = y;
      } else if (!isHidden && y > anchor + 40) {
        isHidden = true;
        anchor = y;
      } else if (isHidden && y < anchor - 40) {
        isHidden = false;
        anchor = y;
      } else if ((isHidden && y > anchor) || (!isHidden && y < anchor)) {
        anchor = y; // keep measuring from the furthest point in the current direction
      }
      setHidden(isHidden);
    };
    // Run at most once per frame
    let frame = 0;
    const onScrollThrottled = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; onScroll(); });
    };
    onScroll();
    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTION_IDS.forEach((href) => {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Keep the active tab scrolled into view
  useEffect(() => {
    const bar = tabsRef.current;
    const a = bar?.querySelector('.is-active');
    if (!bar || !a) return;
    bar.scrollTo({ left: a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
  }, [active, t]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className={`header${solid ? ' is-solid' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="container header-inner">
        <a href="#top" aria-label={t.header.home} onClick={() => setOpen(false)}>
          <Logo light={!solid || open} />
        </a>

        <nav className="nav" aria-label={t.header.mainMenu}>
          {t.nav.map((n) => (
            <a key={n.href} href={n.href} className={active === n.href ? 'is-active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LangSwitch className="in-header" />
          <a href={company.phoneHref} className="header-phone" aria-label={`${t.header.call}: ${t.phone}`}>
            <span className="header-phone-icon"><Icon name="phone" size={16} /></span>
            <span className="header-phone-text">
              <small>{t.header.call}</small>
              <b>{t.phone}</b>
            </span>
          </a>
          <button
            className={`burger${open ? ' is-open' : ''}`}
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>

      <nav
        ref={tabsRef}
        className={`section-tabs${pastHero && !open ? ' is-shown' : ''}`}
        aria-label={t.header.sections}
      >
        {t.tabs.map((tab) => (
          <a key={tab.href} href={tab.href} className={active === tab.href ? 'is-active' : ''}>
            {tab.label}
          </a>
        ))}
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="container">
              {t.nav.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + 0.06 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="mm-no">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </motion.a>
              ))}
              <motion.div
                className="mm-contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <a href={company.phoneHref} className="btn btn-gold"><Icon name="phone" size={18} /> {t.phone}</a>
                <a href={company.viberHref} className="btn btn-line-light"><Icon name="chat" size={18} /> Viber</a>
                <LangSwitch className="in-menu" />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
