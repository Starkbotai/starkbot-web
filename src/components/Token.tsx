import { Coins, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const CONTRACT_ADDRESS = '0x587Cd533F418825521f3A1daa7CCd1E7339A1B07'

export function Token() {
  const [copied, setCopied] = useState(false)
  const ref = useScrollReveal()

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-10 px-6">
      <div ref={ref} className="scroll-reveal max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-2xl border border-white/[0.08] hover:border-violet-500/20 transition-colors duration-300 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Token Icon */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-violet-500/10 rounded-xl flex items-center justify-center border border-white/[0.08]">
                <Coins className="w-7 h-7 text-[#FBFBFB]" />
              </div>
            </div>

            {/* Token Name */}
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-[#FBFBFB]">$STARKBOT</h3>
              <span className="px-2 py-0.5 bg-white/[0.06] text-[#6a6a6b] text-xs font-medium rounded-full">
                BASE
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 order-last w-full sm:order-none sm:w-auto">
              <a
                href="https://app.uniswap.org/swap?chain=base&outputCurrency=0x587Cd533F418825521f3A1daa7CCd1E7339A1B07"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-violet-500/10 hover:from-blue-500/30 hover:to-violet-500/20 text-[#FBFBFB] text-sm font-semibold rounded-lg transition-all duration-300 border border-white/[0.08]"
              >
                Buy
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.geckoterminal.com/base/pools/0x0d64a8e0d28626511cc23fc75b81c2f03e222b14f9b944b60eecc3f4ddabeddc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-[#FBFBFB] text-sm font-medium rounded-lg transition-all duration-300 border border-white/[0.08] hover:border-white/[0.12]"
              >
                Chart
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://clanker.world/clanker/0x587Cd533F418825521f3A1daa7CCd1E7339A1B07"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-[#FBFBFB] text-sm font-medium rounded-lg transition-all duration-300 border border-white/[0.08] hover:border-white/[0.12]"
              >
                Clanker
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Contract Address */}
            <div className="flex items-center gap-2 ml-auto">
              <code className="text-sm text-[#6a6a6b] font-mono bg-white/[0.04] px-3 py-1.5 rounded-lg">
                {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
              </code>
              <button
                onClick={copyAddress}
                className="p-1.5 text-[#6a6a6b] hover:text-[#FBFBFB] bg-white/[0.04] hover:bg-white/[0.08] rounded-lg transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
