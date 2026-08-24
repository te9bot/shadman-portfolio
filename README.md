# Md Shadman Shakib — Portfolio

A dark, cinematic personal portfolio built around an interactive, contribution-style
**activity grid**: every lit square maps back to one of ten real experiences across
research, technology, education, security and policy.

Built with **Vite + React + TypeScript** and hand-written CSS. The only runtime
dependency beyond React is [Lenis](https://github.com/darkroomengineering/lenis)
for smooth scrolling.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

---

## Where the content lives

All copy is data, not markup. Edit these files and the whole site updates:

| File | Contents |
| --- | --- |
| `src/data/activities.ts` | The ten activities — category, title, description |
| `src/data/activityGrid.ts` | Deterministic grid layout (cell → activity mapping) |
| `src/data/honors.ts` | Honors & recognition entries |
| `src/data/photographs.ts` | Photography metadata and layout hints |
| `src/data/site.ts` | Name, phone, nav, hero, about and contact copy |

### Activity data

Activities carry **only** `category`, `title` and `description`. Academic /
Common-App metadata — grades, hours per week, weeks per year, "will continue",
school / break / post-HS labels — is deliberately absent from the data model, so
it cannot appear in the UI.

### Contact links

`contactChannels` in `src/data/site.ts` holds Email, GitHub and LinkedIn slots:

```ts
export const contactChannels = [
  { label: 'Email', value: '', href: '' },
  { label: 'GitHub', value: '', href: '' },
  { label: 'LinkedIn', value: '', href: '' },
];
```

Empty entries render as an unset placeholder (`—`). Fill in `value` (what the
visitor sees) and `href` (where it goes) to turn a slot into a live link. No URLs
are invented anywhere in the project.

---

## Photography

The gallery ships with **14 generated placeholder images** so the layout,
parallax and lightbox can be exercised before real photographs exist.

To use your own photographs:

1. Drop your files into `public/images/photography/`.
2. Update the entries in `src/data/photographs.ts`:

```ts
{
  id: 1,
  src: 'images/photography/photo-01.jpg',  // relative, no leading slash
  width: 1600,          // intrinsic size — prevents layout shift
  height: 1000,
  title: 'Long Exposure, Padma',
  location: 'Rajshahi, Bangladesh',
  date: '2026',
  caption: '',          // optional
  span: 'feature',      // feature | wide | tall | standard
  parallax: 0.5,        // 0 = static, 1 = strongest
}
```

`span` drives the asymmetric layout; the grid uses dense packing, so rows stay
gap-free even if you change the mix. Images are lazy-loaded below the fold and
sized with `width`/`height` so nothing jumps while loading. For best results
export at ~1600px on the long edge as WebP or AVIF.

To regenerate the placeholders (zero dependencies, uses Node's `zlib`):

```bash
npm run photos
```

---

## Architecture

```
src/
  data/         content (activities, grid, honors, photographs, site copy)
  components/   one component per section, plus page chrome
  hooks/        media queries, scroll reveal, parallax, active section
  lib/
    scrollEngine.ts   single scroll authority (Lenis on desktop, native on touch)
    parallax.ts       shared registry — one measure pass, one update loop
  styles/       design tokens + one stylesheet per section
```

### Motion and performance

- **One scroll loop.** Everything that reacts to scrolling — progress bar,
  nav state, parallax — subscribes to `lib/scrollEngine`, rather than adding its
  own listener.
- **Lenis is desktop-only.** Touch devices and reduced-motion users get native
  scrolling, so there is never added touch latency.
- **Parallax measures on resize, not per frame**, and animates transforms only.
- **Reveals** use a single shared `IntersectionObserver` that unobserves each
  element after it appears.
- **`prefers-reduced-motion`** disables parallax, the custom cursor, hero and
  reveal animations, and shortens the loading transition.

### Accessibility

- Semantic landmarks and a logical heading order; skip link to the content.
- The activity grid is a roving-tabindex widget: arrow keys move between lit
  cells, <kbd>Home</kbd>/<kbd>End</kbd> jump to the ends, <kbd>Enter</kbd> opens
  an activity. Dormant cells are hidden from assistive technology.
- The activity list follows the WAI-ARIA tabs pattern; the detail panel is a
  polite live region.
- The lightbox is a modal dialog with a focus trap, <kbd>Esc</kbd> to close,
  arrow-key navigation, swipe support, and focus restored on close.
- Every image has descriptive alt text.

---

## Deployment

**Live at https://te9bot.github.io/shadman-portfolio/**

Every push to `main` triggers `.github/workflows/deploy.yml`, which runs
`npm ci && npm run build` and publishes `dist/` to GitHub Pages.

`base` is `./` in `vite.config.ts` and photograph paths in
`src/data/photographs.ts` carry no leading slash, so the same build works from
a domain root or from a project subdirectory without changes. If you move the
site to a custom domain, update the absolute `canonical`, `og:url` and
`og:image` URLs in `index.html`.

---

© 2026 Md Shadman Shakib
