import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { services } from '../data/content.js';

// Cards stick to the top and stack; earlier cards shrink slightly as the next one arrives.
function ServiceCard({ s, i, total, progress }) {
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - i) * 0.045]);
  const imgScale = useTransform(progress, [start, Math.min(start + 1 / total, 1)], [1.15, 1]);

  return (
    <div className="stack-item" style={{ top: `calc(110px + ${i * 22}px)` }} id={s.id}>
      <motion.article className="svc-card" style={{ scale }}>
        <div className="svc-media">
          <picture>
            {s.imageMobile && <source media="(max-width: 640px)" srcSet={s.imageMobile} />}
            <motion.img src={s.image} alt={s.alt} loading="lazy" style={{ scale: imgScale }} />
          </picture>
          <span className="svc-no">{s.no}</span>
        </div>
        <div className="svc-body">
          <span className="svc-kicker">{s.kicker}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
          <ul>
            {s.points.map((p) => (
              <li key={p}><Icon name="check" size={16} />{p}</li>
            ))}
          </ul>
          <a href="#contact" className="link-arrow">
            Запитване за {s.title.toLowerCase()} <span className="link-arrow-circle"><Icon name="arrow" size={16} /></span>
          </a>
        </div>
      </motion.article>
    </div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section className="section services" id="services">
      <div className="container">
        <SectionHead
          no="02"
          eyebrow="Услуги"
          lines={['Три направления.', <em key="e">Едно решение.</em>]}
          text="Подбираме метода и препарата според вредителя, обекта и хората, които го използват."
        />
        <div className="stack" ref={ref}>
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} i={i} total={services.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
