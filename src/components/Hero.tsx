import { Github, Code2, Shield, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TypeWriter } from './TypeWriter'
import { AnimatedCounter } from './AnimatedCounter'
import { ChatDemo } from './ChatDemo'

const DEFINITIONS = [
  'Your autonomous agent that **owns its wallet**',
  'Your autonomous agent that **pays for itself**',
  'Your autonomous agent that **proves its identity**',
  'Your autonomous agent that **ships from chat**',
  'Your autonomous agent that **auto-monitors wallets**',
  'Your autonomous agent that **automates DeFi strategy**',
  'Your autonomous agent that **trades on your behalf**',
  'Your autonomous agent that **automates social media**',
  'Your autonomous agent that **runs on a heartbeat**',
  'Your autonomous agent that **writes and deploys code**',
  'Your autonomous agent that **automates dev-ops**',
  'Your autonomous agent that **helps your community grow**',
]

export function Hero() {
  return (
    <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column — Copy + CTAs */}
          <div className="space-y-8">
            {/* Pill badge */}
            <div
              className="inline-block opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#6a6a6b] text-xs font-mono tracking-wider uppercase">
                crypto-native ai agent
              </span>
            </div>

            {/* Dictionary-style title */}
            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <h1 className="flex items-center gap-3 flex-wrap">
                <span className="text-5xl sm:text-7xl font-display font-bold tracking-tight text-[#FBFBFB]">
                  starkbot
                </span>
                <img src="/starkbot-pfp.png" alt="StarkBot" className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/[0.08] shadow-lg shadow-white/5 translate-y-1" />
              </h1>
            </div>

            {/* Typing definition */}
            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: '0.35s' }}
            >
              <p className="text-lg sm:text-xl text-[#6a6a6b] leading-relaxed min-h-[3.5rem]">
                <TypeWriter phrases={DEFINITIONS} typingSpeed={50} deletingSpeed={25} pauseDuration={2500} />
              </p>
            </div>

            {/* Ideology tagline */}
            <div
              className="opacity-0 animate-slide-up"
              style={{ animationDelay: '0.5s' }}
            >
              <p className="text-base sm:text-lg font-medium text-[#FBFBFB]/80 tracking-wide">
                Own your agent. Own your data. Own your economy.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up"
              style={{ animationDelay: '0.6s' }}
            >
              <a
                href="https://starkbot.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-[#FBFBFB] text-[#070707] font-semibold rounded-xl transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 flex items-center justify-center gap-2 text-sm"
              >
                Get Started
                <span className="text-base">&rarr;</span>
              </a>
              <a
                href="https://github.com/ethereumdegen/stark-bot"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-transparent text-[#FBFBFB] font-semibold rounded-xl transition-all duration-300 border border-white/[0.12] hover:border-white/25 hover:bg-white/[0.04] flex items-center justify-center gap-2.5 text-sm"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>

            {/* Stat counters */}
            <div
              className="flex flex-wrap gap-6 pt-4 opacity-0 animate-slide-up"
              style={{ animationDelay: '0.75s' }}
            >
              <AnimatedCounter
                icon={<Code2 className="w-5 h-5" />}
                text="100%"
                label="Open Source"
              />
              <AnimatedCounter
                icon={<Zap className="w-5 h-5" />}
                text="x402"
                label="Native Payments"
              />
              <AnimatedCounter
                icon={<Shield className="w-5 h-5" />}
                text="EIP-8004"
                label="On-Chain ID"
              />
            </div>
          </div>

          {/* Right column — ChatDemo */}
          <div
            className="opacity-0 animate-slide-in-right lg:pl-4"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="chat-demo-glow rounded-xl transition-transform duration-300 hover:[transform:perspective(800px)_rotateY(-2deg)_rotateX(1deg)]">
              <ChatDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
