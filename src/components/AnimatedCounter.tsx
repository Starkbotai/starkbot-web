import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  label: string
  icon: React.ReactNode
  isText?: boolean
  text?: string
}

export function AnimatedCounter({ label, icon, text }: AnimatedCounterProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-[#6a6a6b]">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-[#FBFBFB]">{text}</div>
        <div className="text-xs text-[#6a6a6b]">{label}</div>
      </div>
    </div>
  )
}
