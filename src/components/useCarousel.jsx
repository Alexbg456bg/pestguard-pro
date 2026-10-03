import { useCallback, useEffect, useState } from 'react';

// Tracks which card of a horizontally scrolling row is currently in front,
// and lets dots scroll to a given card. Only matters where the row actually scrolls (phones).
export default function useCarousel(ref) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = [...el.children];
        if (!items.length) return;
        const left = el.getBoundingClientRect().left;
        let best = 0;
        let bestDist = Infinity;
        items.forEach((item, i) => {
          const d = Math.abs(item.getBoundingClientRect().left - left - 16);
          if (d < bestDist) { bestDist = d; best = i; }
        });
        // At the very end of the row, the last card counts as current
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = items.length - 1;
        setIndex(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);

  const goTo = useCallback((i) => {
    const el = ref.current;
    const item = el?.children[i];
    if (!item) return;
    el.scrollTo({ left: item.offsetLeft - 16, behavior: 'smooth' });
  }, [ref]);

  return [index, goTo];
}

export function Dots({ count, index, onSelect, light }) {
  return (
    <div className={`dots${light ? ' dots-light' : ''}`} role="tablist" aria-label="Карти">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Карта ${i + 1}`}
          className={i === index ? 'is-active' : ''}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
