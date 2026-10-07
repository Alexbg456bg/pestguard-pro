import { useState } from 'react';
import { motion } from 'motion/react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';
import { rich, useLang } from '../i18n/index.jsx';

export default function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container faq-grid">
        <div className="faq-side">
          <SectionHead
            no="08"
            eyebrow={t.faqHead.eyebrow}
            lines={t.faqHead.lines.map(rich)}
            text={t.faqHead.text}
          />
          <Reveal delay={0.2}>
            <a href={company.phoneHref} className="btn btn-dark"><Icon name="phone" size={18} /> {t.phone}</a>
          </Reveal>
        </div>

        <div className="faq-list">
          {t.faq.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} className={`faq-item${isOpen ? ' is-open' : ''}`} delay={i * 0.05}>
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
