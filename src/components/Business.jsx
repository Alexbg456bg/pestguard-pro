import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal, { RevealGroup, RevealItem, SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import useCarousel, { Dots } from './useCarousel.jsx';
import { rich, useLang } from '../i18n/index.jsx';

export default function Business() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-14%', '14%']);
  const rowRef = useRef(null);
  const [current, goTo] = useCarousel(rowRef);

  return (
    <section className="business" id="business" ref={ref}>
      <motion.div className="business-bg">
        <motion.img src="img/office-md.webp" alt="" loading="lazy" decoding="async" style={{ y: bgY }} />
        <div className="business-overlay" />
      </motion.div>

      <div className="container business-inner">
        <div className="business-head">
          <SectionHead
            no="04"
            eyebrow={t.businessHead.eyebrow}
            light
            lines={t.businessHead.lines.map(rich)}
          />
          <Reveal className="business-aside" delay={0.15}>
            <p>{t.businessHead.text}</p>
            <a href="#contact" className="btn btn-gold">
              {t.businessHead.cta} <Icon name="arrow" size={18} />
            </a>
          </Reveal>
        </div>

        <p className="swipe-hint">{t.businessHead.swipe} <Icon name="arrow" size={16} /></p>
        <RevealGroup className="sector-grid" ref={rowRef}>
          {t.sectors.map((s, i) => (
            <RevealItem
              key={i}
              className={`sector${i === current ? ' is-current' : ''}`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="sector-icon"><Icon name={s.icon} size={24} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Dots count={t.sectors.length} index={current} onSelect={goTo} light />
      </div>
    </section>
  );
}
