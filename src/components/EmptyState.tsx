import type { Mode } from '../prompts'

interface Props {
  mode: Mode
}

export default function EmptyState({ mode }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-sm text-center space-y-4">
        <div className="text-6xl">{mode.icon}</div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{mode.label}</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{mode.tagline}</p>

        <div className="mt-6 space-y-2 text-left">
          <div className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="text-green-500 font-bold flex-shrink-0">✓</span>
            <span>{mode.doesDo}</span>
          </div>
          <div className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="text-red-400 font-bold flex-shrink-0">✗</span>
            <span>{mode.doesNotDo}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 pt-2">
          Digite uma mensagem abaixo para começar.
        </p>
      </div>
    </div>
  )
}
