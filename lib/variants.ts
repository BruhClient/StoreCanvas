export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

import { Variants } from "framer-motion";

export const storeCanvasStageVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,

    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] as const },
  },
  exit: {
    opacity: 0,

    transition: { duration: 0.3, ease: [0.45, 0, 0.55, 1] as const },
  },
};

export const formTransitionVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100, // slide in from right if next, left if prev
    scale: 0.98,
  }),
  visible: (direction?: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100, // slide out to opposite side
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};
