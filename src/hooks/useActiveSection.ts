import { useEffect, useState } from 'react';

/**
 * Tracks which section currently owns the viewport so the nav can mark it.
 * Uses IntersectionObserver rather than measuring on every scroll frame.
 */
export function useActiveSection(ids: string[], navHeight: number): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      {
        rootMargin: `-${navHeight + 4}px 0px -45% 0px`,
        threshold: [0, 0.15, 0.35, 0.6, 0.85],
      },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  }, [ids, navHeight]);

  return active;
}
