import { useCallback, useEffect, useState } from 'react';
import About from './components/About';
import Activities from './components/Activities';
import ActivityDetail from './components/ActivityDetail';
import Backdrop from './components/Backdrop';
import Contact from './components/Contact';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Honors from './components/Honors';
import Nav from './components/Nav';
import Photography from './components/Photography';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import { activities, type FilterKey } from './data/activities';
import { useFinePointer, useIsDesktop, useMediaQuery, useReducedMotion } from './hooks/useMedia';
import { configureParallax, refreshParallax } from './lib/parallax';
import { scrollToId, startScrollEngine } from './lib/scrollEngine';

export default function App(): JSX.Element {
  const reducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const isDesktop = useIsDesktop();
  const isCompact = useMediaQuery('(max-width: 640px)');
  const navHeight = isCompact ? 60 : 68;

  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedId, setSelectedId] = useState<string>(activities[0].id);

  // One scroll authority: Lenis on precise-pointer desktops, native elsewhere.
  useEffect(() => startScrollEngine({ smooth: finePointer && !reducedMotion }), [
    finePointer,
    reducedMotion,
  ]);

  // Parallax strength: full on desktop, gentle on touch, off for reduced motion.
  useEffect(() => {
    configureParallax(reducedMotion ? 0 : isDesktop ? 1 : 0.35);
  }, [isDesktop, reducedMotion]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(refreshParallax, 400);
    return () => window.clearTimeout(id);
  }, [ready]);

  const handleSelect = useCallback(
    (activityId: string, source: 'grid' | 'list') => {
      setSelectedId(activityId);
      if (source !== 'grid') return;

      // Bring the detail into view only when it is not already on screen.
      const panel = document.getElementById('activity-panel');
      if (!panel) return;
      const rect = panel.getBoundingClientRect();
      const visible = rect.top < window.innerHeight - 120 && rect.bottom > navHeight + 80;
      if (!visible) scrollToId('activity-detail', navHeight);
    },
    [navHeight],
  );

  const handleFilterChange = useCallback((next: FilterKey) => {
    setFilter(next);
    // Keep the detail panel consistent with what is highlighted in the grid.
    setSelectedId((current) => {
      if (next === 'all') return current;
      const stillMatches = activities.find(
        (activity) => activity.id === current && activity.filter === next,
      );
      if (stillMatches) return current;
      return activities.find((activity) => activity.filter === next)?.id ?? current;
    });
  }, []);

  return (
    <div className={ready ? 'is-ready' : undefined}>
      <Preloader onReveal={() => setReady(true)} />

      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <Backdrop />
      <ScrollProgress />
      {finePointer && !reducedMotion ? <Cursor /> : null}
      <Nav navHeight={navHeight} />

      <main id="main">
        <Hero navHeight={navHeight} />
        <About />
        <Activities
          filter={filter}
          onFilterChange={handleFilterChange}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
        <ActivityDetail filter={filter} selectedId={selectedId} onSelect={handleSelect} />
        <Honors />
        <Photography />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
