import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal, { RevealGroup, RevealItem, SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { rich, useLang } from '../i18n/index.jsx';

// HACCP & pest control for business: what is included + who it is for.
export default function Business() {
  const { t } = useLang();
  const b = t.businessHead;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-14%', '14%']);

  return (
    <section className="business" id="business" ref={ref}>
      <motion.div className="business-bg">
        <motion.img src="img/office-md.webp" alt="" loading="lazy" decoding="async" style={{ y: bgY }} />
        <div className="business-overlay" />
      </motion.div>

      <div className="container business-inner">
        <div className="business-head">
          <SectionHead no="04" eyebrow={b.eyebrow} light lines={b.lines.map(rich)} />
          <Reveal className="business-aside" delay={0.15}>
            <p>{b.text}</p>
            <a href="#contact" className="btn btn-gold">
              {b.cta} <Icon name="arrow" size={18} />
            </a>
          </Reveal>
        </div>

        <Reveal as="h3" className="business-subtitle">{b.includedTitle}</Reveal>
        <RevealGroup className="incl-grid" stagger={0.07}>
          {t.included.map((item, i) => (
            <RevealItem
              key={i}
              className={`incl-card${item.highlight ? ' is-highlight' : ''}`}
              whileHover={{ y: -4 }}
            >
              <span className="incl-icon"><Icon name={item.icon} size={24} /></span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="for-row">
          <Reveal as="h3" className="business-subtitle">{b.forTitle}</Reveal>
          <RevealGroup as="ul" className="for-list" stagger={0.05}>
            {t.sectors.map((s, i) => (
              <RevealItem as="li" key={i}>
                <Icon name={s.icon} size={18} /> {s.title}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
