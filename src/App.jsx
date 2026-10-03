import { useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import Lenis from 'lenis';
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

export default function App() {
  const [ready, setReady] = useState(reducedMotion());

  // Smooth scrolling (skipped for visitors who prefer reduced motion)
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1, anchors: { offset: -72, duration: 1.1 } });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // Short vibration when tapping a call or Viber link (Android phones; ignored elsewhere)
  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest?.('a[href^="tel:"], a[href^="viber:"]')) navigator.vibrate?.(15);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {!reducedMotion() && <Preloader onDone={() => setReady(true)} />}
      <div className="grain" aria-hidden="true" />
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
