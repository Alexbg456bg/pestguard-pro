import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react';
import Icon from './Icon.jsx';
import { useLang } from '../i18n/index.jsx';

const R = 20;
const CIRC = 2 * Math.PI * R;

// Thin gold reading-progress bar at the top + a "back to top" button whose ring fills while scrolling.
export default function ScrollProgress() {
  const { t } = useLang();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const dash = useTransform(progress, (v) => CIRC * (1 - v));
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <AnimatePresence>
        {showTop && (
          <motion.a
            href="#top"
            className="to-top-btn"
            aria-label={t.misc.toTop}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          >
            <svg className="to-top-progress" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r={R} className="to-top-track" />
              <motion.circle
                cx="24"
                cy="24"
                r={R}
                className="to-top-ring"
                style={{ strokeDasharray: CIRC, strokeDashoffset: dash }}
              />
            </svg>
            <Icon name="arrowUp" size={18} />
          </motion.a>
        )}
      </AnimatePresence>
    </>
  );
}
