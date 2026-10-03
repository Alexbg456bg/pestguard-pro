import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company } from '../data/content.js';

const facts = [
  company.eik && { icon: 'shield', title: 'Регистрирана фирма', text: `ЕИК: ${company.eik}` },
  company.license && { icon: 'award', title: 'Удостоверение за ДДД', text: `№ ${company.license}` },
  { icon: 'doc', title: 'Документ за услугата', text: 'След всяко третиране' },
  { icon: 'pin', title: 'Местна фирма', text: company.towns.join(', ') },
].filter(Boolean);

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const logoY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const logoRotate = useTransform(scrollYProgress, [0, 1], [-6, 6]);

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-emblem">
          <div className="about-ring" />
          <div className="about-ring r2" />
          <motion.img
            src="logo.webp"
            alt="Лого на PestGuard Pro"
            loading="lazy"
            width="640"
            height="640"
            style={{ y: logoY, rotate: logoRotate }}
          />
        </div>

        <div>
          <Reveal className="eyebrow"><span className="eyebrow-no">07</span><span>За нас</span></Reveal>
          <Reveal as="blockquote" delay={0.1}>
            „Искам клиентите ми да се чувстват <em>спокойни</em> в дома и в обекта си. Затова работя
            внимателно, обяснявам какво правя и се връщам, ако е нужно.“
          </Reveal>
          <Reveal className="signature" delay={0.2}>
            <span className="signature-name">{company.owner}</span>
            <small>Управител, {company.legalName}</small>
          </Reveal>

          <div className="facts">
            {facts.map((f, i) => (
              <Reveal key={f.title} className="fact" delay={0.1 + i * 0.06}>
                <Icon name={f.icon} size={20} />
                <div><b>{f.title}</b><small>{f.text}</small></div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
