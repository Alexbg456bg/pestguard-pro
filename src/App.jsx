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

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [ready, setReady] = useState(reducedMotion());

  // Smooth scrolling (skipped for visitors who prefer reduced motion)
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -72 } });
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

  return (
    <MotionConfig reducedMotion="user">
      {!reducedMotion() && <Preloader onDone={() => setReady(true)} />}
      <div className="grain" aria-hidden="true" />
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
