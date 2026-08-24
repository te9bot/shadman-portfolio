import { useEffect, useState } from 'react';
import { person } from '../data/site';

interface Props {
  /** Fires when the curtain starts lifting, so the hero can begin animating. */
  onReveal: () => void;
}

/** Short, restrained entry: name, an emerald sweep, then out of the way. */
export default function Preloader({ onReveal }: Props): JSX.Element | null {
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = reduced ? 220 : 1150;

    const lift = window.setTimeout(() => {
      setLifting(true);
      onReveal();
    }, hold);
    const remove = window.setTimeout(() => setGone(true), hold + 700);

    return () => {
      window.clearTimeout(lift);
      window.clearTimeout(remove);
    };
  }, [onReveal]);

  if (gone) return null;

  return (
    <div className={`preloader${lifting ? ' is-done' : ''}`} role="presentation" aria-hidden="true">
      <div className="preloader__inner">
        <p className="preloader__name">{person.shortName}</p>
        <span className="preloader__line" />
        <p className="preloader__role">{person.role}</p>
      </div>
    </div>
  );
}
