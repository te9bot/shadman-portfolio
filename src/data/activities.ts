/**
 * Activities & Experiences.
 *
 * Only `category`, `title` and `description` are ever rendered.
 * Academic / Common-App style metadata (grades, hours per week, weeks per year,
 * "will continue", school / break / post-HS labels) is intentionally absent from
 * this data model so it can never leak into the UI.
 */

export type FilterKey = 'all' | 'academic' | 'research' | 'technology' | 'career' | 'internship';

export type ActivityFilter = Exclude<FilterKey, 'all'>;

export interface Activity {
  /** Stable slug — referenced by the activity grid cells and by URL hashes. */
  id: string;
  /** Two-digit index used by the editorial detail list. */
  index: string;
  /** Human-facing category label. */
  category: string;
  /** Filter bucket the category maps onto. */
  filter: ActivityFilter;
  title: string;
  description: string;
}

export const activities: Activity[] = [
  {
    id: 'bondi-patshala',
    index: '01',
    category: 'Career Oriented',
    filter: 'career',
    title: 'Co-founder and CTO, Bondi Patshala',
    description:
      'Founded a nonprofit serving 2,000+ students across 21 provinces through career internships, workshops, and counseling; 85% secured internships.',
  },
  {
    id: 'physics-olympiad',
    index: '02',
    category: 'Academic',
    filter: 'academic',
    title: 'International Physics Olympiad Team Member, Rajshahi Govt City College',
    description:
      'International Physics Olympiad team member. Earned an IPhO Bronze Medal, APhO Honorable Mention, and IJO Bronze Medal; completed intensive training in advanced theoretical physics and experimental techniques.',
  },
  {
    id: 'public-health-research',
    index: '03',
    category: 'Research',
    filter: 'research',
    title: 'Certified Researcher / Data Analyst, National Center for Public Health',
    description:
      'Led national midline public-health research, surveyed 500+ participants, processed the dataset, published one paper, and co-authored two additional papers.',
  },
  {
    id: 'nanoscience-internship',
    index: '04',
    category: 'Internship',
    filter: 'internship',
    title:
      'Student Researcher, Center for Nanoscience and Nanotechnology, Rajshahi University of Technology',
    description:
      'Worked as lead intern on a research project titled "Green Synthesis of Copper Nanoparticles."',
  },
  {
    id: 'robotics-club',
    index: '05',
    category: 'Computer / Technology',
    filter: 'technology',
    title: 'Programmer → Programming Lead, Robotics Club',
    description:
      'Coached approximately 20 high-school and middle-school students; led monthly meetups focused on Arduino and LEGO robotics. Competed nationally and won 2× Silver and 2× Bronze medals. Featured on national radio.',
  },
  {
    id: 'monpy-codely',
    index: '06',
    category: 'Computer / Technology',
    filter: 'technology',
    title: 'Teacher, MonPy — Codely NGO',
    description:
      'Led MonPy, a computer-science education initiative that introduced Python programming to complete beginners at a local library.',
  },
  {
    id: 'climate-policy',
    index: '07',
    category: 'Career Oriented',
    filter: 'career',
    title:
      'Policy Research Intern, Ministry of Environment & Climate Change, Government of Bangladesh',
    description:
      "Piloted firms committed to 10% reduction targets using a policy model; co-authored a parliamentary bill appendix and drafted Bangladesh's UN brief.",
  },
  {
    id: 'suraad-elearning',
    index: '08',
    category: 'Career Oriented',
    filter: 'career',
    title: 'Lead Developer for Mathematics & English, Suraad E-Learning Platform',
    description:
      'Co-created a K–12 Mathematics and English question bank to improve education access, managed the development team, and helped deploy the platform across 25 rural schools.',
  },
  {
    id: 'cyber24',
    index: '09',
    category: 'Computer / Technology',
    filter: 'technology',
    title: 'Cyber24 — National Cybersecurity & Bug Bounty Community',
    description:
      'Identified 20+ critical vulnerabilities, helped stop attacks targeting public services, contributed to protecting citizen data, and taught cybersecurity and online-safety practices to more than 3 million users.',
  },
  {
    id: 'questica',
    index: '10',
    category: 'Research',
    filter: 'research',
    title: 'Questica — Global Youth Research & Innovation Platform for Life Sciences',
    description:
      'Analyzed 3,000+ gene-expression datasets, developed machine-learning models for disease prediction, collaborated with 5+ global researchers, and presented findings through Questica.',
  },
];

export const activityFilters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'academic', label: 'Academic' },
  { key: 'research', label: 'Research' },
  { key: 'technology', label: 'Technology' },
  { key: 'career', label: 'Career' },
  { key: 'internship', label: 'Internship' },
];

export const activityById = new Map(activities.map((activity) => [activity.id, activity]));
