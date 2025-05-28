'use client'

import { motion } from 'framer-motion'

const stairAnimation = {
  initial: {
    top: '0%',
  },
  animate: {
    top: '100%',
  },
  exit: {
    top: ['100%', '0%'],
  },
}

const reverseIndex = (index: number) => {
  const totalSteps = 6

  return totalSteps - index - 1
}

export function Stairs() {
  return (
    <>
      {[...Array(6)].map((__, i) => {
        return (
          <motion.div
            key={String(i)}
            variants={stairAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
              delay: reverseIndex(i) * 0.1,
            }}
            className="relative size-full bg-blue-950/45"
          />
        )
      })}
    </>
  )
}
