'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';

import { ButtonLink } from '@/components/ButtonLink';
import { API_BASE_URL } from '@/api/http';

type Slide = {
  id?: string;
  src: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
};

type SlideApiRow = {
  id?: string;
  imageUrl: string;
  title: string;
  description?: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

type LuxurySlideshowProps = {
  intervalMs?: number;
  variant?: 'default' | 'hero';
};

export function LuxurySlideshow({
  intervalMs = 4200,
  variant = 'default',
}: LuxurySlideshowProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const dragX = useMotionValue(0);
  const parallaxX = useTransform(dragX, [-220, 0, 220], [18, 0, -18]);

  const go = (dir: 1 | -1) => {
    if (slides.length === 0) return;
    setActive((v) => (v + dir + slides.length) % slides.length);
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/homepage-slides/public`);
        if (!res.ok) return;
        const data: unknown = await res.json();
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Slide[] = (data as SlideApiRow[]).map((s) => ({
            id: s.id,
            src: s.imageUrl,
            title: s.title,
            description: s.description ?? '',
            cta:
              s.ctaLabel && s.ctaHref
                ? { label: s.ctaLabel, href: s.ctaHref }
                : undefined,
          }));

          if (mapped.length) {
            setSlides(mapped);
            setActive(0);
          }
        }
      } catch {

      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const id = window.setInterval(() => {
      setActive((v) => (v + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, paused, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full">
        <div className="aspect-[16/7] w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      </div>
    );
  }
  const current = slides[active];
  const isHero = variant === 'hero';
  const isRemote = /^https?:\/\//.test(current.src);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={[
          'relative w-full',
          isHero ? 'aspect-[16/8] sm:aspect-[16/7]' : 'aspect-[16/7]',
        ].join(' ')}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ x: parallaxX }}
              animate={{ scale: [1, 1.06] }}
              transition={{ duration: intervalMs / 1000, ease: 'easeOut' }}
            >
              <Image
                src={current.src}
                alt={current.title}
                fill
                priority
                className="object-cover"
                unoptimized={isRemote}
                referrerPolicy={isRemote ? 'no-referrer' : undefined}
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10 z-[2]" />

            <div className="absolute inset-0 z-10 flex items-end p-6 sm:p-10">
              <motion.div
                className={isHero ? 'max-w-2xl' : 'max-w-xl'}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {isHero ? (
                  <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
                    {current.title}
                  </h1>
                ) : (
                  <div className="mt-3 line-clamp-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {current.title}
                  </div>
                )}
                <p
                  className={
                    isHero
                      ? 'mt-3 text-base leading-7 text-white/80 sm:text-lg'
                      : 'mt-3 text-sm leading-7 text-white/80'
                  }
                >
                  {current.description}
                </p>
                {current.cta ? (
                  <div className="mt-6">
                    <ButtonLink href={current.cta.href} variant="primary">
                      {current.cta.label}
                    </ButtonLink>
                  </div>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 z-[1]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          style={{ x: dragX }}
          onDragEnd={(_, info) => {
            const offset = info.offset.x;
            const velocity = info.velocity.x;
            if (offset < -60 || velocity < -600) go(1);
            else if (offset > 60 || velocity > 600) go(-1);
            dragX.set(0);
          }}
        />
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-3 sm:px-5">
        <button
          type="button"
          aria-label="Slide trước"
          onClick={() => go(-1)}
          className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Slide tiếp theo"
          onClick={() => go(1)}
          className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center pb-4">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Chuyển đến slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={[
                'h-2.5 w-2.5 rounded-full border border-white/30 transition',
                i === active
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

