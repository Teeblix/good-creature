import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'
import { pauseSmoothScroll, resumeSmoothScroll } from './SmoothScroll'
import calendarIcon from '../assets/icon-journey-calendar.svg'
import tickIcon from '../assets/icon-tick-circle.svg'

/* ------------------------------------------------------------------ shapes */

type Field = {
  name: string
  label: string
  kind: 'text' | 'email' | 'tel' | 'select' | 'date' | 'textarea'
  placeholder: string
  required?: boolean
  options?: string[]
  rows?: number
}

type Values = Record<string, string>

type Form = {
  /** Prefixes every field id, so two forms never collide in the document. */
  id: string
  title: string
  intro: string
  fields: Field[]
  submitLabel: string
  success: () => { heading: string; body: string }
}

/* ------------------------------------------------------------------- forms */

/** The asterisk in a label is the design's; `required` is what enforces it. */
const BOOK: Form = {
  id: 'book',
  title: 'Book a Visit',
  intro:
    'Tell us about your pet and when suits you. We’ll confirm your appointment within one working day.',
  submitLabel: 'Submit',
  fields: [
    { name: 'name', label: 'Your Name*', kind: 'text', placeholder: 'Full name', required: true },
    {
      name: 'email',
      label: 'Email Address*',
      kind: 'email',
      placeholder: 'name@email.com',
      required: true,
    },
    { name: 'phone', label: 'Phone', kind: 'tel', placeholder: 'Your mobile number' },
    {
      name: 'petName',
      label: 'Pet’s Name*',
      kind: 'text',
      placeholder: 'e.g. Biscuit',
      required: true,
    },
    {
      name: 'petType',
      label: 'Type of Pet*',
      kind: 'select',
      placeholder: 'Select',
      required: true,
      options: ['Dog', 'Cat', 'Rabbit', 'Other'],
    },
    {
      name: 'reason',
      label: 'Reason for Visit*',
      kind: 'select',
      placeholder: 'Select',
      required: true,
      options: [
        'Check up or vaccination',
        'Unwell pet',
        'Surgery or dental',
        'Senior pet care',
        'Something else',
      ],
    },
    {
      name: 'date',
      label: 'Preferred Date*',
      kind: 'date',
      placeholder: 'Choose a date',
      required: true,
    },
    {
      name: 'time',
      label: 'Preferred Time*',
      kind: 'select',
      placeholder: 'Select',
      required: true,
      options: ['Morning', 'Afternoon', 'No preference'],
    },
    {
      name: 'notes',
      label: 'Anything We Should Know',
      kind: 'textarea',
      placeholder: 'Tell us if your pet is nervous, has health needs or needs extra time',
    },
  ],
  success: () => ({
    heading: 'Thank you.',
    body: 'We have your request and will confirm your appointment within one working day.',
  }),
}

const CONTACT: Form = {
  id: 'contact',
  title: 'Contact Us',
  intro:
    'Questions about services, prices or your first visit? Send us a message and a member of our team will reply within one working day.',
  submitLabel: 'Send message',
  fields: [
    { name: 'name', label: 'Your name*', kind: 'text', placeholder: 'Full name', required: true },
    { name: 'email', label: 'Email*', kind: 'email', placeholder: 'name@email.com', required: true },
    { name: 'phone', label: 'Phone', kind: 'tel', placeholder: 'Your mobile number' },
    {
      name: 'topic',
      label: 'Topic*',
      kind: 'select',
      placeholder: 'Select',
      required: true,
      options: [
        'General question',
        'Prices and payment',
        'Prescriptions',
        'Insurance paperwork',
        'Feedback',
      ],
    },
    {
      name: 'message',
      label: 'Message*',
      kind: 'textarea',
      placeholder: 'How can we help',
      required: true,
      rows: 4,
    },
  ],
  success: () => ({
    heading: 'Thank you.',
    body: 'Your message is with our team and we will reply within one working day.',
  }),
}

const FORMS = { book: BOOK, contact: CONTACT } as const
type FormKey = keyof typeof FORMS

const emptyValues = (form: Form) =>
  Object.fromEntries(form.fields.map((field) => [field.name, ''])) as Values

/* ----------------------------------------------------------------- opening */

const PanelContext = createContext<(form: FormKey) => void>(() => {})

/** Call this from anywhere to open the booking panel. */
export function useBookVisit() {
  const open = useContext(PanelContext)
  return useCallback(() => open('book'), [open])
}

/** Call this from anywhere to open the contact panel. */
export function useContactUs() {
  const open = useContext(PanelContext)
  return useCallback(() => open('contact'), [open])
}

/* ------------------------------------------------------------------- parts */

const LABEL = 'w-full text-[18px] leading-normal text-ink'
const CONTROL =
  'w-full border-b border-line bg-transparent py-[10px] text-[16px] leading-normal text-ink ' +
  'placeholder:text-[#949494] focus:border-navy focus:outline-none'

/** A chevron, drawn rather than fetched. It turns over when the list opens. */
function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={`pointer-events-none size-5 text-ink transition-transform duration-300 ease-out ${
        open ? '-rotate-180' : ''
      }`}
    >
      <path
        d="M5 8l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The site's own dropdown.
 *
 * A native select paints its list with the operating system's widget — right
 * typeface, wrong everything else, and nothing about it belongs to this page.
 * This keeps what the native control is good at (click the field, click the
 * option, and the keyboard behaves) and draws the list in the page's own
 * language: the field's rule, the panel's radius, the card shadow.
 *
 * The list flips above the field when there is not room below it, because the
 * panel it lives in scrolls and would otherwise clip it.
 */
function Select({
  id,
  field,
  value,
  invalid,
  onChange,
}: {
  id: string
  field: Field
  value: string
  invalid: boolean
  onChange: (value: string) => void
}) {
  const options = field.options ?? []
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [place, setPlace] = useState({ above: false, maxHeight: 260 })
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const close = useCallback(() => setOpen(false), [])

  /**
   * Opening decides where the list goes. Below the field is the right answer
   * almost always — a list that jumps above covers the questions already
   * answered — so it only flips when there is really nothing underneath, and
   * otherwise just takes the height that fits.
   */
  const show = () => {
    const box = rootRef.current?.getBoundingClientRect()
    if (box) {
      const below = window.innerHeight - box.bottom - 28
      const above = box.top - 28
      setPlace(
        below < 140 && above > below
          ? { above: true, maxHeight: Math.min(260, above) }
          : { above: false, maxHeight: Math.min(260, below) },
      )
    }
    setActive(Math.max(0, options.indexOf(value)))
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, close])

  // The active option is kept in view, so a long list can be walked with the
  // arrow keys without losing sight of where you are.
  useEffect(() => {
    if (!open) return
    const node = listRef.current?.children[active] as HTMLElement | undefined
    node?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const pick = (option: string) => {
    onChange(option)
    setOpen(false)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') return close()
    if (event.key === 'Tab') return close()

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        show()
      }
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      pick(options[active])
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(options.length - 1, current + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(0, current - 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActive(options.length - 1)
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKeyDown}
        className={`${CONTROL} flex cursor-pointer items-center justify-between gap-4 text-left ${
          value ? '' : 'text-[#949494]'
        }`}
      >
        <span className="truncate">{value || field.placeholder}</span>
        <Chevron open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={field.label}
            initial={{ opacity: 0, y: place.above ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: place.above ? 4 : -4 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            style={{ maxHeight: place.maxHeight }}
            className={`absolute right-0 left-0 z-10 overflow-y-auto overscroll-contain rounded-xl bg-white p-1.5 shadow-card ${
              place.above ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {options.map((option, index) => {
              const selected = option === value
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => pick(option)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[16px] leading-normal transition-colors duration-150 ${
                      index === active ? 'bg-cream text-ink' : 'text-ink-soft'
                    }`}
                  >
                    {option}
                    {selected && (
                      <svg viewBox="0 0 20 20" aria-hidden className="size-4 shrink-0 text-ink">
                        <path
                          d="M4 10.5l4 4 8-9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function Control({
  id,
  field,
  value,
  invalid,
  onChange,
}: {
  id: string
  field: Field
  value: string
  invalid: boolean
  onChange: (value: string) => void
}) {
  const described = invalid ? `${id}-error` : undefined

  if (field.kind === 'textarea') {
    return (
      <textarea
        id={id}
        name={field.name}
        rows={field.rows ?? 3}
        value={value}
        placeholder={field.placeholder}
        aria-invalid={invalid}
        aria-describedby={described}
        onChange={(event) => onChange(event.target.value)}
        className={`${CONTROL} resize-none`}
      />
    )
  }

  if (field.kind === 'select') {
    return <Select id={id} field={field} value={value} invalid={invalid} onChange={onChange} />
  }

  if (field.kind === 'date') {
    return (
      <div className="relative flex w-full items-center">
        <input
          id={id}
          name={field.name}
          type={value ? 'date' : 'text'}
          placeholder={field.placeholder}
          onFocus={(event) => {
            event.currentTarget.type = 'date'
            event.currentTarget.showPicker?.()
          }}
          onBlur={(event) => {
            if (!event.currentTarget.value) event.currentTarget.type = 'text'
          }}
          value={value}
          aria-invalid={invalid}
          aria-describedby={described}
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL} appearance-none pr-8 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:size-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
        />
        <img src={calendarIcon} alt="" className="pointer-events-none absolute right-0 size-5" />
      </div>
    )
  }

  return (
    <input
      id={id}
      name={field.name}
      type={field.kind}
      value={value}
      placeholder={field.placeholder}
      aria-invalid={invalid}
      aria-describedby={described}
      onChange={(event) => onChange(event.target.value)}
      className={CONTROL}
    />
  )
}

/* ------------------------------------------------------------------- panel */

function Panel({ form, onClose }: { form: Form; onClose: () => void }) {
  const reduceMotion = useReducedMotion()
  const [values, setValues] = useState(() => emptyValues(form))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const fieldId = (name: string) => `${form.id}-${name}`

  // The panel takes the keyboard when it opens, so the first thing tabbed to
  // is inside it rather than back on the page behind.
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  const set = (name: string) => (value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    // An error clears as soon as the field it belongs to is answered, rather
    // than waiting for another submit.
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const found: Record<string, string> = {}

    for (const field of form.fields) {
      const value = values[field.name].trim()
      if (field.required && !value) found[field.name] = 'Please fill in this field'
      else if (field.kind === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        found[field.name] = 'Please check this email address'
    }

    setErrors(found)

    const first = form.fields.find((field) => found[field.name])
    if (first) {
      document.getElementById(fieldId(first.name))?.focus()
      return
    }

    setSent(true)
  }

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.045, delayChildren: 0.15 } },
  }
  const rise = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.3 : 0.5, ease: EASE_OUT },
    },
  }

  const done = form.success()

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={form.title}
      initial={reduceMotion ? { opacity: 0 } : { x: 'calc(100% + 20px)' }}
      animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { x: 'calc(100% + 20px)' }}
      transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: [0.33, 0.06, 0.2, 1] }}
      // The smooth scroller claims the wheel for the whole document, so
      // without this the panel's own body would not scroll.
      data-lenis-prevent
      className="fixed inset-y-5 right-5 z-[70] flex w-[calc(100%-40px)] max-w-[560px] flex-col overflow-hidden rounded-xl bg-white focus:outline-none"
    >
      {/* Header — stays while the fields scroll under it. */}
      <div className="flex w-full shrink-0 flex-col gap-[18px] p-6 pb-0">
        {/* The cross sits on the title's line, not beside the whole block, so
            the standfirst below runs the full width of the panel instead of
            stopping short where the button used to be. On a phone that width
            is all there is; once the panel reaches its full 560 the line gets
            long enough to want holding back, hence the 90%. */}
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-start justify-between gap-4">
            <h2 className="font-grotesk text-[36px] leading-[1.19] text-ink">{form.title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-m-2 shrink-0 cursor-pointer p-2 transition-opacity duration-200 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-6 text-ink">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <p className="w-full text-[18px] leading-normal text-pretty text-ink-soft sm:max-w-[90%]">
            {form.intro}
          </p>
        </div>
        <span aria-hidden className="h-px w-full bg-line" />
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: EASE_OUT }}
          className="flex min-h-0 flex-1 flex-col items-start justify-center gap-4 overflow-y-auto p-6"
          role="status"
        >
          <img src={tickIcon} alt="" className="size-10" />
          <h3 className="font-grotesk text-[28px] leading-tight text-ink">{done.heading}</h3>
          <p className="max-w-[380px] text-[18px] leading-normal text-pretty text-ink-soft">{done.body}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 cursor-pointer rounded-full bg-navy px-6 py-3 text-[18px] font-medium text-cream transition-colors duration-300 ease-out hover:bg-[#2d5474]"
          >
            Close
          </button>
        </motion.div>
      ) : (
        <form onSubmit={submit} noValidate className="flex min-h-0 w-full flex-1 flex-col">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            data-lenis-prevent
            className="flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-6 py-[31px]"
          >
            {form.fields.map((field) => {
              const error = errors[field.name]
              const id = fieldId(field.name)
              return (
                <motion.div key={field.name} variants={rise} className="flex w-full flex-col gap-4">
                  <label htmlFor={id} className={LABEL}>
                    {field.label}
                  </label>
                  <Control
                    id={id}
                    field={field}
                    value={values[field.name]}
                    invalid={Boolean(error)}
                    onChange={set(field.name)}
                  />
                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.p
                        id={`${id}-error`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                        className="-mt-2 overflow-hidden text-[16px] leading-normal text-[#b3261e]"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Always in view: the form can be taller than the screen, and a
              submit you have to go looking for is a submit people do not find. */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="visible"
            className="shrink-0 border-t border-line p-6"
          >
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-5 rounded-full bg-navy py-0.5 pr-0.5 pl-6 text-[18px] font-medium text-cream transition-colors duration-300 ease-out hover:bg-[#2d5474] focus-visible:bg-[#2d5474] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              {form.submitLabel}
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream">
                <svg viewBox="0 0 20 20" aria-hidden className="size-5 text-ink">
                  <path
                    d="M5 15L15 5M15 5H7M15 5v8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </motion.div>
        </form>
      )}
    </motion.div>
  )
}

/* ---------------------------------------------------------------- provider */

export function FormPanelProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<FormKey | null>(null)
  const reduceMotion = useReducedMotion()
  const close = useCallback(() => setActive(null), [])
  const open = useCallback((form: FormKey) => setActive(form), [])

  // The page behind does not scroll while the panel is over it.
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll()
    return () => {
      document.body.style.overflow = previous
      resumeSmoothScroll()
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, close])

  return (
    <PanelContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="scrim"
              onClick={close}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: EASE_OUT }}
              className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[6px]"
            />
            {/* Keyed by form, so switching from one to the other rebuilds the
                panel's state instead of carrying the old answers across. */}
            <Panel key={active} form={FORMS[active]} onClose={close} />
          </>
        )}
      </AnimatePresence>
    </PanelContext.Provider>
  )
}
