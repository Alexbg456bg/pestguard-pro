import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { sectors } from '../data/content.js';

export default function Business() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-14%', '14%']);
  // The photo "opens up" from a smaller frame as it scrolls into view
  const clip = useTransform(scrollYProgress, [0, 0.35], ['inset(8% 6% 8% 6% round 24px)', 'inset(0% 0% 0% 0% round 0px)']);

  return (
    <section className="business" id="business" ref={ref}>
      <motion.div className="business-bg" style={{ clipPath: clip }}>
        <motion.img src="img/office.webp" alt="" loading="lazy" style={{ y: bgY }} />
        <div className="business-overlay" />
      </motion.div>

      <div className="container business-inner">
        <div className="business-head">
          <SectionHead
            no="04"
            eyebrow="За бизнеса"
            light
            lines={['Абонаментно', <em key="e">обслужване</em>]}
          />
          <Reveal className="business-aside" delay={0.15}>
            <p>
              Редовен контрол по график, документи за всяко посещение и бърза реакция при нужда.
              Подходящо за обекти, които се проверяват от РЗИ и БАБХ.
            </p>
            <a href="#contact" className="btn btn-gold">
              Поискайте оферта <Icon name="arrow" size={18} />
            </a>
          </Reveal>
        </div>

        <div className="sector-grid">
          {sectors.map((s, i) => (
            <Reveal key={s.title} className="sector" delay={i * 0.06}>
              <span className="sector-icon"><Icon name={s.icon} size={24} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
