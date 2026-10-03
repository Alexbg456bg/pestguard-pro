import { useState } from 'react';
import { motion } from 'motion/react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company, faq } from '../data/content.js';

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <SectionHead
            no="08"
            eyebrow="Въпроси"
            lines={['Често задавани', <em key="e">въпроси</em>]}
            text="Не намирате отговор? Консултацията по телефона е безплатна."
          />
          <Reveal delay={0.2}>
            <a href={company.phoneHref} className="btn btn-dark"><Icon name="phone" size={18} /> {company.phone}</a>
          </Reveal>
        </div>

        <div className="faq-list">
          {faq.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={q} className={`faq-item${isOpen ? ' is-open' : ''}`} delay={i * 0.05}>
                <button className="faq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="faq-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq-text">{q}</span>
                  <span className="faq-icon"><Icon name="plus" size={18} /></span>
                </button>
                <motion.div
                  className="faq-a"
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{a}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
