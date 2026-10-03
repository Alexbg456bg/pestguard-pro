import { useState } from 'react';
import { motion } from 'motion/react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company, pests } from '../data/content.js';

export default function Pests() {
  const [tab, setTab] = useState('insects');
  const keys = Object.keys(pests);

  return (
    <section className="section pests" id="pests">
      <div className="container">
        <div className="pests-top">
          <SectionHead
            no="03"
            eyebrow="Срещу какво работим"
            lines={['Вредители, които', <em key="e">решаваме</em>]}
          />
          <Reveal className="pests-aside" delay={0.15}>
            <p>Не сте сигурни какво точно имате? Изпратете ни снимка и ще ви кажем.</p>
            <a href={company.viberHref} className="btn btn-line-dark">
              <Icon name="chat" size={18} /> Снимка във Viber
            </a>
          </Reveal>
        </div>

        <Reveal className="pills" role="tablist">
          {keys.map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              className={`pill${tab === k ? ' is-active' : ''}`}
              onClick={() => setTab(k)}
            >
              {tab === k && <motion.span layoutId="pill-bg" className="pill-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span className="pill-label">{pests[k].label}</span>
              <span className="pill-count">{pests[k].items.length}</span>
            </button>
          ))}
        </Reveal>

        {/* Keyed by tab, so the list re-mounts and animates in on every switch */}
        <div className="pest-rows" key={tab}>
          {pests[tab].items.map(([name, text], i) => (
            <motion.div
              key={name}
              className="pest-row"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="pest-no">{String(i + 1).padStart(2, '0')}</span>
              <h4>{name}</h4>
              <p>{text}</p>
              <span className="pest-arrow"><Icon name="arrow" size={18} /></span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
