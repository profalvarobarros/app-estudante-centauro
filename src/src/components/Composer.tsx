import { useRef, useEffect } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onStop: () => void
  isLoading: boolean
  disabled: boolean
}

export default function Composer({ value, onChange, onSubmit, onStop, isLoading, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && value.trim()) onSubmit()
    }
  }

  return (
    <div className="sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder="Digite sua mensagem… (Enter para enviar, Shift+Enter para nova linha)"
            rows={1}
            aria-label="Mensagem"
            className="flex-1 bg-transparent resize-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 py-1 max-h-40"
          />

          {isLoading ? (
            <button
              onClick={onStop}
              aria-label="Parar geração"
              className="flex-shrink-0 p-2 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              ⏹
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={!value.trim() || disabled}
              aria-label="Enviar mensagem"
              className="flex-shrink-0 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              ➤
            </button>
          )}
        </div>

        <p className="mt-1.5 text-center text-xs text-slate-400 dark:text-slate-600">
          O tutor introduz atrito de propósito — não espere respostas prontas.
        </p>
      </div>
    </div>
  )
}
