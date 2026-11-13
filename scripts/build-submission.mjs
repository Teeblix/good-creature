/**
 * Builds the three files that get handed in:
 *
 *   submission/good-creature-code.txt        every source file as one document
 *   submission/good-creature-source.zip      the repository, minus build output
 *   submission/good-creature-built-site.zip  dist/, ready to open or deploy
 *
 * Run it with `npm run submission`. It builds the site first, so the zip is
 * never a stale one.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const OUT = join(ROOT, 'submission')
const RULE = '='.repeat(78)

const FIGMA = 'https://www.figma.com/design/hq2qDprL8OxNnkOCUqgJb1/Good-Creature'
const REPO = 'https://github.com/Teeblix/good-creature'
const LIVE = 'https://good-creature.vercel.app/'

/**
 * The reading order of the document — not alphabetical, but the order the
 * project makes sense in: what it is, how it builds, what it starts from,
 * then the shared vocabulary, then the page itself top to bottom.
 */
const GROUPS = [
  { title: 'Project', files: ['README.md', 'package.json', 'index.html'] },
  {
    title: 'Build configuration',
    files: [
      'vite.config.ts',
      'tsconfig.json',
      'tsconfig.app.json',
      'tsconfig.node.json',
      '.oxlintrc.json',
      '.gitignore',
      '.claude/launch.json',
    ],
  },
  {
    title: 'Entry point and design tokens',
    files: ['src/main.tsx', 'src/index.css', 'src/App.tsx'],
  },
  { title: 'Shared motion', files: ['src/lib/motion.ts'] },
  {
    title: 'Shared components',
    files: [
      'src/components/ArrowButton.tsx',
      'src/components/Button.tsx',
      'src/components/Eyebrow.tsx',
      'src/components/FadeIn.tsx',
      'src/components/MenuIcon.tsx',
      'src/components/Reveal.tsx',
      'src/components/RollingText.tsx',
      'src/components/SmoothScroll.tsx',
      'src/components/StaggerLines.tsx',
      'src/components/StaggerText.tsx',
      'src/components/WipeImage.tsx',
    ],
  },
  {
    title: 'Overlays',
    files: ['src/components/FormPanel.tsx', 'src/components/MobileMenu.tsx'],
  },
  {
    title: 'Page sections, in page order',
    files: [
      'src/sections/NavigationBar.tsx',
      'src/sections/Hero.tsx',
      'src/sections/About.tsx',
      'src/sections/TrustStrip.tsx',
      'src/sections/Services.tsx',
      'src/sections/Journey.tsx',
      'src/sections/Approach.tsx',
      'src/sections/Testimonials.tsx',
      'src/sections/Faq.tsx',
      'src/sections/Cta.tsx',
      'src/sections/Footer.tsx',
    ],
  },
  {
    title: 'Tooling',
    files: ['scripts/optimise-images.mjs', 'scripts/build-submission.mjs'],
  },
]

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim()
const tracked = git('ls-files').split('\n').filter(Boolean)

// A file listed in a group but no longer in the repository, or one in the
// repository that no group claims, would both leave the document incomplete.
const listed = GROUPS.flatMap((group) => group.files)
const missing = listed.filter((file) => !existsSync(join(ROOT, file)))
// package-lock.json is text, but 92KB of resolved versions is not source
// anyone reads; it travels in the zip instead.
const isText = (file) =>
  /\.(tsx?|jsx?|mjs|css|html|json|md)$/.test(file) &&
  !file.startsWith('public/') &&
  file !== 'package-lock.json'
const unlisted = tracked.filter((file) => isText(file) && !listed.includes(file))
if (missing.length || unlisted.length) {
  console.error('The document groups are out of step with the repository.')
  if (missing.length) console.error('  listed but gone:  ', missing.join(', '))
  if (unlisted.length) console.error('  present but unlisted:', unlisted.join(', '))
  process.exit(1)
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

/* ------------------------------------------------------------- the document */

const today = new Date().toISOString().slice(0, 10)
const out = []

out.push(
  RULE,
  'GOOD CREATURE — LANDING PAGE SOURCE',
  RULE,
  '',
  `Built from the Figma design at`,
  FIGMA,
  '',
  `Repository: ${REPO}`,
  `Live:       ${LIVE}`,
  `Generated:  ${today}`,
  '',
  'React 19 + TypeScript, Vite, Tailwind CSS v4, Motion, Lenis.',
  '',
  'This document holds every source file. Binary assets (imagery, SVG icons',
  'and the webfonts) cannot be inlined as text and are listed in the manifest',
  'at the end; they are included in good-creature-source.zip.',
  '',
  RULE,
  'CONTENTS',
  RULE,
  '',
)

let n = 0
for (const group of GROUPS) {
  out.push(group.title)
  for (const file of group.files) out.push(`  ${String(++n).padStart(2, ' ')}. ${file}`)
  out.push('')
}

n = 0
for (const group of GROUPS) {
  for (const file of group.files) {
    const body = readFileSync(join(ROOT, file), 'utf8').replace(/\s+$/, '')
    const lines = body.split('\n').length
    out.push('', RULE, `FILE  ${++n}  ${file}   (${lines} lines)`, RULE, '', body)
  }
}

/* --------------------------------------------------------- asset manifest */

const assets = tracked.filter((file) => !isText(file))
// Assets are named by their file alone, which is how they are imported;
// anything outside src/assets keeps its path, which is how it is served.
const group = (test) => assets.filter(test).map((file) => ({
  name: file.startsWith('src/assets/') ? relative('src/assets', file) : file,
  size: statSync(join(ROOT, file)).size,
}))

const sections = [
  {
    title: 'Imagery — Figma PNG exports re-encoded to WebP at roughly twice\ntheir display size by scripts/optimise-images.mjs.',
    items: group((f) => f.endsWith('.webp')),
  },
  {
    title: 'Icons — from the vuesax (Iconsax) library held on the Figma file’s\nIcons page.',
    items: group((f) => f.endsWith('.svg')),
  },
  {
    title: 'Fonts and favicons — served from public/.',
    items: group((f) => f.startsWith('public/')),
  },
]

out.push('', '', RULE, 'ASSET MANIFEST', RULE, '')
for (const section of sections) {
  out.push(section.title, '')
  const width = Math.max(...section.items.map((item) => item.name.length)) + 2
  for (const item of section.items) {
    out.push(`  ${item.name.padEnd(width)}${kb(item.size).padStart(10)}`)
  }
  out.push('')
}
out.push(RULE, 'END', RULE, '')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
const doc = join(OUT, 'good-creature-code.txt')
writeFileSync(doc, out.join('\n'))

/* -------------------------------------------------------------- the zips */

const build = (...args) =>
  execFileSync('npm', ['run', 'build', ...(args.length ? ['--', ...args] : [])], {
    cwd: ROOT,
    stdio: 'inherit',
  })

const zip = (name, args, cwd) => {
  execFileSync('zip', ['-q', '-r', '-X', join(OUT, name), ...args], { cwd })
  return statSync(join(OUT, name)).size
}

// The site this zip holds is meant to be unzipped and opened, so it is built
// against relative paths. A default build writes /assets/… — correct on a
// server, a blank page from a folder, which is how a zip usually gets read.
build('--base=./')
const builtSize = zip('good-creature-built-site.zip', ['.'], join(ROOT, 'dist'))

// Then dist/ is put back the way a deploy expects to find it.
build()

const sourceFiles = [...new Set([...tracked, ...listed])].sort()
const sourceSize = zip('good-creature-source.zip', sourceFiles, ROOT)

console.log(`\nsubmission/`)
console.log(`  good-creature-code.txt        ${kb(statSync(doc).size)}  ${n} files`)
console.log(`  good-creature-source.zip      ${kb(sourceSize)}  ${sourceFiles.length} files`)
console.log(`  good-creature-built-site.zip  ${kb(builtSize)}`)
