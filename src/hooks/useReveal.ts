import { useEffect, useRef, type RefObject } from 'react';

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
  );
  return observer;
}

/**
 * Adds `is-visible` the first time an element enters the viewport, then stops
 * observing it. One shared IntersectionObserver serves the whole page.
 */
export function useReveal<T extends HTMLElement>(delayMs = 0): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal');
    if (delayMs) el.style.transitionDelay = `${delayMs}ms`;
    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, [delayMs]);

  return ref;
}
