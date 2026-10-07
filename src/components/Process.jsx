import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';
import { rich, useLang } from '../i18n/index.jsx';

function Step({ s, i, progress, total }) {
  const at = (i + 0.5) / total;
  const color = useTransform(progress, [at - 0.12, at], ['#646D7E', '#B8903F']);
  const bg = useTransform(progress, [at - 0.12, at], ['#F6F3EC', '#0B1B3A']);
  return (
    <div className="tl-step">
      <motion.span className="tl-dot" style={{ borderColor: color, background: bg, color }}>
        {String(i + 1).padStart(2, '0')}
      </motion.span>
      <Reveal className="tl-body">
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </Reveal>
    </div>
  );
}

// Sticky title on the left, timeline on the right that fills while scrolling.
export default function Process() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="section process" id="process">
      <div className="container process-grid">
        <div className="process-side">
          <SectionHead
            no="05"
            eyebrow={t.processHead.eyebrow}
            lines={t.processHead.lines.map(rich)}
            text={t.processHead.text}
          />
          <Reveal delay={0.2}>
            <a href={company.phoneHref} className="btn btn-dark"><Icon name="phone" size={18} /> {t.processHead.cta}</a>
          </Reveal>
        </div>
        <div className="timeline" ref={ref}>
          <div className="tl-track"><motion.div className="tl-fill" style={{ scaleY: fill }} /></div>
          {t.steps.map((s, i) => (
            <Step key={i} s={s} i={i} progress={scrollYProgress} total={t.steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
