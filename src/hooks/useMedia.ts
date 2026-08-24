import { useEffect, useState } from 'react';

/** Subscribes to a media query without triggering a render on every scroll. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent): void => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const useReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

/** True on devices with a precise pointer — gates the custom cursor and Lenis. */
export const useFinePointer = (): boolean =>
  useMediaQuery('(hover: hover) and (pointer: fine)');

export const useIsDesktop = (): boolean => useMediaQuery('(min-width: 861px)');
