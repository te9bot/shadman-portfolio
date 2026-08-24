import Lenis from 'lenis';

/**
 * A single scroll authority for the whole page.
 *
 * Desktop gets Lenis smooth scrolling. Touch devices and reduced-motion users
 * get native scrolling — Lenis is never allowed to add touch latency. Either
 * way, everything that reacts to scroll (progress bar, nav state, parallax)
 * subscribes here so the page runs one loop instead of a dozen listeners.
 */

type Listener = (y: number) => void;

const listeners = new Set<Listener>();

let lenis: Lenis | null = null;
let rafId = 0;
let scheduled = false;
let currentY = 0;
let started = false;

function emit(y: number): void {
  currentY = y;
  for (const listener of listeners) listener(y);
}

function nativeScrollHandler(): void {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    emit(window.scrollY);
  });
}

export interface ScrollEngineOptions {
  /** false => native scrolling (touch devices, reduced motion). */
  smooth: boolean;
}

export function startScrollEngine({ smooth }: ScrollEngineOptions): () => void {
  if (started) return () => undefined;
  started = true;

  if (smooth) {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // Never hijack touch: on hybrid devices the finger stays native.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ({ scroll }: { scroll: number }) => emit(scroll));

    const raf = (time: number): void => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
  } else {
    window.addEventListener('scroll', nativeScrollHandler, { passive: true });
  }

  emit(window.scrollY);

  return () => {
    started = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    window.removeEventListener('scroll', nativeScrollHandler);
    lenis?.destroy();
    lenis = null;
  };
}

export function onScroll(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentY);
  return () => {
    listeners.delete(listener);
  };
}

export function getScrollY(): number {
  return currentY;
}

/** Smoothly scrolls to a section, accounting for the fixed navigation bar. */
export function scrollToId(id: string, navHeight: number): void {
  const target = document.getElementById(id);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target, { offset: -navHeight - 8, duration: 1.15 });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}

export function scrollToTop(): void {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
}

/** Locks/unlocks page scrolling — used while the lightbox is open. */
export function setScrollLocked(locked: boolean): void {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.body.style.overflow = locked ? 'hidden' : '';
  document.body.style.touchAction = locked ? 'none' : '';
}
