"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  ssr: false,
})

const Newsletter = dynamic(() => import('@/components/Newsletter'), {
  ssr: false,
})

const heroVideoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'

const featuredCategories = [
  {
    name: 'Watches',
    href: '/watches',
    image: '/assets/images/editorial/model1.jpg',
    label: 'Signature wristwear',
  },
  {
    name: 'Bags',
    href: '/bags',
    image: '/assets/images/editorial/model5.jpg',
    label: 'Structured carry pieces',
  },
  {
    name: 'Clothes',
    href: '/clothes',
    image: '/assets/images/editorial/model2.jpg',
    label: 'Wardrobe essentials',
  },
  {
    name: 'Belts',
    href: '/belts',
    image: '/assets/images/editorial/model6.jpg',
    label: 'Sharp leather details',
  },
  {
    name: 'Eyeglasses',
    href: '/eyeglasses',
    image: '/assets/images/editorial/model9.jpg',
    label: 'Frames with presence',
  },
]

type FadeInProps = {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

function FadeIn({ children, delay = 0, duration = 1000, className = '' }: FadeInProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-opacity ease-out ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

type AnimatedHeadingProps = {
  text: string
  initialDelay?: number
  charDelay?: number
}

function AnimatedHeading({ text, initialDelay = 200, charDelay = 30 }: AnimatedHeadingProps) {
  const [ready, setReady] = useState(false)
  const lines = text.split('\n')
  let charIndex = 0

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), initialDelay)
    return () => window.clearTimeout(timer)
  }, [initialDelay])

  return (
    <h1 className="mx-auto max-w-6xl text-center font-sans text-[clamp(3.2rem,10vw,9rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white antialiased">
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-hidden pb-2">
          {line.split('').map((char) => {
            const delay = charIndex * charDelay
            charIndex += 1
            return (
              <span
                key={`${lineIndex}-${charIndex}`}
                className={`inline-block transition-all duration-500 ease-out ${ready ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export default function ClientHome() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)

  useEffect(() => {
    const prefersReducedData = 'connection' in navigator && Boolean((navigator as any).connection?.saveData)
    if (prefersReducedData) return

    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const delay = isDesktop ? 900 : 1800
    const timer = window.setTimeout(() => setShouldLoadVideo(true), delay)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <Image
          src="/assets/images/editorial/model1.jpg"
          alt="Senator watches and fashion editorial"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {shouldLoadVideo && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
            src={heroVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/images/editorial/model1.jpg"
            aria-hidden="true"
            onCanPlay={(event) => {
              event.currentTarget.dataset.ready = 'true'
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-12 pt-32 md:px-12 lg:px-16">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <FadeIn delay={0} duration={350}>
              <p className="mb-7 font-mono text-xs uppercase tracking-[0.35em] text-white/80">
                Senator Watches
              </p>
            </FadeIn>

            <AnimatedHeading text={`Shaping style\nwith timeless watches.`} initialDelay={0} charDelay={8} />

            <FadeIn delay={120} duration={350} className="mx-auto mt-8 max-w-2xl">
              <p className="text-lg font-light leading-relaxed text-white/85 md:text-xl">
                Discover signature watches and refined accessories selected for presence, precision, and the way you arrive.
              </p>
            </FadeIn>

            <FadeIn delay={180} duration={350} className="mt-9 flex w-full flex-col items-center gap-6">
              <p className="max-w-xl text-center text-xs uppercase tracking-[0.28em] text-white/70 sm:text-sm">
                Watches. Bags. Clothes. Belts. Eyeglasses.
              </p>
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/watches"
                  className="rounded-full bg-white px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-black transition-transform hover:scale-105"
                >
                  Explore Watches
                </Link>
                <Link
                  href="/bags"
                  className="liquid-glass rounded-full px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white transition-transform hover:scale-105"
                >
                  Explore Bags
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="min-h-screen w-full overflow-hidden bg-white px-3 pb-1.5 pt-1.5 md:px-5 md:pb-2 md:pt-2">
        <div className="grid min-h-screen grid-rows-[auto_auto_auto_1fr] gap-1.5 md:gap-2">
          {['Signature Watches', 'Sharp Leather Goods', 'Frames & Wardrobe Details'].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="relative flex h-14 items-center justify-center overflow-hidden rounded-xl bg-stone-100 md:h-20 md:rounded-2xl"
            >
              <Image
                src={index === 0 ? '/assets/images/editorial/model3.jpg' : index === 1 ? '/assets/images/editorial/model6.jpg' : '/assets/images/editorial/model8.jpg'}
                alt={item}
                fill
                className="object-cover opacity-45"
                sizes="100vw"
              />
              <span className="relative z-10 text-center text-lg font-black text-black md:text-3xl">{item}</span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative min-h-[620px] overflow-hidden rounded-xl md:rounded-2xl"
          >
            <Image
              src="/assets/images/editorial/model1.jpg"
              alt="Senator watch editorial"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <p className="absolute left-4 top-4 z-10 max-w-[230px] text-xs font-semibold leading-5 text-white md:left-7 md:top-7 md:max-w-[330px] md:text-sm">
              Curated accessories for the client who wants every arrival to feel intentional.
            </p>
            <div className="absolute bottom-5 left-3 z-10 md:bottom-8 md:left-4">
              <span className="mb-2 block text-xs font-semibold text-white/85 md:text-sm">Senator Accessories Edit</span>
              <h2 className="text-[clamp(3.2rem,11vw,11rem)] font-black leading-[0.79] tracking-tight text-white">
                Complete<br />Presence
              </h2>
            </div>
            <Link href="/watches" className="absolute bottom-6 right-4 z-10 rounded-full bg-white px-6 py-3 text-sm font-black text-black transition-transform hover:scale-105 md:bottom-10 md:right-8 md:px-8 md:py-5 md:text-xl">
              Explore Watches
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="min-h-screen w-full overflow-hidden bg-white px-3 pb-1.5 pt-1.5 md:h-screen md:px-5 md:pb-2 md:pt-2">
        <div className="grid min-h-screen grid-cols-1 grid-rows-[auto_auto_auto_auto] gap-1.5 md:h-full md:min-h-0 md:grid-cols-2 md:grid-rows-[1fr_1fr_0.8fr] md:gap-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative min-h-[180px] overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
          >
            <Image src="/assets/images/editorial/model5.jpg" alt="Luxury bag edit" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <h2 className="absolute left-5 top-4 z-10 text-2xl font-black text-white md:left-7 md:top-6 md:text-3xl">Bag Gallery</h2>
            <p className="absolute bottom-4 left-5 z-10 text-xs font-semibold text-white md:bottom-6 md:left-7 md:text-sm">Structured carry pieces</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative min-h-[260px] overflow-hidden rounded-xl md:row-span-2 md:min-h-0 md:rounded-2xl"
          >
            <Image src="/assets/images/editorial/model2.jpg" alt="Watch and jewelry styling" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <p className="absolute bottom-20 left-5 z-10 max-w-xs text-xs font-semibold leading-5 text-white md:bottom-24 md:left-7 md:text-sm">
              Build the outfit around the piece: watch, chain, frame, belt, then the final bag.
            </p>
            <Link href="/watches" className="absolute bottom-4 right-4 z-10 rounded-full bg-white px-5 py-3 text-base font-black text-black transition-transform hover:scale-105 md:bottom-6 md:right-6 md:px-8 md:py-5 md:text-xl">
              Watches
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative min-h-[190px] overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
          >
            <Image src="/assets/images/editorial/model6.jpg" alt="Leather belt close-up" fill className="object-cover object-center" sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-black/25" />
            <h2 className="absolute left-5 top-4 z-10 text-[clamp(3rem,7vw,6rem)] font-black leading-[0.9] text-white md:left-7 md:top-6">
              Sharp<br />Belts
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative col-span-1 min-h-[240px] overflow-hidden rounded-xl md:col-span-2 md:min-h-0 md:rounded-2xl"
          >
            <Image src="/assets/images/editorial/model8.jpg" alt="Eyeglasses collection" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 z-10 flex flex-wrap gap-1.5 p-2 md:flex-nowrap md:gap-2 md:p-3">
              {featuredCategories.slice(0, 4).map((category, index) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`flex min-w-[calc(50%-4px)] flex-1 flex-col justify-between rounded-xl p-3 backdrop-blur-xl transition-transform hover:scale-[1.02] md:min-w-0 md:rounded-2xl md:p-5 ${index === 0 ? 'bg-white/90 text-black' : 'bg-white/20 text-white'}`}
                >
                  <h3 className="whitespace-pre-line text-xl font-black leading-[1.05] md:text-4xl">{category.name}</h3>
                  <span className={`self-end flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold md:h-12 md:w-12 md:text-sm ${index === 0 ? 'border-black text-black' : 'border-white text-white'}`}>
                    0{index + 1}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="min-h-screen w-full overflow-hidden bg-white px-3 pb-1.5 pt-1.5 md:h-screen md:px-5 md:pb-2 md:pt-2">
        <div className="grid min-h-screen grid-cols-1 gap-1.5 md:h-full md:min-h-0 md:grid-cols-2 md:gap-2">
          <div className="flex flex-col gap-1.5 md:gap-2">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="flex min-h-[210px] flex-[1.2] flex-col justify-between rounded-xl bg-stone-50 p-5 md:min-h-0 md:rounded-2xl md:p-7"
            >
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.95] text-black">
                Styled<br />to Finish
              </h2>
              <p className="text-xs font-semibold text-black md:text-sm">Watches, bags, belts, clothes and frames</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="flex min-h-[180px] flex-1 gap-1.5 md:min-h-0 md:gap-2"
            >
              <div className="relative flex-1 overflow-hidden rounded-xl md:rounded-2xl">
                <Image src="/assets/images/editorial/model6.jpg" alt="Leather belt detail" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative flex-1 overflow-hidden rounded-xl md:rounded-2xl">
                <Image src="/assets/images/editorial/model9.jpg" alt="Tortoise eyeglasses detail" fill className="object-cover" sizes="25vw" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              className="flex min-h-[180px] flex-[0.8] items-end justify-between rounded-xl bg-zinc-200 p-5 md:min-h-0 md:rounded-2xl md:p-7"
            >
              <div>
                <p className="mb-3 text-xs font-semibold text-black md:text-sm">Personal Shopping</p>
                <h3 className="text-xl font-black leading-6 text-black md:text-3xl md:leading-8">
                  Need help<br />matching the<br />right pieces?
                </h3>
              </div>
              <Link href="/contact" className="rounded-full bg-white px-5 py-3 text-base font-black text-black transition-transform hover:scale-105 md:px-8 md:py-5 md:text-xl">
                Chat Us
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative min-h-[520px] overflow-hidden rounded-xl md:min-h-0 md:rounded-2xl"
          >
            <Image src="/assets/images/editorial/model4.jpg" alt="Black luxury bag editorial" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 md:bottom-5 md:left-5 md:right-5 md:gap-2">
              <Link href="/bags" className="flex h-36 flex-1 flex-col justify-between rounded-xl bg-white p-3 md:h-52 md:rounded-2xl md:p-5">
                <h4 className="text-lg font-black leading-5 text-black md:text-2xl md:leading-7">The Bag<br />That Holds<br />the Look</h4>
                <span className="self-end flex h-9 w-9 items-center justify-center rounded-full border border-black md:h-12 md:w-12">?</span>
              </Link>
              <Link href="/eyeglasses" className="flex h-36 flex-1 flex-col justify-between rounded-xl bg-white/20 p-3 backdrop-blur-xl md:h-52 md:rounded-2xl md:p-5">
                <h4 className="text-lg font-black leading-5 text-white md:text-2xl md:leading-7">Frames<br />with Real<br />Presence</h4>
                <span className="self-end flex h-9 w-9 items-center justify-center rounded-full border border-white text-white md:h-12 md:w-12">?</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Testimonials />
      <Newsletter />
    </div>
  )
}





