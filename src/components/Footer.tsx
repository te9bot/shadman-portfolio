import { footer } from '../data/site';
import { scrollToTop } from '../lib/scrollEngine';

export default function Footer(): JSX.Element {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <p className="footer__copy">{footer.copyright}</p>
        <p className="footer__line">{footer.line}</p>
        <button type="button" className="footer__top" onClick={scrollToTop}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M5 9V1M5 1L1.5 4.5M5 1l3.5 3.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Top
        </button>
      </div>
    </footer>
  );
}
