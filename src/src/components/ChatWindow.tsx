import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../lib/openrouter'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import EmptyState from './EmptyState'
import { MODES } from '../prompts'
import type { ModeKey } from '../prompts'

interface Props {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  mode: ModeKey
  error: string | null
}

export default function ChatWindow({ messages, isLoading, isStreaming, mode, error }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const visibleMessages = messages.filter(m => m.role !== 'system')
  const currentMode = MODES.find(m => m.key === mode)!

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <main className="flex-1 overflow-y-auto" role="log" aria-label="Conversa">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {visibleMessages.length === 0 && !isLoading ? (
          <EmptyState mode={currentMode} />
        ) : (
          <div className="space-y-4">
            {visibleMessages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                isStreaming={isStreaming && i === visibleMessages.length - 1 && msg.role === 'assistant'}
              />
            ))}
            {isLoading && !isStreaming && <TypingIndicator />}

            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                <span aria-hidden>⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  )
}
