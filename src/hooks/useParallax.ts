import { useEffect, useRef, type RefObject } from 'react';
import { registerParallax } from '../lib/parallax';

/**
 * Registers an element with the shared parallax registry.
 * `speed` is relative (0 = static, 1 = strongest).
 */
export function useParallax<T extends HTMLElement>(
  speed: number,
  mode: 'element' | 'fixed' = 'element',
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerParallax(el, speed, mode);
  }, [speed, mode]);

  return ref;
}
