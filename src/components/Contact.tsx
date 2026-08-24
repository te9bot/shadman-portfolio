import { contact, contactChannels, person } from '../data/site';
import { useReveal } from '../hooks/useReveal';

export default function Contact(): JSX.Element {
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>(60);

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <div className="section-head" ref={head}>
          <span className="section-index">06</span>
          <h2 className="section-title" id="contact-title">
            Contact
          </h2>
          <span className="section-note">Open to collaboration</span>
        </div>

        <div className="contact__inner" ref={body}>
          <div>
            <p className="contact__title">
              <span>{contact.title}</span>
            </p>
            <p className="contact__body">{contact.body}</p>
          </div>

          <div className="contact__card">
            <div className="contact__name">
              <span className="contact__name-label">Name</span>
              <span className="contact__name-value">{person.name}</span>
            </div>

            <a className="contact__row contact__phone" href={person.phoneHref}>
              <span className="contact__row-label">Phone</span>
              <span className="contact__row-value">{person.phone}</span>
            </a>

            {contactChannels.map((channel) =>
              channel.href && channel.value ? (
                <a
                  className="contact__row"
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                >
                  <span className="contact__row-label">{channel.label}</span>
                  <span className="contact__row-value">{channel.value}</span>
                </a>
              ) : (
                <div className="contact__row contact__row--empty" key={channel.label}>
                  <span className="contact__row-label">{channel.label}</span>
                  <span className="contact__row-value" aria-label={`${channel.label} not listed`}>
                    —
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
