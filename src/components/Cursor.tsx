import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor="active"]';

/**
 * Desktop-only cursor. Position is written straight to the DOM inside a rAF —
 * React never re-renders on pointer movement.
 */
export default function Cursor(): JSX.Element {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;
    let running = false;

    const loop = (): void => {
      // Light easing keeps it calm rather than twitchy.
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;

      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const kick = (): void => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent): void => {
      targetX = event.clientX;
      targetY = event.clientY;
      el.classList.add('is-visible');
      kick();
    };

    const onOver = (event: PointerEvent): void => {
      const target = event.target as Element | null;
      el.classList.toggle('is-active', Boolean(target?.closest?.(INTERACTIVE)));
    };

    const onLeave = (): void => el.classList.remove('is-visible');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div className="cursor" ref={dot} aria-hidden="true" />;
}
