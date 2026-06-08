import { useState } from 'react'

interface Props {
  onSubmit: (key: string, remember: boolean) => void
}

export default function ApiKeyModal({ onSubmit }: Props) {
  const [key, setKey] = useState('')
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = key.trim()
    if (trimmed) onSubmit(trimmed, remember)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <span className="text-5xl">🎓</span>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Estudante Centauro</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tutor de IA que ensina pelo atrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Chave de API do OpenRouter
            </label>
            <input
              id="api-key"
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-or-..."
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              aria-describedby="key-hint"
            />
            <p id="key-hint" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Não tem conta?{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 underline"
              >
                Crie uma chave gratuita no OpenRouter
              </a>
              . Modelos marcados com "(grátis)" funcionam sem custo.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400">
              Lembrar nesta aba (sessionStorage) — a chave some ao fechar a aba
            </label>
          </div>

          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          🔒 Sua chave fica apenas no seu navegador, na memória desta sessão. Nada é enviado a terceiros além do OpenRouter.
        </p>
      </div>
    </div>
  )
}
