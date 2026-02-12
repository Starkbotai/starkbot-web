import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Menu, Wrench, CheckCircle } from 'lucide-react'
import { getRandomSequence, ChatRow, ChatSequence, LOOP_DELAY, TYPING_SPEED } from '../config/chat-demo-config'

interface ChatMessage {
  id: string;
  type: 'user' | 'tool_call' | 'tool_result' | 'assistant';
  content: string;
  toolName?: string;
  params?: Record<string, unknown>;
  success?: boolean;
}

function parseMarkdown(text: string): string {
  let parsed = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');

  // Line breaks
  parsed = parsed.replace(/\n/g, '<br/>');

  return parsed;
}

export function ChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<ChatSequence>(() => getRandomSequence());
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll within the container only, not the whole page
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    if (currentStep >= currentSequence.rows.length) {
      // Reset after loop delay with a new random sequence
      timeoutRef.current = setTimeout(() => {
        setMessages([]);
        setInputValue('');
        setCurrentSequence(getRandomSequence());
        setCurrentStep(0);
      }, LOOP_DELAY);
      return;
    }

    const row: ChatRow = currentSequence.rows[currentStep];

    timeoutRef.current = setTimeout(() => {
      processRow(row);
    }, row.delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentStep, currentSequence]);

  const processRow = (row: ChatRow) => {
    switch (row.type) {
      case 'typing':
        // Simulate typing in the input
        setIsTyping(true);
        typeText(row.content || '', 0);
        break;

      case 'user':
        // Clear input and add user message
        setInputValue('');
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          type: 'user',
          content: row.content || ''
        }]);
        setCurrentStep(prev => prev + 1);
        break;

      case 'tool_call':
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          type: 'tool_call',
          toolName: row.toolName,
          params: row.params,
          content: ''
        }]);
        setCurrentStep(prev => prev + 1);
        break;

      case 'tool_result':
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          type: 'tool_result',
          toolName: row.toolName,
          success: row.success,
          content: row.content || ''
        }]);
        setCurrentStep(prev => prev + 1);
        break;

      case 'assistant':
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          type: 'assistant',
          content: row.content || ''
        }]);
        setCurrentStep(prev => prev + 1);
        break;
    }
  };

  const typeText = (text: string, index: number) => {
    if (index <= text.length) {
      setInputValue(text.slice(0, index));
      timeoutRef.current = setTimeout(() => {
        typeText(text, index + 1);
      }, TYPING_SPEED);
    } else {
      // Done typing, move to next step
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat container - mimics the agent chat UI */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#FBFBFB]">Agent Chat</span>
            <div className="flex items-center gap-2 bg-white/[0.05] px-2 py-1 rounded">
              <span className="text-xs text-[#6a6a6b]">Session:</span>
              <span className="text-xs font-mono text-[#FBFBFB]/60">00000042</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FBFBFB]/30" />
              <span className="text-sm text-[#6a6a6b]">Connected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#FBFBFB]/60 bg-white/[0.05] px-2 py-1 rounded">
              0x57bf...d989
            </span>
            <span className="text-xs px-2 py-0.5 bg-white/[0.06] text-[#FBFBFB]/50 rounded-full font-medium">
              USDC
            </span>
          </div>
        </div>

        {/* Messages area */}
        <div ref={messagesContainerRef} className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-[#6a6a6b]">
                <p>Start a conversation...</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
        </div>

        {/* Input area */}
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                readOnly
                placeholder="Type a message or /command..."
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[#FBFBFB] placeholder-[#6a6a6b] focus:outline-none"
              />
              {isTyping && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white animate-pulse" />
              )}
            </div>
            <button className="p-3 bg-white/[0.05] border border-white/[0.08] rounded-lg text-[#6a6a6b] hover:text-[#FBFBFB] transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button className="p-3 bg-[#FBFBFB] hover:bg-white/90 rounded-lg text-[#070707] transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Message bubble component
function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-br-md bg-[#FBFBFB] text-[#070707]">
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        </div>
      </div>
    );
  }

  if (message.type === 'tool_call') {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="w-full px-4 py-3 rounded-r-xl rounded-l-sm border-l-4 border-l-amber-500 bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">Tool</span>
          </div>
          <div className="bg-black/40 rounded-lg p-3">
            <p className="text-sm text-[#FBFBFB]/80 mb-2">
              <span className="text-[#6a6a6b]">Tool Call:</span>{' '}
              <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 text-xs font-mono">
                {message.toolName}
              </code>
            </p>
            <pre className="text-xs font-mono text-[#FBFBFB]/50 overflow-x-auto">
              <span className="text-[#6a6a6b]">json</span>
              {'\n'}
              {JSON.stringify(message.params, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'tool_result') {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="w-full px-4 py-3 rounded-r-xl rounded-l-sm border-l-4 border-l-green-500 bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-300">Result</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-900/50 text-green-300">
              success
            </span>
          </div>
          <div className="bg-black/40 rounded-lg p-3">
            <p className="text-sm text-[#FBFBFB]/80 mb-2">
              <span className="text-[#6a6a6b]">Result:</span> {message.toolName}
            </p>
            <pre className="text-xs font-mono text-[#FBFBFB]/50 overflow-x-auto whitespace-pre-wrap">
              {message.content}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'assistant') {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.05] text-[#FBFBFB]/90">
          <div
            className="prose prose-sm prose-invert max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default ChatDemo;
