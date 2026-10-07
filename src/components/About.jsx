import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';
import { rich, useLang } from '../i18n/index.jsx';

export default function About() {
  const { t } = useLang();
  // Company ID and certificate appear only once they are filled in (src/data/content.js)
  const facts = [
    company.eik && { icon: 'shield', title: t.about.factEik, text: `${t.about.eikLabel}: ${company.eik}` },
    company.license && { icon: 'award', title: t.about.factLicense, text: `№ ${company.license}` },
    { icon: 'doc', title: t.about.factDoc, text: t.about.factDocText },
    { icon: 'pin', title: t.about.factLocal, text: t.townNames.join(', ') },
  ].filter(Boolean);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const logoY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section className="section about" id="about" ref={ref} data-loop>
      <div className="container about-grid">
        <div className="about-emblem">
          <div className="about-ring" />
          <div className="about-ring r2" />
          <motion.img
            src="logo.webp"
            alt={t.about.logoAlt}
            loading="lazy"
            width="640"
            height="640"
            style={{ y: logoY, rotate: logoRotate }}
          />
        </div>

        <div>
          <Reveal className="eyebrow"><span className="eyebrow-no">07</span><span>{t.about.eyebrow}</span></Reveal>
          <Reveal as="blockquote" delay={0.1}>
            {rich(t.about.quote)}
          </Reveal>
          <Reveal className="signature" delay={0.2}>
            <span className="signature-name">{t.owner}</span>
            <small>{t.about.role}, {t.legalName}</small>
          </Reveal>

          <div className="facts">
            {facts.map((f, i) => (
              <Reveal key={f.icon} className="fact" delay={0.1 + i * 0.06}>
                <Icon name={f.icon} size={20} />
                <div><b>{f.title}</b><small>{f.text}</small></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
