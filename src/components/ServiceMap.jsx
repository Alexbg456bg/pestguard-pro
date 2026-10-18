import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
// Room around the borders so the town labels next to the pins are never cut off (smaller on phones)
const fitOptions = (m) => (m.getSize().x < 500
  ? { paddingTopLeft: [70, 40], paddingBottomRight: [70, 20] }
  : { paddingTopLeft: [110, 50], paddingBottomRight: [110, 30] });
// Towns whose label sits left of the pin, so neighbouring labels don't overlap
const LABEL_LEFT = new Set(['sarnitsa', 'gotsedelchev']);

// Municipality borders (from OpenStreetMap, see scripts/fetch-areas.mjs)
const AREA = { color: '#B8903F', weight: 1.5, opacity: 0.8, fillColor: '#B8903F', fillOpacity: 0.12 };
const AREA_ACTIVE = { weight: 2.5, opacity: 1, fillOpacity: 0.3 };

const pinIcon = (name, i, id) =>
  L.divIcon({
    className: `map-pin${LABEL_LEFT.has(id) ? ' label-left' : ''}`,
    html: `<div class="map-pin-inner" style="animation-delay:${0.3 + i * 0.35}s">
             <span class="map-pin-pulse" style="animation-delay:${i * 0.8}s"></span>
             <svg viewBox="0 0 30 40" width="30" height="40"><path d="M15 39C6 28 1 21 1 14a14 14 0 0 1 28 0c0 7-5 14-14 25z" fill="#0B1B3A" stroke="#DDBD72" stroke-width="1.5"/><circle cx="15" cy="14" r="5" fill="#DDBD72"/></svg>
             <span class="map-pin-label">${name}</span>
           </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });

// Real map (OpenStreetMap) with the served municipalities shaded and a pin on each town.
export default function ServiceMap({ towns, label, active, onSelect, focus, onFocus }) {
  const el = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const areas = useRef({});
  const boundsRef = useRef(null);
  const focusRef = useRef(focus);
  focusRef.current = focus;
  const townsRef = useRef(towns);
  townsRef.current = towns;
  const activeRef = useRef(active);
  activeRef.current = active;

  // Show either the focused municipality or all of them
  const fitView = (m, animate) => {
    const id = focusRef.current;
    const target = (id && areas.current[id]?.getBounds()) || boundsRef.current;
    if (!target) return;
    if (animate) m.flyToBounds(target, { ...fitOptions(m), duration: 1.2 });
    else m.fitBounds(target, fitOptions(m));
  };

  useEffect(() => {
    let cancelled = false;
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

    // Until the borders load, frame the towns
    const towns = townsRef.current;
    boundsRef.current = L.latLngBounds(towns.map((t) => [t.lat, t.lng])).pad(0.2);
    m.fitBounds(boundsRef.current, fitOptions(m));

    fetch('areas.geojson')
      .then((r) => r.json())
      .then((geo) => {
        if (cancelled) return;
        const layer = L.geoJSON(geo, {
          style: () => AREA,
          onEachFeature: (feature, l) => {
            const id = feature.properties.id;
            areas.current[id] = l;
            l.on('mouseover', () => onSelect?.(id));
            l.on('mouseout', () => onSelect?.(null));
            l.on('click', () => onFocus?.(id));
          },
        }).addTo(m);
        layer.bringToBack();
        boundsRef.current = layer.getBounds();
        fitView(m, false);
        highlight();
      })
      .catch(() => { /* borders are a bonus – the pins still work without them */ });

    towns.forEach((t, i) => {
      markers.current[t.id] = L.marker([t.lat, t.lng], { icon: pinIcon(t.name, i, t.id), riseOnHover: true })
        .addTo(m)
        .on('mouseover', () => onSelect?.(t.id))
        .on('mouseout', () => onSelect?.(null))
        .on('click', () => onFocus?.(t.id));
    });

    // Re-fit when the container size changes (responsive layout)
    const ro = new ResizeObserver(() => {
      m.invalidateSize();
      fitView(m, false);
    });
    ro.observe(el.current);

    return () => {
      cancelled = true;
      ro.disconnect();
      m.remove();
      areas.current = {};
    };
  }, [onSelect, onFocus]);

  // Town names on the pins follow the site language
  const names = towns.map((t) => t.name).join('|');
  useEffect(() => {
    townsRef.current.forEach((t, i) => markers.current[t.id]?.setIcon(pinIcon(t.name, i, t.id)));
  }, [names]);

  // Fly to the chosen municipality, or back out to show all of them
  useEffect(() => {
    if (map.current) fitView(map.current, true);
  }, [focus]);

  // Highlight the hovered / chosen town and its municipality
  function highlight() {
    townsRef.current.forEach((t) => {
      const isActive = activeRef.current === t.id || focusRef.current === t.id;
      markers.current[t.id]?.getElement()?.classList.toggle('is-active', isActive);
      areas.current[t.id]?.setStyle(isActive ? { ...AREA, ...AREA_ACTIVE } : AREA);
    });
  }
  useEffect(highlight, [active, focus]);

  return <div ref={el} className="service-map" aria-label={label} />;
}
