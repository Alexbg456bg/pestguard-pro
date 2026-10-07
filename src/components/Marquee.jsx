import { useLang } from '../i18n/index.jsx';

// Endless band of the object types we serve.
export default function Marquee() {
  const { t } = useLang();
  const items = [...t.sectors.map((s) => s.title), t.marqueeExtra];
  const row = items.map((text) => (
    <span className="marquee-item" key={text}>
      {text}
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0l2.6 7.4L20 10l-7.4 2.6L10 20l-2.6-7.4L0 10l7.4-2.6z" /></svg>
    </span>
  ));
  return (
    <div className="marquee" data-loop>
      <span className="sr-only">{items.join(', ')}</span>
      <div className="marquee-track" aria-hidden="true">
        <div className="marquee-group">{row}</div>
        <div className="marquee-group">{row}</div>
      </div>
    </div>
  );
}
