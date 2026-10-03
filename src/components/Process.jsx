import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company, steps } from '../data/content.js';

function Step({ s, i, progress, total }) {
  const at = (i + 0.5) / total;
  const color = useTransform(progress, [at - 0.12, at], ['#C9C2B2', '#B8903F']);
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
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="section process" id="process">
      <div className="container process-grid">
        <div className="process-side">
          <SectionHead
            no="05"
            eyebrow="Как работим"
            lines={['От обаждането', <em key="e">до резултата</em>]}
            text="Ясен процес без изненади. Знаете какво ще се случи на всяка стъпка."
          />
          <Reveal delay={0.2}>
            <a href={company.phoneHref} className="btn btn-dark"><Icon name="phone" size={18} /> Започнете с обаждане</a>
          </Reveal>
        </div>
        <div className="timeline" ref={ref}>
          <div className="tl-track"><motion.div className="tl-fill" style={{ scaleY: fill }} /></div>
          {steps.map((s, i) => (
            <Step key={s.title} s={s} i={i} progress={scrollYProgress} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
