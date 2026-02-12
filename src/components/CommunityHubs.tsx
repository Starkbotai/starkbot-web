import { ExternalLink } from 'lucide-react'
import hubs from '../config/community-hubs.json'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function CommunityHubs() {
  const ref = useScrollReveal()

  return (
    <section className="py-10 px-6">
      <div ref={ref} className="scroll-reveal max-w-5xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-[#FBFBFB] mb-6">Community Hubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hubs.map((hub) => (
            <a
              key={hub.url}
              href={hub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl border border-white/[0.08] hover:border-violet-500/20 p-5 transition-all duration-300 hover:scale-[1.02] card-accent-glow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#FBFBFB]">{hub.title}</h3>
                <ExternalLink className="w-4 h-4 text-[#3a3a3b] group-hover:text-[#6a6a6b] transition-colors" />
              </div>
              <p className="text-sm text-[#6a6a6b] leading-relaxed">{hub.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
