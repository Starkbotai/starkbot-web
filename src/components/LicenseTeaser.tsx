import { Shield, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function LicenseTeaser() {
  const ref = useScrollReveal()

  return (
    <section className="py-28 px-6 border-t border-white/[0.06]">
      <div ref={ref} className="scroll-reveal max-w-4xl mx-auto">
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-12 overflow-hidden accent-border-hover">
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/15 to-violet-500/10 border border-white/[0.12] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#FBFBFB]/70" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#FBFBFB] mb-3">
                The Stark License
              </h2>
              <p className="text-[#6a6a6b] text-lg leading-relaxed mb-4">
                Every StarkBot agent is backed by an on-chain identity registered through{' '}
                <span className="text-[#FBFBFB]/80">EIP-8004</span> on Base. The Stark License is a
                verifiable, permissionless credential that ties your agent to a wallet address,
                enabling trust, micropayments, and interoperability across the open web.
              </p>
              <p className="text-[#3a3a3b] text-sm mb-6">
                Register your agent's identity on-chain and unlock the full capabilities of
                crypto-native AI.
              </p>

              <Link
                to="/starklicense"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.08] text-[#FBFBFB] font-medium rounded-xl transition-all duration-300 border border-white/[0.08] hover:border-white/[0.16] group"
              >
                Learn about the Stark License
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
