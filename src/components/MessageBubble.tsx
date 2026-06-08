import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import type { ChatMessage } from '../lib/openrouter'

interface Props {
  message: ChatMessage
  isStreaming?: boolean
}

export default function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}
        aria-hidden
      >
        {isUser ? 'V' : '🎓'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:my-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-slate-400 dark:bg-slate-500 ml-0.5 animate-pulse" aria-hidden />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm" aria-hidden>
        🎓
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1" aria-label="Digitando...">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
      </div>
    </div>
  )
}
