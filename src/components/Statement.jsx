import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import { values } from '../data/content.js';

const TEXT =
  'Ние сме местна фирма от Родопите. Идваме бързо, оглеждаме внимателно и казваме честно какво е нужно – за да се върнете към спокойния си дом и работа.';
const GOLD = new Set(['местна', 'бързо,', 'честно', 'спокойния']);

// Words start in a muted grey (still readable: 4.9:1 contrast) and darken to navy as you scroll.
// Gold words stay gold – any lighter gold would be too faint to read.
const DIM = '#646D7E';

function Word({ word, range, progress }) {
  const gold = GOLD.has(word);
  const color = useTransform(progress, range, gold ? ['#8F6C27', '#8F6C27'] : [DIM, '#0B1B3A']);
  return (
    <motion.span style={{ color }} className={gold ? 'gold' : undefined}>
      {word}{' '}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = TEXT.split(' ');

  return (
    <section className="statement" id="statement">
      <div className="container">
        <h2 className="sr-only">За PestGuard Pro</h2>
        <Reveal className="eyebrow" aria-hidden="true"><span className="eyebrow-no">01</span><span>За PestGuard Pro</span></Reveal>
        <p className="statement-text" ref={ref}>
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <div className="values-grid">
          {values.map((v, i) => (
            <Reveal key={v.title} className="value" delay={i * 0.08}>
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
