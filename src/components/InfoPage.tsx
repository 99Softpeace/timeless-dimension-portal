import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type InfoSection = { title: string; icon: LucideIcon; content: ReactNode }
type InfoPageProps = { eyebrow: string; title: string; intro: string; sections: InfoSection[]; note?: ReactNode }

export default function InfoPage({ eyebrow, title, intro, sections, note }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[#f6f2ec] px-3 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-white sm:px-10 md:rounded-[3rem] md:px-16 md:py-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="relative max-w-4xl">
            <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">{eyebrow}</p>
            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl md:text-8xl">{title}</h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{intro}</p>
          </div>
        </section>

        <section className="grid gap-5 py-8 md:grid-cols-2 md:py-10">
          {sections.map(({ title: sectionTitle, icon: Icon, content }, index) => (
            <article key={sectionTitle} className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><Icon size={23} /></span>
                <span className="font-mono text-xs text-slate-400">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">{sectionTitle}</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 sm:text-base">{content}</div>
            </article>
          ))}
        </section>
        {note && <section className="rounded-[1.75rem] bg-teal-700 px-6 py-8 text-white sm:px-10"><div className="max-w-3xl text-base leading-7 text-teal-50">{note}</div></section>}
      </div>
    </main>
  )
}
