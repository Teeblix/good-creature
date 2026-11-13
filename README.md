# Good Creature

Landing page for Good Creature, a veterinary practice — built from the
[Figma design](https://www.figma.com/design/hq2qDprL8OxNnkOCUqgJb1/Good-Creature),
section by section, at the 1512px desktop and 390px mobile breakpoints.

Live at **https://good-creature.vercel.app/**

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
| `npm run images` | Re-encode `assets-source/*.png` exports to sized WebP |
| `npm run submission` | Rebuild the three files in `submission/` |

## Stack

React 19 + TypeScript, Vite, Tailwind CSS v4, Motion, and Lenis for the
smooth scroll. Three families are in use: Neue Montreal for headings and
most interface type, Satoshi for body copy, Viaoda Libre for the few
display moments the design calls for.

## Layout

```
src/
  sections/     one file per page section, in page order
  components/   shared pieces — ArrowButton, Reveal, FadeIn, StaggerLines…
  lib/motion.ts easing, viewport thresholds and wipe definitions
  assets/       WebP imagery and vuesax SVG icons
public/fonts/   self-hosted Neue Montreal
scripts/        image optimisation, submission bundle
```

## Motion

The page has one rule behind it: **nothing arrives without being
announced**, and how it is announced says what kind of thing it is.

- **Headlines stagger line by line.** `StaggerLines` takes authored lines;
  `StaggerText` measures where prose actually wraps and splits on that, so the
  testimonial quotes stagger correctly at any width.
- **Supporting copy rises** 16px as it fades (`Reveal`).
- **Blocks that already move on their own just fade** (`FadeIn`) — the
  services card, the four-card visit row, the testimonial carousel, each
  FAQ group, the phone card rail. A lift would have been a second
  transform landing on top of the hover and carousel transforms those
  blocks are already running.
- **Images wipe in.** A clip-path reveal travelling left or right per section.
  The scroll trigger sits on an unclipped wrapper, because Chromium folds an
  element's own `clip-path` into its IntersectionObserver ratio — a fully
  clipped element reports itself off-screen and would never reveal itself.
- **About is drawn by the scroll rather than entered**, resolving its
  statement line by line out of a blur.
- **Approach holds its headline still** in a sticky column while the four
  cards that prove it scroll past.
- **Buttons answer a hover with a fill and nothing else.** The label used
  to roll and the arrow to leave through the tip of its badge; both were
  doing a lot of work to say "this is a button", which the button already
  said.

Everything respects `prefers-reduced-motion`; the pinned sequences have
still versions rather than reduced ones.

### Two things worth knowing

Viewport units are **`svh` and `lvh`, never `dvh`**, anywhere a frame or a
parallax offset is computed from the viewport. A phone collapses its
address bar the moment you scroll, `dvh` tracks that change, and the
element resizes mid-scroll — which reads as a jump. `svh` and `lvh` are
fixed numbers.

The slide-in panel **stops Lenis while it is open**. Lenis handles the
wheel for the whole document, so `body { overflow: hidden }` alone neither
freezes the page behind the panel nor lets the panel's own fields scroll.
For the same reason every control that opens the panel is a `<button>`:
Lenis claims anchor clicks before React sees them, so an `<a href="#…">`
scrolled the page away before the panel appeared.

## Forms

One component, `FormPanel.tsx`, serves both **Book a Visit** and **Contact
us**. It takes a form description — title, intro, fields, button label,
success copy — and provides the inset panel, the scroll lock, the
staggered entrance, the required-field validation and the pinned submit.
`useBookVisit()` and `useContactUs()` open them from anywhere.

**Nothing is sent anywhere yet.** A completed form shows its success
message and stops there; wiring it to an inbox or a service is the next
step.

## Images

The Figma PNG exports total ~79MB; `npm run images` resizes each to about twice
its display size and re-encodes as WebP, which brings the build to ~1.4MB. The
originals land in `assets-source/` (git-ignored) — Figma is the source of truth.

## Still to confirm

- Contact details (phone, email, address) are the design's placeholders,
  and the three footer social links point nowhere.
- Opening hours are not on the page anywhere.
- Where a submitted booking or message should go.
- The FAQ answer about out-of-hours emergencies describes an arrangement that
  needs checking against how the practice actually handles them.
- Neue Montreal is self-hosted from the licensed desktop files. Serving a
  desktop font as a webfont needs a webfont licence — worth confirming
  before this goes to a public domain.
- `src/assets/icon-close.svg` contains an "add" (plus) glyph, not a close
  one; the close cross in the panel is drawn inline instead.
- Prose carries `text-pretty` wherever it can wrap, so no block on the page
  ends on a single word. Checked at twelve widths from 360 to 1920.
- Grace M.'s testimonial portrait is generated; the other three come from Figma.
