import { useEffect, useRef } from 'react'

export function Stars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const numStars = 120
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div')

      // ~15% blue tinted, ~10% purple tinted, rest white
      const roll = Math.random()
      if (roll < 0.15) {
        star.className = 'star star--blue'
      } else if (roll < 0.25) {
        star.className = 'star star--purple'
      } else {
        star.className = 'star'
      }

      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.animationDelay = `${Math.random() * 5}s`
      star.style.animationDuration = `${4 + Math.random() * 4}s`
      const size = Math.random() * 1.5 + 0.5
      star.style.width = `${size}px`
      star.style.height = `${size}px`
      star.style.opacity = `${0.15 + Math.random() * 0.25}`
      container.appendChild(star)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    />
  )
}
