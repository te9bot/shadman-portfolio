import { hero, person } from '../data/site';
import { scrollToId } from '../lib/scrollEngine';

interface Props {
  navHeight: number;
}

export default function Hero({ navHeight }: Props): JSX.Element {
  const words = hero.headline.split(' ');

  return (
    <section className="section hero" id="top" aria-labelledby="hero-title">
      <div className="shell">
        <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>

        <h1 className="hero__title" id="hero-title">
          <span className="sr-only">{person.name}</span>
          {words.map((word) => (
            <span className="hero__word" key={word} aria-hidden="true">
              <span>{word}</span>
            </span>
          ))}
        </h1>

        <div className="hero__body">
          <p className="hero__statement">{hero.statement}</p>

          <dl className="hero__meta">
            {hero.meta.map((row) => (
              <div className="hero__meta-row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <a
          className="hero__scroll"
          href="#about"
          onClick={(event) => {
            event.preventDefault();
            scrollToId('about', navHeight);
          }}
        >
          <span className="hero__scroll-track" aria-hidden="true" />
          Scroll
        </a>
      </div>
    </section>
  );
}
