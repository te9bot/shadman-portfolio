export type HonorScope = 'International' | 'National' | 'School';

export interface Honor {
  index: string;
  title: string;
  scope: HonorScope;
  description: string;
}

export const honors: Honor[] = [
  {
    index: '01',
    title: 'Bronze Medal — International Physics Olympiad (IPhO)',
    scope: 'International',
    description:
      'Awarded Bronze Medal at the International Physics Olympiad following advanced theoretical and experimental physics training.',
  },
  {
    index: '02',
    title: 'Bronze Medal — International Zhautykov Olympiad (IZhO)',
    scope: 'International',
    description: 'Awarded Bronze Medal at the International Zhautykov Olympiad.',
  },
  {
    index: '03',
    title: '2× Silver & 2× Bronze — National Robotics Competitions',
    scope: 'National',
    description:
      'Won 2× Silver and 2× Bronze medals in national robotics competitions as Programming Lead.',
  },
  {
    index: '04',
    title: 'Economics Olympiad Team — 3rd/50 Nationally',
    scope: 'National',
    description:
      'Team Captain; led the team to 3rd place among 50 national teams and 1st place in multiple competition stages.',
  },
  {
    index: '05',
    title: 'Winner — College Science Fair',
    scope: 'School',
    description: 'Built an AI prototype for a real-world application.',
  },
];
