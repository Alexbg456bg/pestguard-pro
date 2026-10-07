import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
// Extra room on the right and top so the town labels next to the pins are never cut off
const FIT = { paddingTopLeft: [40, 60], paddingBottomRight: [120, 40] };

const pinIcon = (name, i) =>
  L.divIcon({
    className: 'map-pin',
    html: `<div class="map-pin-inner" style="animation-delay:${0.3 + i * 0.35}s">
             <span class="map-pin-pulse" style="animation-delay:${i * 0.8}s"></span>
             <svg viewBox="0 0 30 40" width="30" height="40"><path d="M15 39C6 28 1 21 1 14a14 14 0 0 1 28 0c0 7-5 14-14 25z" fill="#0B1B3A" stroke="#DDBD72" stroke-width="1.5"/><circle cx="15" cy="14" r="5" fill="#DDBD72"/></svg>
             <span class="map-pin-label">${name}</span>
           </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });

// Real map (OpenStreetMap data) with the three service towns.
export default function ServiceMap({ towns, label, active, onSelect, focus, onFocus }) {
  const el = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const circles = useRef({});
  const boundsRef = useRef(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const townsRef = useRef(towns);
  townsRef.current = towns;

  useEffect(() => {
    const m = L.map(el.current, {
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile,
      tap: false,
      zoomControl: false,
      zoomSnap: 0.25,
      attributionControl: true,
    });
    map.current = m;
    L.control.zoom({ position: 'bottomright' }).addTo(m);
    L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(m);

    const towns = townsRef.current;
    const bounds = L.latLngBounds(towns.map((t) => [t.lat, t.lng]));
    boundsRef.current = bounds;
    m.fitBounds(bounds, FIT);

    towns.forEach((t, i) => {
      circles.current[t.id] = L.circle([t.lat, t.lng], {
        radius: 7000,
        color: '#B8903F',
        weight: 1,
        opacity: 0.6,
        fillColor: '#B8903F',
        fillOpacity: 0.08,
        interactive: false,
      }).addTo(m);
      markers.current[t.id] = L.marker([t.lat, t.lng], { icon: pinIcon(t.name, i), riseOnHover: true })
        .addTo(m)
        .on('mouseover', () => onSelect?.(t.id))
        .on('mouseout', () => onSelect?.(null))
        .on('click', () => onFocus?.(t.id));
    });

    // Re-fit when the container size changes (responsive layout)
    const ro = new ResizeObserver(() => {
      m.invalidateSize();
      const t = townsRef.current.find((x) => x.id === focusRef.current);
      if (t) m.setView([t.lat, t.lng], 11.5); else m.fitBounds(bounds, FIT);
    });
    ro.observe(el.current);

    return () => {
      ro.disconnect();
      m.remove();
    };
  }, [onSelect, onFocus]);

  // Town names on the pins follow the site language
  const names = towns.map((t) => t.name).join('|');
  useEffect(() => {
    townsRef.current.forEach((t, i) => markers.current[t.id]?.setIcon(pinIcon(t.name, i)));
  }, [names]);

  // Fly to the chosen town, or back out to show all three
  useEffect(() => {
    const m = map.current;
    if (!m || !boundsRef.current) return;
    const t = townsRef.current.find((x) => x.id === focus);
    if (t) m.flyTo([t.lat, t.lng], 11.5, { duration: 1.2 });
    else m.flyToBounds(boundsRef.current, { ...FIT, duration: 1.2 });
  }, [focus]);

  // Highlight the town hovered in the list
  useEffect(() => {
    townsRef.current.forEach((t) => {
      const isActive = active === t.id || focus === t.id;
      markers.current[t.id]?.getElement()?.classList.toggle('is-active', isActive);
      circles.current[t.id]?.setStyle({ fillOpacity: isActive ? 0.2 : 0.08, opacity: isActive ? 1 : 0.6 });
    });
  }, [active, focus]);

  return <div ref={el} className="service-map" aria-label={label} />;
}
