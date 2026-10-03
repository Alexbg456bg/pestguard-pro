import { sectors } from '../data/content.js';

// Endless band of the object types we serve.
export default function Marquee() {
  const items = [...sectors.map((s) => s.title), 'Домове и вили'];
  const row = items.map((t) => (
    <span className="marquee-item" key={t}>
      {t}
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0l2.6 7.4L20 10l-7.4 2.6L10 20l-2.6-7.4L0 10l7.4-2.6z" /></svg>
    </span>
  ));
  return (
    <div className="marquee" data-loop aria-label={items.join(', ')}>
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-group">{row}</div>
        <div className="marquee-group">{row}</div>
      </div>
    </div>
  );
}
