import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Icon from './Icon.jsx';
import { MaskLines, ease } from './Reveal.jsx';
import { company, services } from '../data/content.js';

export default function Hero({ ready }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const show = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1, delay, ease },
  });

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero-bg" style={{ y: bgY }}>
        <picture>
          {/* Portrait photo on phones, wide photo everywhere else */}
          <source media="(max-width: 640px)" srcSet="img/m-farm.webp" />
          <motion.img
            src="img/farm.webp"
            srcSet="img/farm-md.webp 1200w, img/farm.webp 2400w"
            sizes="100vw"
            alt=""
            fetchPriority="high"
            initial={{ scale: 1.25 }}
            animate={ready ? { scale: 1.06 } : { scale: 1.25 }}
            transition={{ duration: 2.6, ease }}
          />
        </picture>
      </motion.div>
      <div className="hero-overlay" />

      <motion.div className="container hero-content" style={{ y: contentY, opacity: fade }}>
        <motion.div className="hero-tag" {...show(0.2)}>
          <span className="hero-tag-line" />
          ДДД услуги · {company.towns.join(' · ')}
        </motion.div>

        <MaskLines
          as="h1"
          animate={ready}
          delay={0.25}
          lines={[
            'Спокойствие',
            <>без <em>вредители</em></>,
            'за дома и бизнеса',
          ]}
        />

        <div className="hero-bottom">
          <motion.p className="hero-lead" {...show(0.7)}>
            Професионална дезинфекция, дезинсекция и дератизация в Родопите. Оглед на място,
            безопасни методи и документ след всяко третиране.
          </motion.p>
          <motion.div className="hero-btns" {...show(0.85)}>
            <a href={company.phoneHref} className="btn btn-gold btn-lg">
              <Icon name="phone" size={18} /> {company.phone}
            </a>
            <a href="#contact" className="btn btn-line-light btn-lg">
              Безплатна консултация <Icon name="arrow" size={18} />
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.aside className="hero-card" {...show(1.05)}>
        <img src="logo-sm.png" alt="" width="56" height="56" />
        <div>
          <small>Управител</small>
          <b>{company.owner}</b>
          <a href={company.viberHref}><Icon name="chat" size={14} /> Пишете във Viber</a>
        </div>
      </motion.aside>

      <motion.div className="hero-foot" {...show(1.2)}>
        <div className="container hero-foot-inner">
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hero-foot-item">
              <span>{s.no}</span>
              <b>{s.title}</b>
              <Icon name="arrow" size={16} />
            </a>
          ))}
          <a href="#statement" className="scroll-cue" aria-label="Надолу">
            <span className="scroll-cue-line" />
            Скрол
          </a>
        </div>
      </motion.div>
    </section>
  );
}
