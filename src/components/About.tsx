import { about } from '../data/site';
import { useReveal } from '../hooks/useReveal';

export default function About(): JSX.Element {
  const head = useReveal<HTMLDivElement>();
  const lead = useReveal<HTMLParagraphElement>();
  const prose = useReveal<HTMLDivElement>(80);
  const pillars = useReveal<HTMLDListElement>(120);

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="shell">
        <div className="section-head" ref={head}>
          <span className="section-index">01</span>
          <h2 className="section-title" id="about-title">
            {about.title}
          </h2>
          <span className="section-note">Physics · Data · Systems</span>
        </div>

        <div className="about__grid">
          <p className="about__lead" ref={lead}>
            {about.lead}
          </p>

          <div className="about__prose" ref={prose}>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <dl className="about__pillars" ref={pillars}>
          {about.pillars.map((pillar) => (
            <div className="about__pillar" key={pillar.label}>
              <dt>{pillar.label}</dt>
              <dd>{pillar.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
