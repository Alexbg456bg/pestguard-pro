import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company, nav } from '../data/content.js';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  // Solid after the hero; hides while scrolling down, shows again when scrolling up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 600 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nav.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className={`header${solid ? ' is-solid' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <div className="container header-inner">
        <a href="#top" aria-label="PestGuard Pro – начало" onClick={() => setOpen(false)}>
          <Logo light={!solid || open} />
        </a>

        <nav className="nav" aria-label="Основно меню">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className={active === n.href ? 'is-active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a href={company.phoneHref} className="header-phone">
            <span className="header-phone-icon"><Icon name="phone" size={16} /></span>
            <span className="header-phone-text">
              <small>Обадете се</small>
              <b>{company.phone}</b>
            </span>
          </a>
          <button
            className={`burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Затвори менюто' : 'Отвори менюто'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>

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
              {nav.map((n, i) => (
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
                <a href={company.phoneHref} className="btn btn-gold"><Icon name="phone" size={18} /> {company.phone}</a>
                <a href={company.viberHref} className="btn btn-line-light"><Icon name="chat" size={18} /> Viber</a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
