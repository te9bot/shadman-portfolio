import { useEffect, useRef, useState } from 'react';
import { onScroll } from '../lib/scrollEngine';

/** Hairline progress bar. Writes a transform directly — never re-renders. */
export default function ScrollProgress(): JSX.Element {
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    const remeasure = (): void => {
      limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    remeasure();

    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);
    window.addEventListener('resize', remeasure, { passive: true });

    const off = onScroll((y) => {
      const ratio = Math.min(1, Math.max(0, y / limit));
      if (bar.current) bar.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      setActive(y > 40);
    });

    return () => {
      off();
      ro.disconnect();
      window.removeEventListener('resize', remeasure);
    };
  }, []);

  return (
    <div className={`progress${active ? ' is-active' : ''}`} aria-hidden="true">
      <div className="progress__bar" ref={bar} />
    </div>
  );
}
