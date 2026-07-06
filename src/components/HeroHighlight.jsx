import React from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'

function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

const dotPattern = (color) => ({
  backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
  backgroundSize: '16px 16px',
})

export function HeroHighlight({ children, className, containerClassName }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove(e) {
    const { currentTarget, clientX, clientY } = e
    if (!currentTarget) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn('hero-highlight-container', containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-highlight-dots" style={dotPattern('rgba(212,212,212,0.9)')} aria-hidden />
      <motion.div
        className="hero-highlight-mask"
        style={{
          ...dotPattern('rgba(23, 108, 88, 0.85)'),
          WebkitMaskImage: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
          maskImage: useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
        }}
        aria-hidden
      />

      <div className={cn('hero-highlight-content', className)}>{children}</div>
    </div>
  )
}

export function Highlight({ children, className }) {
  return (
    <motion.span
      initial={{ backgroundSize: '0% 100%' }}
      animate={{ backgroundSize: '100% 100%' }}
      transition={{ duration: 2, ease: 'linear', delay: 0.5 }}
      style={{ backgroundRepeat: 'no-repeat', backgroundPosition: 'left', display: 'inline-block' }}
      className={cn('highlight-inline', className)}
    >
      {children}
    </motion.span>
  )
}

export function HeroHighlightDemo({ title = 'Nisab Lantern' }) {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [20, -5, 0] }}
        transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
        className="hero-demo-title"
      >
        <Highlight>{title}</Highlight>
      </motion.h1>
    </HeroHighlight>
  )
}

export default HeroHighlight
