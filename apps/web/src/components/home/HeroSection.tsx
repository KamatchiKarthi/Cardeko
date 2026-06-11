import { useState } from 'react'
import { HiSparkles, HiArrowRight, HiMagnifyingGlass } from 'react-icons/hi2'
import { MdOutlineExplore } from 'react-icons/md'
import { Link } from 'react-router-dom'

const POPULAR_CHIPS = [
  'Tata Nexon',
  'Maruti Swift',
  'Hyundai Creta',
  'Kia Seltos',
  'Toyota Innova',
  'Maruti Brezza',
]

export default function HeroSection() {
  const [query, setQuery] = useState('')

  return (
    <section className="bg-brand-primary px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* ── Left ── */}
        <div className="flex flex-col items-start">
          {/* AI label */}
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            <HiSparkles className="size-3.5 text-brand-highlight" />
            AI Powered
          </span>

          {/* Heading */}
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
            Confused about
            <br className="hidden sm:block" /> which car to buy?
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
            Answer 5 quick questions and our AI builds a personalised shortlist — matched to your
            budget, lifestyle, and fuel preference.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/quiz"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand-highlight px-6 text-base font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:brightness-105"
            >
              Find My Car
              <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs font-semibold">
                5 Questions
              </span>
              <HiArrowRight className="size-4" />
            </Link>

            <Link
              to="/explore"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/40 px-6 text-base font-semibold text-white transition hover:bg-white/10"
            >
              <MdOutlineExplore className="size-5" />
              Browse All Cars
            </Link>
          </div>
        </div>

        {/* ── Right — dark search card ── */}
        <div className="w-full rounded-2xl border border-white/10 bg-[#0d1e38] p-6 shadow-xl shadow-black/30 sm:p-8">
          <p className="mb-1 text-sm font-semibold text-white/60 uppercase tracking-wider">
            Quick Search
          </p>
          <p className="mb-4 text-lg font-bold text-white">Find any car instantly</p>

          {/* Search input */}
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Tata Nexon, Maruti Swift…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-accent focus:bg-white/8 focus:ring-2 focus:ring-brand-accent/30"
            />
          </div>

          {/* Popular chips */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Popular right now
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CHIPS.map((name) => (
                <button
                  key={name}
                  onClick={() => setQuery(name)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-accent/50 hover:bg-brand-accent/10 hover:text-white"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Search CTA */}
          <button
            disabled={query.trim().length === 0}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-accent py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HiMagnifyingGlass className="size-4" />
            Search Cars
          </button>
        </div>
      </div>
    </section>
  )
}
