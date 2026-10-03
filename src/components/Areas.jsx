import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Reveal, { RevealGroup, RevealItem, SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import useCarousel, { Dots } from './useCarousel.jsx';
import { company, towns } from '../data/content.js';

// Loaded separately so the map library doesn't slow down the first page load
const ServiceMap = lazy(() => import('./ServiceMap.jsx'));

export default function Areas() {
  const [active, setActive] = useState(null); // hovered town (highlight only)
  const [focus, setFocus] = useState(null);   // tapped town (map flies to it)
  const rowRef = useRef(null);
  const [current, goTo] = useCarousel(rowRef);

  const toggleFocus = useCallback((id) => setFocus((f) => (f === id ? null : id)), []);
  const focusedTown = towns.find((t) => t.id === focus);

  return (
    <section className="section areas" id="areas" data-loop>
      <div className="container">
        <div className="areas-top">
          <SectionHead
            no="06"
            eyebrow="Райони"
            lines={['Работим в сърцето', <em key="e">на Родопите</em>]}
          />
          <Reveal as="p" className="areas-note" delay={0.15}>
            Посещаваме обекти в трите общини и населените места около тях. Не виждате вашето?{' '}
            <a href={company.phoneHref}>Обадете се</a> и ще уточним.
          </Reveal>
        </div>

        <div className="areas-grid">
          <Reveal className="map" y={40}>
            <Suspense fallback={<div className="service-map" />}>
              <ServiceMap active={active} onSelect={setActive} focus={focus} onFocus={toggleFocus} />
            </Suspense>
            <AnimatePresence>
              {focusedTown && (
                <motion.button
                  type="button"
                  className="map-reset"
                  onClick={() => setFocus(null)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Icon name="arrowLeft" size={16} /> Всички райони
                </motion.button>
              )}
            </AnimatePresence>
          </Reveal>

          <div>
            <p className="swipe-hint">Докоснете град, за да го видите на картата</p>
            <RevealGroup className="towns" stagger={0.1} ref={rowRef}>
              {towns.map((t, i) => (
                <RevealItem
                  key={t.id}
                  className={`town${active === t.id || focus === t.id ? ' is-active' : ''}${i === current ? ' is-current' : ''}`}
                  onMouseEnter={() => setActive(t.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => toggleFocus(t.id)}
                  whileTap={{ scale: 0.97 }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={focus === t.id}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleFocus(t.id))}
                >
                  <div className="town-head">
                    <span className="town-no">0{i + 1}</span>
                    <span className="town-cta">{focus === t.id ? 'На картата' : 'Покажи'} <Icon name="pin" size={18} /></span>
                  </div>
                  <h3>{t.name}</h3>
                  <p>{t.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <Dots count={towns.length} index={current} onSelect={goTo} />
          </div>
        </div>
      </div>
    </section>
  );
}
