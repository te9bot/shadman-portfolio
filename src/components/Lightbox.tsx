import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Photograph } from '../data/photographs';
import { setScrollLocked } from '../lib/scrollEngine';

interface Props {
  photos: Photograph[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const pad = (value: number): string => String(value).padStart(2, '0');

export default function Lightbox({ photos, index, onClose, onNavigate }: Props): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const photo = photos[index];
  const total = photos.length;

  const go = useCallback(
    (delta: number) => onNavigate((index + delta + total) % total),
    [index, onNavigate, total],
  );

  // Lock the page, remember what had focus, and give focus to the dialog.
  useEffect(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    closeRef.current?.focus();

    return () => {
      setScrollLocked(false);
      restoreRef.current?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowRight':
          event.preventDefault();
          go(1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          go(-1);
          break;
        case 'Home':
          event.preventDefault();
          onNavigate(0);
          break;
        case 'End':
          event.preventDefault();
          onNavigate(total - 1);
          break;
        case 'Tab': {
          // Simple focus trap across the dialog's focusable children.
          const focusables = rootRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          );
          if (!focusables?.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, onClose, onNavigate, total]);

  const onPointerDown = (event: React.PointerEvent): void => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent): void => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${pad(index + 1)} of ${pad(total)}: ${photo.title}`}
      ref={rootRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox__bar">
        <p className="lightbox__count" aria-hidden="true">
          <b>{pad(index + 1)}</b> / {pad(total)}
        </p>
        <button type="button" className="lightbox__close" onClick={onClose} ref={closeRef}>
          <span className="sr-only">Close gallery</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>

      <div className="lightbox__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => go(-1)}
          aria-label="Previous photograph"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>

        <figure className="lightbox__figure">
          <img
            className="lightbox__img"
            key={photo.id}
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={`${photo.title} — ${photo.location}, ${photo.date}`}
            decoding="async"
          />
          <figcaption className="lightbox__cap">
            <span className="lightbox__cap-title">{photo.title}</span>
            <span className="lightbox__cap-meta">
              {photo.location} · {photo.date}
            </span>
            {photo.caption ? <span className="lightbox__cap-text">{photo.caption}</span> : null}
          </figcaption>
        </figure>

        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          onClick={() => go(1)}
          aria-label="Next photograph"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 1l6 6-6 6" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
      </div>

      <div className="lightbox__thumbs">
        {photos.map((item, i) => (
          <button
            type="button"
            key={item.id}
            className="lightbox__thumb"
            aria-current={i === index ? 'true' : undefined}
            aria-label={`View ${item.title}`}
            onClick={() => onNavigate(i)}
          >
            <img src={item.src} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
