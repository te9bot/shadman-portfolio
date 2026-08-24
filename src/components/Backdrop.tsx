import { useParallax } from '../hooks/useParallax';

/**
 * Fixed ambient background built from four depth layers that drift at
 * different rates. Purely decorative, so it is hidden from assistive tech.
 */
export default function Backdrop(): JSX.Element {
  const gradient = useParallax<HTMLDivElement>(-0.06, 'fixed');
  const orbA = useParallax<HTMLDivElement>(-0.14, 'fixed');
  const orbB = useParallax<HTMLDivElement>(0.1, 'fixed');
  const mesh = useParallax<HTMLDivElement>(-0.035, 'fixed');

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__gradient" ref={gradient} />
      <div className="backdrop__orb backdrop__orb--a" ref={orbA} />
      <div className="backdrop__orb backdrop__orb--b" ref={orbB} />
      <div className="backdrop__mesh" ref={mesh} />
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
