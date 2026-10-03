// Line illustrations of pests, in the same 24x24 stroke style as Icon.jsx.
const paths = {
  cockroach: (
    <>
      <ellipse cx="12" cy="14.5" rx="4.5" ry="6.5" />
      <path d="M12 8v13" />
      <circle cx="12" cy="6.2" r="1.8" />
      <path d="M11 4.8C9.2 2.6 6.4 2 4 2.6M13 4.8c1.8-2.2 4.6-2.8 7-2.2" />
      <path d="M7.8 11.5 4 9.5M7.6 15H3.5M8.2 18.5 5 21M16.2 11.5 20 9.5M16.4 15h4.1M15.8 18.5 19 21" />
    </>
  ),
  bedbug: (
    <>
      <ellipse cx="12" cy="14" rx="6" ry="6.8" />
      <circle cx="12" cy="6" r="1.6" />
      <path d="M8 11.5h8M7 14.5h10M8 17.5h8" />
      <path d="M11 4.8 9.6 2.6M13 4.8l1.4-2.2" />
      <path d="M6.4 10.5 3 9M6 14.5H2.5M6.8 18.5 4 20.5M17.6 10.5 21 9M18 14.5h3.5M17.2 18.5l2.8 2" />
    </>
  ),
  ant: (
    <>
      <circle cx="12" cy="4.6" r="2" />
      <ellipse cx="12" cy="10" rx="1.7" ry="2.3" />
      <ellipse cx="12" cy="17.2" rx="3" ry="4.1" />
      <path d="M10.7 3.2 8.8 1.4M13.3 3.2l1.9-1.8" />
      <path d="M10.4 9.3 6 7.4M10.3 10.6 5.6 12M10.6 11.8 7 16.2M13.6 9.3 18 7.4M13.7 10.6l4.7 1.4M13.4 11.8 17 16.2" />
    </>
  ),
  flea: (
    <>
      <path d="M5 15.5C5 10 8.8 6 13.5 6c3.3 0 5.5 2.3 5.5 5.4 0 4.1-3.2 6.8-7.4 6.8H8" />
      <circle cx="16.6" cy="9.8" r=".9" fill="currentColor" />
      <path d="M19 11.5l2.4.6" />
      <path d="M8.6 18.2 6 22M12.3 18.2l.7 3.8M16.5 16l3.5 4.5" />
    </>
  ),
  tick: (
    <>
      <ellipse cx="12" cy="14.2" rx="5.6" ry="6.6" />
      <path d="M10.2 7.8 12 4.6l1.8 3.2" />
      <path d="M12 10.5v3" />
      <path d="M6.8 11.2 3 9M6.5 14.4H2.5M7 17.6l-3 2.4M17.2 11.2 21 9M17.5 14.4h4M17 17.6l3 2.4" />
    </>
  ),
  mosquito: (
    <>
      <circle cx="12" cy="7.4" r="1.6" />
      <path d="M12 9v12" />
      <path d="M11.6 6 9 2" />
      <path d="M12 11.2C9 7.2 5 6.3 3 7.3c1 3 5 4 9 3.9zM12 11.2c3-4 7-4.9 9-3.9-1 3-5 4-9 3.9z" />
      <path d="M11.2 14 7 19M12.8 14l4.2 5M11.2 17l-3 5M12.8 17l3 5" />
    </>
  ),
  wasp: (
    <>
      <circle cx="12" cy="4.8" r="2" />
      <circle cx="12" cy="9.4" r="1.9" />
      <path d="M12 11.6c-2.9 0-3.6 3.8-3.6 6S10 22 12 22s3.6-2.2 3.6-4.4-.7-6-3.6-6z" />
      <path d="M8.7 15.2h6.6M8.6 18.3h6.8" />
      <path d="M10.2 9 4.2 6.6c-1 1.5 1 4 6.1 3.5M13.8 9l6-2.4c1 1.5-1 4-6.1 3.5" />
    </>
  ),
  moth: (
    <>
      <path d="M12 6.5v13" />
      <path d="M12 9.5C9 4.5 3 4.5 3 8.5s5.2 5 9 3M12 9.5c3-5 9-5 9-1s-5.2 5-9 3" />
      <path d="M12 13.5c-3 0-7 1.8-6 5 2 1 5-.8 6-3M12 13.5c3 0 7 1.8 6 5-2 1-5-.8-6-3" />
      <path d="M11.4 6.4 9.6 3.4M12.6 6.4l1.8-3" />
    </>
  ),
  mouse: (
    <>
      <path d="M4 17c0-4.7 3.6-8.3 8.2-8.3 3.9 0 6.9 2.4 7.6 5.8l1.7.6-1 1.6c-.6 1.4-2.5 2.3-5 2.3H6" />
      <circle cx="9.2" cy="8.6" r="2.4" />
      <circle cx="17" cy="13.2" r=".8" fill="currentColor" />
      <path d="M6 18.9c-3 0-4 2-2.1 3.4" />
    </>
  ),
  rat: (
    <>
      <path d="M3.5 15.6c0-4.2 3.3-7.4 8.1-7.4 3.6 0 6.2 1.6 8 4.1l2.6 1.1-1.3 1.7c-1 1.3-2.8 2.3-5 2.3H5.6" />
      <circle cx="9.4" cy="8.2" r="1.9" />
      <circle cx="17.6" cy="12.6" r=".8" fill="currentColor" />
      <path d="M5.4 17.4c-1.6 2.2-1.2 4.2 1.8 4.6h5" />
    </>
  ),
  vole: (
    <>
      <path d="M4 17.5c0-5 3.6-8.6 8.2-8.6s7.6 3 7.6 6.6c0 1.4-1 2-2.5 2H4z" />
      <circle cx="9.6" cy="10.2" r="1.8" />
      <circle cx="16.4" cy="13" r=".8" fill="currentColor" />
      <path d="M4 17.5 2 18.6M7.5 17.5v1.8M14 17.5v1.8" />
    </>
  ),
  prevent: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.8V20h13V9.8" />
      <path d="M12 11.2s3 1.1 3 1.1v2.4c0 2.1-3 3.6-3 3.6s-3-1.5-3-3.6v-2.4z" />
    </>
  ),
  virus: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 7V3.5M12 20.5V17M7 12H3.5M20.5 12H17M8.5 8.5 6 6M18 18l-2.5-2.5M15.5 8.5 18 6M6 18l2.5-2.5" />
      <circle cx="12" cy="2.8" r=".9" /><circle cx="12" cy="21.2" r=".9" />
      <circle cx="2.8" cy="12" r=".9" /><circle cx="21.2" cy="12" r=".9" />
      <circle cx="10.4" cy="11" r=".8" fill="currentColor" /><circle cx="13.6" cy="13.2" r=".8" fill="currentColor" />
    </>
  ),
  mold: (
    <>
      <path d="M3 20.5h18" />
      <path d="M7 20.5v-5M12 20.5v-8.5M17 20.5V14" />
      <circle cx="7" cy="13.4" r="2.1" />
      <circle cx="12" cy="9.4" r="2.6" />
      <circle cx="17" cy="11.8" r="2.2" />
      <path d="M9.5 4.5h.01M15.5 6h.01M4.5 8.5h.01M19.5 8h.01" />
    </>
  ),
  roller: (
    <>
      <rect x="3" y="3" width="14" height="6" rx="1.5" />
      <path d="M17 6h3.5v5.5H12V14" />
      <rect x="10.5" y="14" width="3" height="7.5" rx="1" />
    </>
  ),
  van: (
    <>
      <path d="M2 16.5V7a1 1 0 0 1 1-1h11v10.5" />
      <path d="M14 9h4.2l3.8 4.2v3.3h-2" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
      <path d="M9 17h6M2 16.5h3M8 10h2" />
    </>
  ),
};

export default function PestIcon({ name, size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
