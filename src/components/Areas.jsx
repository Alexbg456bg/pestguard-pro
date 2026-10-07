import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Reveal, { RevealGroup, RevealItem, SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import useCarousel, { Dots } from './useCarousel.jsx';
import { company } from '../data/content.js';
import { rich, useLang } from '../i18n/index.jsx';

// Loaded separately so the map library doesn't slow down the first page load
const ServiceMap = lazy(() => import('./ServiceMap.jsx'));

export default function Areas() {
  const { t } = useLang();
  const towns = t.towns;
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
            eyebrow={t.areasHead.eyebrow}
            lines={t.areasHead.lines.map(rich)}
          />
          <Reveal as="p" className="areas-note" delay={0.15}>
            {t.areasHead.note}{' '}
            <a href={company.phoneHref}>{t.areasHead.noteCall}</a> {t.areasHead.noteEnd}
          </Reveal>
        </div>

        <div className="areas-grid">
          <Reveal className="map" y={40}>
            <Suspense fallback={<div className="service-map" />}>
              <ServiceMap towns={towns} label={t.areasHead.mapLabel} active={active} onSelect={setActive} focus={focus} onFocus={toggleFocus} />
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
                  <Icon name="arrowLeft" size={16} /> {t.areasHead.allAreas}
                </motion.button>
              )}
            </AnimatePresence>
          </Reveal>

          <div>
            <p className="swipe-hint">{t.areasHead.tapHint}</p>
            <RevealGroup className="towns" stagger={0.1} ref={rowRef}>
              {towns.map((town, i) => (
                <RevealItem
                  key={town.id}
                  className={`town${active === town.id || focus === town.id ? ' is-active' : ''}${i === current ? ' is-current' : ''}`}
                  onMouseEnter={() => setActive(town.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => toggleFocus(town.id)}
                  whileTap={{ scale: 0.97 }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={focus === town.id}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggleFocus(town.id))}
                >
                  <div className="town-head">
                    <span className="town-no">0{i + 1}</span>
                    <span className="town-cta">{focus === town.id ? t.areasHead.onMap : t.areasHead.show} <Icon name="pin" size={18} /></span>
                  </div>
                  <h3>{town.name}</h3>
                  <p>{town.text}</p>
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
