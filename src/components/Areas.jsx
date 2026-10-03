import { lazy, Suspense, useState } from 'react';
import Reveal, { SectionHead } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { company, towns } from '../data/content.js';

// Loaded separately so the map library doesn't slow down the first page load
const ServiceMap = lazy(() => import('./ServiceMap.jsx'));

export default function Areas() {
  const [active, setActive] = useState(null);

  return (
    <section className="section areas" id="areas">
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
              <ServiceMap active={active} onSelect={setActive} />
            </Suspense>
          </Reveal>

          <div className="towns">
            {towns.map((t, i) => (
              <Reveal
                key={t.id}
                className={`town${active === t.id ? ' is-active' : ''}`}
                delay={i * 0.1}
                onMouseEnter={() => setActive(t.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div className="town-head">
                  <span className="town-no">0{i + 1}</span>
                  <Icon name="pin" size={20} />
                </div>
                <h3>{t.name}</h3>
                <p>{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
