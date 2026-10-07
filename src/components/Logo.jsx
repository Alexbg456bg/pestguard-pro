import { useLang } from '../i18n/index.jsx';

export default function Logo({ light = false }) {
  const { t } = useLang();
  return (
    <span className={`logo${light ? ' logo-light' : ''}`}>
      <img src="logo-sm.png" alt="" width="46" height="46" />
      <span className="logo-text">
        <b>PESTGUARD PRO</b>
        <small>{t.tagline}</small>
      </span>
    </span>
  );
}
