import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'
import { pauseSmoothScroll, resumeSmoothScroll } from './SmoothScroll'
import calendarIcon from '../assets/icon-journey-calendar.svg'
import tickIcon from '../assets/icon-tick-circle.svg'

/* ------------------------------------------------------------------ fields */

type Field = {
  name: string
  label: string
  kind: 'text' | 'email' | 'tel' | 'select' | 'date' | 'textarea'
  placeholder: string
  required?: boolean
  options?: string[]
}

/** The asterisk in the label is the design's; `required` is what enforces it. */
const FIELDS: Field[] = [
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
]

const EMPTY = Object.fromEntries(FIELDS.map((field) => [field.name, ''])) as Record<string, string>

/* ----------------------------------------------------------------- opening */

const BookVisitContext = createContext<() => void>(() => {})

/** Call this from anywhere to open the booking panel. */
export function useBookVisit() {
  return useContext(BookVisitContext)
}

/* ------------------------------------------------------------------- parts */

const LABEL = 'w-full text-[18px] leading-normal text-ink'
const CONTROL =
  'w-full border-b border-line bg-transparent py-[10px] text-[14px] leading-normal text-ink ' +
  'placeholder:text-[#949494] focus:border-navy focus:outline-none'

/** A chevron, drawn rather than fetched — it only ever points one way. */
function Chevron() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="pointer-events-none size-5 text-ink">
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

function Control({
  field,
  value,
  invalid,
  onChange,
}: {
  field: Field
  value: string
  invalid: boolean
  onChange: (value: string) => void
}) {
  const id = `book-${field.name}`
  const described = invalid ? `${id}-error` : undefined

  if (field.kind === 'textarea') {
    return (
      <textarea
        id={id}
        name={field.name}
        rows={3}
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
    return (
      <div className="relative flex w-full items-center">
        {/* A real select: it opens the platform's own picker, which on a phone
            is the wheel people already know how to use. */}
        <select
          id={id}
          name={field.name}
          value={value}
          aria-invalid={invalid}
          aria-describedby={described}
          onChange={(event) => onChange(event.target.value)}
          className={`${CONTROL} appearance-none pr-8 ${value ? '' : 'text-[#949494]'}`}
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map((option) => (
            <option key={option} value={option} className="text-ink">
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-0">
          <Chevron />
        </span>
      </div>
    )
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

function Panel({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

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

    for (const field of FIELDS) {
      const value = values[field.name].trim()
      if (field.required && !value) found[field.name] = 'Please fill in this field'
      else if (field.kind === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        found[field.name] = 'Please check this email address'
    }

    setErrors(found)

    const first = FIELDS.find((field) => found[field.name])
    if (first) {
      document.getElementById(`book-${first.name}`)?.focus()
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

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Book a visit"
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
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <h2 className="font-grotesk text-[36px] leading-[1.19] text-ink">Book a Visit</h2>
            <p className="text-[16px] leading-normal text-ink-soft">
              Tell us about your pet and when suits you. We’ll confirm your appointment within one
              working day.
            </p>
          </div>
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
          <h3 className="font-grotesk text-[28px] leading-tight text-ink">
            Thank you, {values.name.split(' ')[0] || 'and see you soon'}
          </h3>
          <p className="max-w-[380px] text-[16px] leading-normal text-ink-soft">
            Your request is with us. We’ll confirm {values.petName || 'your pet'}’s appointment
            within one working day.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 cursor-pointer rounded-full bg-navy px-6 py-3 text-[18px] font-medium text-cream transition-transform duration-300 ease-out active:scale-[0.98]"
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
            {FIELDS.map((field) => {
              const error = errors[field.name]
              return (
                <motion.div
                  key={field.name}
                  variants={rise}
                  className="flex w-full flex-col gap-4"
                >
                  <label htmlFor={`book-${field.name}`} className={LABEL}>
                    {field.label}
                  </label>
                  <Control
                    field={field}
                    value={values[field.name]}
                    invalid={Boolean(error)}
                    onChange={set(field.name)}
                  />
                  <AnimatePresence initial={false}>
                    {error && (
                      <motion.p
                        id={`book-${field.name}-error`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: EASE_OUT }}
                        className="-mt-2 overflow-hidden text-[14px] leading-normal text-[#b3261e]"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Always in view: the form is taller than any screen, and a submit
              you have to go looking for is a submit people do not find. */}
          <motion.div
            variants={rise}
            initial="hidden"
            animate="visible"
            className="shrink-0 border-t border-line p-6"
          >
            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-between gap-5 rounded-full bg-navy py-0.5 pr-0.5 pl-6 text-[18px] font-medium text-cream transition-transform duration-300 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            >
              Submit
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

export function BookVisitProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const close = useCallback(() => setOpen(false), [])
  const openPanel = useCallback(() => setOpen(true), [])

  // The page behind does not scroll while the panel is over it.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll()
    return () => {
      document.body.style.overflow = previous
      resumeSmoothScroll()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <BookVisitContext.Provider value={openPanel}>
      {children}
      <AnimatePresence>
        {open && (
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
            <Panel key="panel" onClose={close} />
          </>
        )}
      </AnimatePresence>
    </BookVisitContext.Provider>
  )
}
