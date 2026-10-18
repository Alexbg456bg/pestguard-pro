import Reveal, { RevealGroup, RevealItem } from './Reveal.jsx';
import Icon from './Icon.jsx';
import { rich, useLang } from '../i18n/index.jsx';

// Band right after the hero: municipalities, schools and kindergartens trust us.
export default function Trust() {
  const { t } = useLang();
  return (
    <section className="trust" aria-labelledby="trust-title">
      <div className="container trust-inner">
        <Reveal className="trust-head">
          <span className="eyebrow">{t.trust.eyebrow}</span>
          <h2 id="trust-title">{rich(t.trust.title)}</h2>
          <p>{t.trust.text}</p>
        </Reveal>
        <RevealGroup className="trust-items" stagger={0.1}>
          {t.trust.items.map((item) => (
            <RevealItem key={item.icon} className="trust-item">
              <span className="trust-icon"><Icon name={item.icon} size={28} /></span>
              <b>{item.title}</b>
              <small>{item.text}</small>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
