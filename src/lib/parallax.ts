import { onScroll } from './scrollEngine';

/**
 * Shared parallax registry.
 *
 * Elements register once; positions are measured on registration and on resize
 * only — never per frame — and every registered element is updated inside a
 * single scroll callback. All movement is transform-only.
 */

interface Item {
  el: HTMLElement;
  /** 0..1 — relative strength. */
  speed: number;
  /** Fixed layers translate by scrollY directly; element layers use viewport progress. */
  mode: 'element' | 'fixed';
  top: number;
  height: number;
  applied: number;
}

const items = new Set<Item>();

let unsubscribe: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let resizeRaf = 0;
let viewportHeight = 0;
let enabled = false;
let intensity = 1;

function measure(item: Item): void {
  if (item.mode === 'fixed') return;
  const rect = item.el.getBoundingClientRect();
  item.top = rect.top + window.scrollY;
  item.height = rect.height;
}

function measureAll(): void {
  viewportHeight = window.innerHeight;
  for (const item of items) measure(item);
}

function apply(y: number): void {
  for (const item of items) {
    let offset: number;

    if (item.mode === 'fixed') {
      offset = y * item.speed * intensity;
    } else {
      // 0 when the element is entering from the bottom, 1 when it has left the top.
      const span = viewportHeight + item.height;
      const progress = span > 0 ? (y + viewportHeight - item.top) / span : 0.5;
      const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      offset = (clamped - 0.5) * item.speed * 90 * intensity;
    }

    // Skip sub-pixel churn — keeps the compositor quiet while idle.
    if (Math.abs(offset - item.applied) < 0.06) continue;
    item.applied = offset;
    item.el.style.transform =
      item.mode === 'fixed'
        ? `translate3d(0, ${offset.toFixed(2)}px, 0)`
        : `scale(1.12) translate3d(0, ${offset.toFixed(2)}px, 0)`;
  }
}

function ensureRunning(): void {
  if (unsubscribe || !enabled) return;
  viewportHeight = window.innerHeight;
  unsubscribe = onScroll(apply);

  const onResize = (): void => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      measureAll();
      apply(window.scrollY);
    });
  };
  window.addEventListener('resize', onResize, { passive: true });
  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(document.documentElement);
}

/** Enables parallax and sets its global strength (0 disables all movement). */
export function configureParallax(strength: number): void {
  intensity = strength;
  enabled = strength > 0;
  if (!enabled) {
    for (const item of items) {
      item.el.style.transform = item.mode === 'fixed' ? '' : 'scale(1.12)';
      item.applied = 0;
    }
    unsubscribe?.();
    unsubscribe = null;
    return;
  }
  ensureRunning();
  measureAll();
  apply(window.scrollY);
}

export function registerParallax(
  el: HTMLElement,
  speed: number,
  mode: 'element' | 'fixed' = 'element',
): () => void {
  const item: Item = { el, speed, mode, top: 0, height: 0, applied: Number.NaN };
  items.add(item);
  measure(item);
  ensureRunning();
  if (enabled) apply(window.scrollY);

  return () => {
    items.delete(item);
    if (items.size === 0) {
      unsubscribe?.();
      unsubscribe = null;
      resizeObserver?.disconnect();
      resizeObserver = null;
    }
  };
}

/** Re-measures after layout-changing events such as image loads. */
export function refreshParallax(): void {
  if (!enabled) return;
  measureAll();
  apply(window.scrollY);
}
