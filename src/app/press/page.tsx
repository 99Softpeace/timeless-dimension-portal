import Link from 'next/link'

export default function PressPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <section className="max-w-4xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4">Press</p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-none mb-8">
          Senator stories and media enquiries.
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-10">
          For collaborations, media requests, store features, and brand enquiries, reach the Senator team through the concierge contact channel.
        </p>
        <Link
          href="/contact"
          className="inline-flex rounded-full bg-slate-900 px-8 py-4 font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Send an Enquiry
        </Link>
      </section>
    </main>
  )
}
