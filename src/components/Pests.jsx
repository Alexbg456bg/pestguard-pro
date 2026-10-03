import { useState } from 'react';
import { motion } from 'motion/react';
import Reveal, { SectionHead, ease } from './Reveal.jsx';
import Icon from './Icon.jsx';
import PestIcon from './PestIcon.jsx';
import { company, pests } from '../data/content.js';

export default function Pests() {
  const [tab, setTab] = useState('insects');
  const keys = Object.keys(pests);
  const cat = pests[tab];

  return (
    <section className="section pests" id="pests">
      <div className="container">
        <SectionHead
          no="03"
          eyebrow="Срещу какво работим"
          lines={['Вредители, които', <em key="e">решаваме</em>]}
          text="Изберете категория, за да видите срещу какво работим."
        />

        <div className="pests-layout">
          {/* Photo panel – changes with the selected category */}
          <Reveal className="pests-visual" y={40}>
            {keys.map((k) => (
              <img
                key={k}
                src={pests[k].image}
                alt=""
                loading="lazy"
                className={k === tab ? 'is-active' : ''}
              />
            ))}
            <div className="pests-visual-overlay" />
            {/* Keyed by tab, so the caption re-animates on every switch */}
            <motion.div
              key={tab}
              className="pests-visual-body"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <span className="pests-count">{cat.items.length} вида</span>
              <h3>{cat.title}</h3>
              <p>{cat.text}</p>
            </motion.div>
            <div className="pests-visual-cta">
              <span>Не сте сигурни какво имате?</span>
              <a href={company.viberHref} className="btn btn-gold btn-sm">
                <Icon name="chat" size={16} /> Снимка във Viber
              </a>
            </div>
          </Reveal>

          <div className="pests-main">
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

            <div className="pest-grid" key={tab}>
              {cat.items.map(([name, text, icon], i) => (
                <motion.article
                  key={name}
                  className="pest-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease } }}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                >
                  <span className="pest-icon"><PestIcon name={icon} /></span>
                  <div>
                    <h4>{name}</h4>
                    <p>{text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
