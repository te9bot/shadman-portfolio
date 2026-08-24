export interface NavLink {
  id: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'activities', label: 'Activities' },
  { id: 'honors', label: 'Honors' },
  { id: 'photography', label: 'Photography' },
  { id: 'contact', label: 'Contact' },
];

export const person = {
  name: 'Md Shadman Shakib',
  shortName: 'MD SHADMAN SHAKIB',
  role: 'Researcher · Technologist · Builder',
  phone: '+880 1316-826427',
  /** tel: href — digits only, keeps dialling reliable on mobile. */
  phoneHref: 'tel:+8801316826427',
};

/**
 * Contact channels.
 *
 * Fill these in when the real addresses exist. An empty string renders the slot
 * as an unset placeholder rather than an invented link — no URL is ever guessed.
 */
export const contactChannels: { label: string; value: string; href: string }[] = [
  { label: 'Email', value: '', href: '' },
  { label: 'GitHub', value: '', href: '' },
  { label: 'LinkedIn', value: '', href: '' },
];

export const hero = {
  eyebrow: 'Rajshahi, Bangladesh',
  headline: 'MD SHADMAN SHAKIB',
  statement:
    'I study physical systems and build computational ones. The work runs from olympiad physics and nanomaterials to public-health datasets, machine-learning models, classroom curricula, cybersecurity and climate policy — different rooms of a single question: how careful measurement becomes something people can actually use.',
  meta: [
    { label: 'Focus', value: 'Physics · Data · AI' },
    { label: 'Also', value: 'Education · Security · Policy' },
    { label: 'Available for', value: 'Research & collaboration' },
  ],
};

export const about = {
  title: 'About',
  lead: 'A physicist by training, a builder by habit, and an educator by conviction.',
  paragraphs: [
    'My background starts in physics — the discipline of stating a problem precisely, measuring it honestly, and accepting what the measurement says. Olympiad training gave me the theory and the laboratory technique; research work gave me the harder lesson, which is that most of a result lives in how the data was collected, cleaned and questioned before anyone plots it.',
    'From there the work widened. I write software because computation is how a physical idea becomes reproducible at scale: survey pipelines, question banks, machine-learning models over gene-expression data, platforms that have to stay online for schools that cannot afford downtime. The tools change; the standard of evidence does not.',
    'Two commitments run underneath all of it. The first is security — systems that hold public data have an obligation to the people in that data, and I have spent time on both sides of that responsibility, finding weaknesses and teaching people to defend against them. The second is teaching. I have taught a first line of Python to people who had never opened a terminal, and it remains the clearest measure I have of whether I actually understand something.',
    'What I look for now is work at the seams — where a research question, a dataset, a piece of engineering and a public decision all have to meet, and where getting it right matters to someone outside the room.',
  ],
  pillars: [
    { label: 'Physics & Research', detail: 'Theory, experiment, and the methodology between them.' },
    { label: 'Data & Intelligence', detail: 'Statistical pipelines and applied machine learning.' },
    { label: 'Software & Security', detail: 'Systems built to be used, and to be defended.' },
    { label: 'Education & Policy', detail: 'Curricula, access, and evidence for decisions.' },
  ],
};

export const contact = {
  title: 'Let’s build something meaningful.',
  body: 'I am open to collaboration on research, technology, education, data-heavy problems, and interdisciplinary projects that need someone comfortable moving between the science and the engineering. If you are working on something along those lines, get in touch.',
};

export const footer = {
  copyright: '© 2026 Md Shadman Shakib',
  line: 'Built in the margins between experiments.',
};
