# Good Creature

Landing page for Good Creature, a veterinary practice — built from the
[Figma design](https://www.figma.com/design/hq2qDprL8OxNnkOCUqgJb1/Good-Creature),
section by section, at the 1512px desktop and 390px mobile breakpoints.

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | oxlint |
| `npm run images` | Re-encode `src/assets/*.png` exports to sized WebP |

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4 and Motion. Type is Viaoda Libre
for display and Satoshi for everything else.

## Layout

```
src/
  sections/     one file per page section, in page order
  components/   shared pieces — Button, Eyebrow, StaggerLines, WipeImage…
  lib/motion.ts easing, viewport thresholds and wipe definitions
  assets/       WebP imagery and vuesax SVG icons
scripts/        image optimisation
```

## Motion

Three ideas, applied consistently:

- **Headlines stagger line by line.** `StaggerLines` takes authored lines;
  `StaggerText` measures where prose actually wraps and splits on that, so the
  testimonial quotes stagger correctly at any width.
- **Images wipe in.** A clip-path reveal travelling left or right per section.
  The scroll trigger sits on an unclipped wrapper, because Chromium folds an
  element's own `clip-path` into its IntersectionObserver ratio — a fully
  clipped element reports itself off-screen and would never reveal itself.
- **Buttons roll their label on hover**, and menu items underline from the left.

Everything respects `prefers-reduced-motion`.

## Images

The Figma PNG exports total ~79MB; `npm run images` resizes each to about twice
its display size and re-encodes as WebP, which brings the build to ~1.4MB. The
originals land in `assets-source/` (git-ignored) — Figma is the source of truth.

## Still to confirm

- Contact details (phone, email, address) are the design's placeholders.
- The FAQ answer about out-of-hours emergencies describes an arrangement that
  needs checking against how the practice actually handles them.
- Grace M.'s testimonial portrait is generated; the other three come from Figma.
