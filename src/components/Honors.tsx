import { honors } from '../data/honors';
import { useReveal } from '../hooks/useReveal';

/** Editorial timeline — deliberately not cards. */
export default function Honors(): JSX.Element {
  const head = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLOListElement>(60);

  return (
    <section className="section" id="honors" aria-labelledby="honors-title">
      <div className="shell">
        <div className="section-head" ref={head}>
          <span className="section-index">04</span>
          <h2 className="section-title" id="honors-title">
            Honors &amp; Recognition
          </h2>
          <span className="section-note">Olympiad · Robotics · Research</span>
        </div>

        <ol className="honors" ref={list}>
          {honors.map((honor) => (
            <li className="honors__item" key={honor.index} tabIndex={0}>
              <span className="honors__num" aria-hidden="true">
                {honor.index}
              </span>

              <div className="honors__main">
                <h3 className="honors__title">{honor.title}</h3>
                <span className="honors__scope">{honor.scope}</span>
              </div>

              <p className="honors__desc">{honor.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
