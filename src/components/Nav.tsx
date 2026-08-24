import { useCallback, useEffect, useState } from 'react';
import { navLinks, person } from '../data/site';
import { onScroll, scrollToId } from '../lib/scrollEngine';
import { useActiveSection } from '../hooks/useActiveSection';

const SECTION_IDS = navLinks.map((link) => link.id);

interface Props {
  navHeight: number;
}

export default function Nav({ navHeight }: Props): JSX.Element {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS, navHeight);

  useEffect(() => onScroll((y) => setStuck(y > 24)), []);

  // Close the mobile sheet on Escape or on resize back to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(false);
    };
    const mql = window.matchMedia('(min-width: 861px)');
    const onChange = (): void => setOpen(false);
    window.addEventListener('keydown', onKey);
    mql.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mql.removeEventListener('change', onChange);
    };
  }, [open]);

  const go = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      setOpen(false);
      scrollToId(id, navHeight);
      // Keep the URL meaningful without triggering a native jump.
      window.history.replaceState(null, '', `#${id}`);
    },
    [navHeight],
  );

  return (
    <>
      <header className={`nav${stuck ? ' is-stuck' : ''}`}>
        <div className="nav__inner">
          <a
            className="nav__brand"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              setOpen(false);
              scrollToId('top', navHeight);
            }}
          >
            {person.shortName}
          </a>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                key={link.id}
                className={`nav__link${active === link.id ? ' is-current' : ''}`}
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={(event) => go(event, link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <nav
        id="mobile-menu"
        className={`nav__sheet${open ? ' is-open' : ''}`}
        aria-label="Mobile"
        aria-hidden={!open}
      >
        {navLinks.map((link, index) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={active === link.id ? 'is-current' : undefined}
            tabIndex={open ? 0 : -1}
            onClick={(event) => go(event, link.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
}
