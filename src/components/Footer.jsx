import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company, nav, services } from '../data/content.js';

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const wordY = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);

  return (
    <>
      <footer className="footer" ref={ref}>
        <div className="container footer-grid">
          <div>
            <Logo light />
            <p className="footer-about">
              Дезинфекция, дезинсекция и дератизация за домове и бизнес обекти във Велинград, Сърница и Доспат.
            </p>
            <a href="#top" className="to-top"><Icon name="arrow" size={16} /> Към началото</a>
          </div>
          <div>
            <h4>Услуги</h4>
            <ul>{services.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
          </div>
          <div>
            <h4>Навигация</h4>
            <ul>{nav.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}</ul>
          </div>
          <div>
            <h4>Контакт</h4>
            <ul>
              <li><a href={company.phoneHref}>{company.phone}</a></li>
              <li><a href={company.viberHref}>Viber</a></li>
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-word" aria-hidden="true">
          <motion.span style={{ y: wordY }}>PestGuard <em>Pro</em></motion.span>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© {new Date().getFullYear()} {company.legalName}{company.eik && ` · ЕИК ${company.eik}`}</span>
            <span>{company.towns.join(' · ')}</span>
          </div>
        </div>
      </footer>

      <div className="callbar">
        <a href={company.phoneHref}><Icon name="phone" size={18} /> Обади се</a>
        <a href={company.viberHref}><Icon name="chat" size={18} /> Viber</a>
      </div>
    </>
  );
}
