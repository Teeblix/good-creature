/**
 * Re-encodes the Figma PNG exports as WebP at roughly twice the size they are
 * actually displayed at. The exports are far larger than the layout needs —
 * the testimonial portraits, for instance, ship at 2048px to be drawn at 128.
 *
 * Originals are kept in assets-source/ (git-ignored); Figma remains the source
 * of truth. Run with: npm run images
 */
import { readdir, mkdir, rename, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const SRC = 'src/assets'
const ARCHIVE = 'assets-source'

/** Target width in CSS pixels × 2, capped at the export's own width. */
const WIDTHS = {
  'hero-desktop': 2400, // full-bleed background (superseded by hero-v2)
  'hero-v2': 1512, // redesigned hero background, exported at 1512
  'hero-mobile': 900, // portrait crop used below the lg breakpoint
  'logo-v2': 128, // 44×46 wordmark lockup (superseded by logo-mark)
  'logo-mark': 128, // 44×49 doorway-and-cat mark in the navigation bar
  cta: 2400, // full-bleed background
  approach: 2400, // full-width illustration
  about: 1400, // half-width column, 845px tall (no longer placed)
  'about-cat': 400, // corner motif in the About statement, ~170px wide
  'about-dog': 400,
  'journey-1': 800, // 400×300 on desktop, hidden on mobile
  'journey-2': 800,
  'trust-1': 800, // 379×586 doorway on desktop, unused on mobile
  'trust-2': 800,
  'trust-3': 800,
  'trust-4': 800,
  'service-1': 800, // 340×450 desktop, full-width on mobile
  'service-2': 800,
  'service-3': 800,
  'service-4': 800,
  'testimonial-1': 320, // 128px at most
  'testimonial-2': 320,
  'testimonial-3': 320,
  'testimonial-4': 320,
  logo: 128, // 41×46
}

const bytes = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`

await mkdir(ARCHIVE, { recursive: true })

const files = (await readdir(SRC)).filter((f) => f.endsWith('.png'))
let before = 0
let after = 0
const rows = []

for (const file of files) {
  const name = file.replace(/\.png$/, '')
  const width = WIDTHS[name]
  if (!width) {
    console.warn(`! no target width for ${file} — skipped`)
    continue
  }

  const input = join(SRC, file)
  const output = join(SRC, `${name}.webp`)
  const inSize = (await stat(input)).size

  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(output)

  const outSize = (await stat(output)).size
  before += inSize
  after += outSize
  rows.push(`${name.padEnd(16)} ${bytes(inSize).padStart(9)} → ${bytes(outSize).padStart(9)}`)

  await rename(input, join(ARCHIVE, file))
}

console.log(rows.join('\n'))
console.log(`\ntotal            ${bytes(before).padStart(9)} → ${bytes(after).padStart(9)}`)
