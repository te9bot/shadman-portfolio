/**
 * Photography.
 *
 * Replace the files in `public/images/photography/` with real photographs and
 * update the fields below — nothing else needs to change. Keep `src` paths
 * relative (no leading slash) so the site also works from a subdirectory.
 *
 * `span` controls the editorial layout:
 *   'feature' — large hero tile      'tall' — portrait tile
 *   'wide'    — landscape tile       'standard' — regular tile
 *
 * `parallax` is a subtle multiplier (0 = static, 1 = strongest). Desktop only;
 * it is scaled down on small screens and disabled for reduced-motion users.
 */

export type PhotoSpan = 'feature' | 'wide' | 'tall' | 'standard';

export interface Photograph {
  id: number;
  src: string;
  /** Intrinsic size — set so the browser can reserve space and avoid layout shift. */
  width: number;
  height: number;
  title: string;
  location: string;
  date: string;
  caption?: string;
  span: PhotoSpan;
  parallax: number;
}

export const photographs: Photograph[] = [
  {
    id: 1,
    src: 'images/photography/photo-01.png',
    width: 1600,
    height: 1000,
    title: 'Long Exposure, Padma',
    location: 'Rajshahi, Bangladesh',
    date: '2026',
    caption: 'Water reduced to a single continuous surface by a thirty-second frame.',
    span: 'feature',
    parallax: 0.5,
  },
  {
    id: 2,
    src: 'images/photography/photo-02.png',
    width: 1000,
    height: 1400,
    title: 'Stairwell Study',
    location: 'Dhaka, Bangladesh',
    date: '2026',
    caption: 'Repetition read as geometry rather than architecture.',
    span: 'tall',
    parallax: 0.75,
  },
  {
    id: 3,
    src: 'images/photography/photo-03.png',
    width: 1400,
    height: 1050,
    title: 'Lab Bench, Late',
    location: 'Rajshahi, Bangladesh',
    date: '2026',
    caption: 'The last hour of a synthesis run.',
    span: 'standard',
    parallax: 0.3,
  },
  {
    id: 4,
    src: 'images/photography/photo-04.png',
    width: 1600,
    height: 900,
    title: 'Monsoon Approach',
    location: 'Sylhet, Bangladesh',
    date: '2025',
    caption: '',
    span: 'wide',
    parallax: 0.6,
  },
  {
    id: 5,
    src: 'images/photography/photo-05.png',
    width: 1200,
    height: 1200,
    title: 'Circuit, Detail',
    location: 'Robotics Club',
    date: '2025',
    caption: 'A board that failed twice before it worked.',
    span: 'standard',
    parallax: 0.42,
  },
  {
    id: 6,
    src: 'images/photography/photo-06.png',
    width: 1000,
    height: 1400,
    title: 'Reading Room',
    location: 'Rajshahi, Bangladesh',
    date: '2025',
    caption: '',
    span: 'tall',
    parallax: 0.8,
  },
  {
    id: 7,
    src: 'images/photography/photo-07.png',
    width: 1400,
    height: 1050,
    title: 'Night Terminal',
    location: 'Dhaka, Bangladesh',
    date: '2025',
    caption: 'Sodium light and a long wait.',
    span: 'standard',
    parallax: 0.35,
  },
  {
    id: 8,
    src: 'images/photography/photo-08.png',
    width: 1600,
    height: 900,
    title: 'Delta, From Above',
    location: 'Barisal, Bangladesh',
    date: '2025',
    caption: 'Channels that redraw themselves every season.',
    span: 'wide',
    parallax: 0.55,
  },
  {
    id: 9,
    src: 'images/photography/photo-09.png',
    width: 1200,
    height: 1200,
    title: 'Chalk Notation',
    location: 'MonPy Workshop',
    date: '2025',
    caption: '',
    span: 'standard',
    parallax: 0.48,
  },
  {
    id: 10,
    src: 'images/photography/photo-10.png',
    width: 1000,
    height: 1400,
    title: 'Fog, Early',
    location: 'Panchagarh, Bangladesh',
    date: '2024',
    caption: 'Six in the morning, nothing resolved yet.',
    span: 'tall',
    parallax: 0.7,
  },
  {
    id: 11,
    src: 'images/photography/photo-11.png',
    width: 1400,
    height: 1050,
    title: 'Copper Sample',
    location: 'Center for Nanoscience',
    date: '2024',
    caption: 'Green synthesis, under a phone lens.',
    span: 'standard',
    parallax: 0.4,
  },
  {
    id: 12,
    src: 'images/photography/photo-12.png',
    width: 1600,
    height: 900,
    title: 'Field Survey',
    location: 'Rangpur, Bangladesh',
    date: '2024',
    caption: 'Five hundred conversations began somewhere like this.',
    span: 'standard',
    parallax: 0.52,
  },
  {
    id: 13,
    src: 'images/photography/photo-13.png',
    width: 1200,
    height: 1200,
    title: 'Instrument Room',
    location: 'Rajshahi, Bangladesh',
    date: '2024',
    caption: '',
    span: 'standard',
    parallax: 0.45,
  },
  {
    id: 14,
    src: 'images/photography/photo-14.png',
    width: 1600,
    height: 1000,
    title: 'Last Light, Rooftop',
    location: 'Rajshahi, Bangladesh',
    date: '2024',
    caption: 'Where most of the thinking actually happens.',
    span: 'feature',
    parallax: 0.5,
  },
];
