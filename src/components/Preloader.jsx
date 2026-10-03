import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const ease = [0.76, 0, 0.24, 1];

// Short intro: logo + name, then the navy curtain slides up.
export default function Preloader({ onDone }) {
  const [show, setShow] = useState(true);
  const done = useRef(onDone);

  useEffect(() => {
    document.documentElement.classList.add('is-loading');
    const minTime = new Promise((r) => setTimeout(r, 900));
    // Wait for the fonts (so the headline doesn't jump), not for every image on the page
    const loaded = document.fonts?.ready ?? Promise.resolve();
    // Never block longer than 2s, even on a slow connection
    const cap = new Promise((r) => setTimeout(r, 2000));
    Promise.race([Promise.all([minTime, loaded]), cap]).then(() => {
      setShow(false);
      document.documentElement.classList.remove('is-loading');
      done.current?.();
    });
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease }}
        >
          <motion.img
            src="logo-sm.png"
            alt=""
            width="96"
            height="96"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="preloader-name">
            {'PESTGUARD PRO'.split('').map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.035, duration: 0.5 }}
              >
                {c === ' ' ? ' ' : c}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="preloader-line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
