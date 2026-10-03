export default function Logo({ light = false }) {
  return (
    <span className={`logo${light ? ' logo-light' : ''}`}>
      <img src="logo-sm.png" alt="" width="46" height="46" />
      <span className="logo-text">
        <b>PESTGUARD PRO</b>
        <small>Дезинфекция · Дезинсекция · Дератизация</small>
      </span>
    </span>
  );
}
