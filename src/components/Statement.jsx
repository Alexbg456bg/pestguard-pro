import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import { useLang } from '../i18n/index.jsx';

// Words start in a muted grey (still readable: 4.9:1 contrast) and darken to navy as you scroll.
// Gold words (*word* in the dictionary) stay gold – any lighter gold would be too faint to read.
const DIM = '#646D7E';

function Word({ word, gold, range, progress }) {
  const color = useTransform(progress, range, gold ? ['#8F6C27', '#8F6C27'] : [DIM, '#0B1B3A']);
  return (
    <motion.span style={{ color }} className={gold ? 'gold' : undefined}>
      {word}{' '}
    </motion.span>
  );
}

export default function Statement() {
  const { t } = useLang();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = t.statement.text.split(' ').map((w) => ({ word: w.replaceAll('*', ''), gold: w.includes('*') }));

  return (
    <section className="statement" id="statement">
      <div className="container">
        <h2 className="sr-only">{t.statement.eyebrow}</h2>
        <Reveal className="eyebrow" aria-hidden="true"><span className="eyebrow-no">01</span><span>{t.statement.eyebrow}</span></Reveal>
        <p className="statement-text" ref={ref}>
          {words.map((w, i) => (
            <Word key={i} word={w.word} gold={w.gold} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <div className="values-grid">
          {t.values.map((v, i) => (
            <Reveal key={i} className="value" delay={i * 0.08}>
              <div className="value-top">
                <span className="value-no">0{i + 1}</span>
                <Icon name={v.icon} size={24} />
              </div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
