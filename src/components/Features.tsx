import { AlertTriangle } from 'lucide-react'
import MindMapDemo from './MindMapDemo'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function Features() {
  const mindMapRef = useScrollReveal()
  const warningRef = useScrollReveal()

  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Mind Map Demo Section */}
        <div ref={mindMapRef} className="scroll-reveal mb-20">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-4 text-[#FBFBFB]">
            Autonomous Mind Map
          </h2>
          <p className="text-[#6a6a6b] text-center mb-10 max-w-2xl mx-auto">
            Define random actions for your bot to execute on heartbeat pulses. Build a tree of possible behaviors.
          </p>
          <div className="chat-demo-glow rounded-xl">
            <MindMapDemo />
          </div>
        </div>

        {/* Warning Banner */}
        <div ref={warningRef} className="scroll-reveal mb-12 p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-[#6a6a6b]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#FBFBFB]/90 mb-2">WARNING</h3>
              <p className="text-[#6a6a6b] leading-relaxed">
                Starkbot is extremely powerful agentic software.
                Starkbot is not responsible for data loss or security intrusions.
                Always run Starkbot in a sandboxed VPS container.
              </p>
              <p className="text-[#6a6a6b] leading-relaxed mt-2">
                Feel free to contribute to development with a{' '}
                <a
                  href="https://github.com/ethereumdegen/stark-bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FBFBFB] hover:text-white/80 underline"
                >
                  pull request
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
