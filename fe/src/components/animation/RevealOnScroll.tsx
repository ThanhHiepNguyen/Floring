'use client';

import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type RevealEffect = 'up' | 'left' | 'right' | 'fade' | 'zoom' | 'blur';

type RevealOnScrollProps = {
  children: ReactNode;
  effect?: RevealEffect;
  className?: string;
  delayMs?: number;
};

export function RevealOnScroll({
  children,
  effect = 'up',
  className,
  delayMs = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const initial = useMemo(() => {
    switch (effect) {
      case 'left':
        return { opacity: 0, x: -40, y: 0 };
      case 'right':
        return { opacity: 0, x: 40, y: 0 };
      case 'fade':
        return { opacity: 0, x: 0, y: 0 };
      case 'zoom':
        return { opacity: 0, x: 0, y: 10, scale: 0.98 };
      case 'blur':
        return { opacity: 0, x: 0, y: 18, scale: 1, filter: 'blur(10px)' };
      case 'up':
      default:
        return { opacity: 0, x: 0, y: 28 };
    }
  }, [effect]);

  const animateIn = useMemo(() => {
    switch (effect) {
      case 'blur':
        return { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' };
      case 'zoom':
        return { opacity: 1, x: 0, y: 0, scale: 1 };
      case 'fade':
        return { opacity: 1, x: 0, y: 0 };
      case 'left':
      case 'right':
      case 'up':
      default:
        return { opacity: 1, x: 0, y: 0 };
    }
  }, [effect]);

  return (
    <motion.div
      ref={ref}
      className={className ?? 'w-full'}
      initial={initial}
      animate={isInView ? animateIn : initial}
      transition={{ duration: 0.65, ease: 'easeOut', delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
}

