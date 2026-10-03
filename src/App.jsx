import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import Preloader from './components/Preloader.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Statement from './components/Statement.jsx';
import Services from './components/Services.jsx';
import Marquee from './components/Marquee.jsx';
import Pests from './components/Pests.jsx';
import Business from './components/Business.jsx';
import Process from './components/Process.jsx';
import Areas from './components/Areas.jsx';
import About from './components/About.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The intro curtain is shown once per visit; going back to the page skips it
const introSeen = () => {
  try { return sessionStorage.getItem('pg-intro') === '1'; } catch { return false; }
};
const showIntro = !reducedMotion() && !introSeen();

export default function App() {
  const [ready, setReady] = useState(!showIntro);

  // Short vibration when tapping a call or Viber link (Android phones; ignored elsewhere)
  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest?.('a[href^="tel:"], a[href^="viber:"]')) navigator.vibrate?.(15);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Pause looping CSS animations (marquee, slow photo zoom, pulsing rings) while their section is off screen
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
      { rootMargin: '100px 0px' },
    );
    document.querySelectorAll('[data-loop]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {showIntro && (
        <Preloader
          onDone={() => {
            setReady(true);
            try { sessionStorage.setItem('pg-intro', '1'); } catch { /* private mode */ }
          }}
        />
      )}
      <ScrollProgress />
      <Header />
      <main>
        <Hero ready={ready} />
        <Statement />
        <Services />
        <Marquee />
        <Pests />
        <Business />
        <Process />
        <Areas />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
