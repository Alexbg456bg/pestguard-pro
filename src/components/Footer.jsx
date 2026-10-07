import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';
import { useLang } from '../i18n/index.jsx';

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;
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
              {f.about}
            </p>
            <a href="#top" className="to-top"><Icon name="arrow" size={16} /> {f.toTop}</a>
          </div>
          <div>
            <h4>{f.services}</h4>
            <ul>{t.services.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ul>
          </div>
          <div>
            <h4>{f.navigation}</h4>
            <ul>{t.nav.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}</ul>
          </div>
          <div>
            <h4>{f.contact}</h4>
            <ul>
              <li><a href={company.phoneHref}>{t.phone}</a></li>
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
            <span>© {new Date().getFullYear()} {t.legalName}{company.eik && ` · ${f.eik} ${company.eik}`}</span>
            <span>{t.townNames.join(' · ')}</span>
          </div>
        </div>
      </footer>

      {/* Phone-only action bar */}
      <nav className="callbar" aria-label={f.quick}>
        <a href={company.phoneHref} className="callbar-main"><Icon name="phone" size={18} /> {f.call}</a>
        <a href={company.viberHref}><Icon name="chat" size={18} /><span>Viber</span></a>
        <a href="#contact"><Icon name="send" size={18} /><span>{f.request}</span></a>
      </nav>
    </>
  );
}
