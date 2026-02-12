// Chat demo configuration
// Each row represents an action in the simulated chat

export type ChatRowType = 'typing' | 'user' | 'tool_call' | 'tool_result' | 'assistant';

export interface ChatRow {
  type: ChatRowType;
  delay: number; // ms before this action starts
  content?: string;
  toolName?: string;
  params?: Record<string, unknown>;
  success?: boolean;
}

export interface ChatSequence {
  id: string;
  name: string;
  rows: ChatRow[];
}

// All available chat sequences
export const chatSequences: ChatSequence[] = [
  {
    id: 'install-skill',
    name: 'Install Skill & Use It',
    rows: [
      {
        type: 'typing',
        delay: 1000,
        content: 'install the alchemy skill from https://4claw.com/skills/alchemy.md and look up my wallet balance'
      },
      {
        type: 'user',
        delay: 500,
        content: 'install the alchemy skill from https://4claw.com/skills/alchemy.md and look up my wallet balance'
      },
      {
        type: 'tool_call',
        delay: 800,
        toolName: 'install_skill',
        params: {
          url: 'https://4claw.com/skills/alchemy.md',
          name: 'alchemy'
        }
      },
      {
        type: 'tool_result',
        delay: 1200,
        toolName: 'install_skill',
        success: true,
        content: JSON.stringify({
          status: 'installed',
          skill: 'alchemy',
          tools: ['get_token_balances', 'get_transactions', 'get_nfts'],
          source: '4claw.com'
        }, null, 2)
      },
      {
        type: 'tool_call',
        delay: 600,
        toolName: 'get_token_balances',
        params: {
          address: '0x57bf...d989',
          chain: 'base'
        }
      },
      {
        type: 'tool_result',
        delay: 1400,
        toolName: 'get_token_balances',
        success: true,
        content: JSON.stringify({
          balances: [
            { token: 'ETH', balance: '1.247', value_usd: '$4,051' },
            { token: 'USDC', balance: '2,500.00', value_usd: '$2,500' },
            { token: 'STARKBOT', balance: '850,000', value_usd: '$357' }
          ],
          total_usd: '$6,908'
        }, null, 2)
      },
      {
        type: 'assistant',
        delay: 600,
        content: "Installed the **alchemy** skill from 4claw.com. Here's your wallet balance on Base:\n\n- **1.247 ETH** ($4,051)\n- **2,500 USDC** ($2,500)\n- **850K STARKBOT** ($357)\n\nTotal: **$6,908**"
      }
    ]
  },
  {
    id: 'starkbot-price-discord',
    name: 'StarkBot Price to Discord',
    rows: [
      {
        type: 'typing',
        delay: 1000,
        content: 'look up the starkbot price and post it to the discord'
      },
      {
        type: 'user',
        delay: 500,
        content: 'look up the starkbot price and post it to the discord'
      },
      {
        type: 'tool_call',
        delay: 800,
        toolName: 'token_price',
        params: {
          token: 'STARKBOT',
          chain: 'base'
        }
      },
      {
        type: 'tool_result',
        delay: 1400,
        toolName: 'token_price',
        success: true,
        content: JSON.stringify({
          token: 'STARKBOT',
          price_usd: 0.00042069,
          price_eth: 0.000000128,
          market_cap: 420690,
          volume_24h: 12500,
          change_24h: '+15.3%'
        }, null, 2)
      },
      {
        type: 'tool_call',
        delay: 600,
        toolName: 'discord_send',
        params: {
          channel: 'price-updates',
          message: 'STARKBOT Price Update: $0.00042069 (+15.3% 24h)'
        }
      },
      {
        type: 'tool_result',
        delay: 1000,
        toolName: 'discord_send',
        success: true,
        content: JSON.stringify({
          status: 'sent',
          channel: 'price-updates',
          message_id: '1234567890'
        }, null, 2)
      },
      {
        type: 'assistant',
        delay: 600,
        content: "Done! STARKBOT is currently trading at **$0.00042069** (up 15.3% in the last 24h). I've posted the update to the #price-updates channel on Discord."
      }
    ]
  },
  {
    id: 'token-analysis-tweet',
    name: 'Token Analysis Tweet',
    rows: [
      {
        type: 'typing',
        delay: 1000,
        content: 'research the token STARKBOT and tweet a full analysis report to our followers'
      },
      {
        type: 'user',
        delay: 500,
        content: 'research the token STARKBOT and tweet a full analysis report to our followers'
      },
      {
        type: 'tool_call',
        delay: 800,
        toolName: 'token_research',
        params: {
          token: 'STARKBOT',
          chain: 'base',
          include: ['price', 'holders', 'liquidity', 'volume', 'socials']
        }
      },
      {
        type: 'tool_result',
        delay: 1800,
        toolName: 'token_research',
        success: true,
        content: JSON.stringify({
          token: 'STARKBOT',
          price_usd: 0.00042069,
          market_cap: 420690,
          holders: 1847,
          liquidity: '$89,200',
          volume_24h: '$12,500',
          change_24h: '+15.3%',
          deployer: 'clanker.world',
          chain: 'Base'
        }, null, 2)
      },
      {
        type: 'tool_call',
        delay: 600,
        toolName: 'twitter_post',
        params: {
          thread: true,
          content: '🔍 $STARKBOT Deep Dive — the crypto-native AI agent token on @base\n\n📊 Price: $0.00042 (+15.3% 24h)\n💰 MCap: $420K\n👥 Holders: 1,847\n💧 Liquidity: $89.2K\n\nOpen source agent framework with x402 payments, on-chain identity (EIP-8004), and autonomous DeFi.\n\nOne to watch. 👀'
        }
      },
      {
        type: 'tool_result',
        delay: 1400,
        toolName: 'twitter_post',
        success: true,
        content: JSON.stringify({
          status: 'posted',
          tweet_id: '1893847261038',
          url: 'https://x.com/starkbotai/status/1893847261038'
        }, null, 2)
      },
      {
        type: 'assistant',
        delay: 600,
        content: "Done! I researched **$STARKBOT** on Base and posted a full analysis thread to Twitter.\n\nKey stats: **$0.00042** price, **1,847 holders**, **$89.2K liquidity**, up **15.3%** in 24h.\n\nThread is live — check it out on X."
      }
    ]
  },
  {
    id: 'swap-tokens',
    name: 'Token Swap',
    rows: [
      {
        type: 'typing',
        delay: 1000,
        content: 'swap 0.1 ETH for USDC'
      },
      {
        type: 'user',
        delay: 500,
        content: 'swap 0.1 ETH for USDC'
      },
      {
        type: 'tool_call',
        delay: 800,
        toolName: 'get_swap_quote',
        params: {
          from_token: 'ETH',
          to_token: 'USDC',
          amount: '0.1',
          chain: 'base'
        }
      },
      {
        type: 'tool_result',
        delay: 1400,
        toolName: 'get_swap_quote',
        success: true,
        content: JSON.stringify({
          from: '0.1 ETH',
          to: '324.50 USDC',
          rate: '1 ETH = 3245 USDC',
          gas_estimate: '$0.12',
          slippage: '0.5%'
        }, null, 2)
      },
      {
        type: 'tool_call',
        delay: 600,
        toolName: 'execute_swap',
        params: {
          from_token: 'ETH',
          to_token: 'USDC',
          amount: '0.1',
          min_received: '322.87'
        }
      },
      {
        type: 'tool_result',
        delay: 1800,
        toolName: 'execute_swap',
        success: true,
        content: JSON.stringify({
          status: 'confirmed',
          tx_hash: '0x8f2a...3b4c',
          received: '324.12 USDC'
        }, null, 2)
      },
      {
        type: 'assistant',
        delay: 600,
        content: "Swap complete! You received **324.12 USDC** for 0.1 ETH.\n\nTransaction: `0x8f2a...3b4c`"
      }
    ]
  }
];

// Get a random chat sequence
export function getRandomSequence(): ChatSequence {
  const index = Math.floor(Math.random() * chatSequences.length);
  return chatSequences[index];
}

// Loop delay - how long to wait before restarting the demo
export const LOOP_DELAY = 4000;

// Typing speed in ms per character
export const TYPING_SPEED = 40;
