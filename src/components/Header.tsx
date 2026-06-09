import { MODES } from '../prompts'
import type { ModeKey } from '../prompts'
import { MODELS } from '../config'
import type { ModelId } from '../config'

interface Props {
  mode: ModeKey
  model: ModelId
  darkMode: boolean
  onModeChange: (mode: ModeKey) => void
  onModelChange: (model: ModelId) => void
  onToggleDark: () => void
  onChangeKey: () => void
}

export default function Header({ mode, model, darkMode, onModeChange, onModelChange, onToggleDark, onChangeKey }: Props) {
  const currentMode = MODES.find(m => m.key === mode)!

  const selectClass =
    'text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-2">

        {/* Logo */}
        <span className="text-xl flex-shrink-0" aria-hidden>🎓</span>
        <span className="font-bold text-slate-900 dark:text-white hidden sm:block flex-shrink-0">
          Estudante Centauro
        </span>

        <div className="flex-1" />

        {/* Mode selector — dropdown */}
        <select
          value={mode}
          onChange={e => onModeChange(e.target.value as ModeKey)}
          aria-label="Modo de tutoria"
          className={selectClass}
        >
          {MODES.map(m => (
            <option key={m.key} value={m.key}>
              {m.icon} {m.label}
            </option>
          ))}
        </select>

        {/* Model selector */}
        <select
          value={model}
          onChange={e => onModelChange(e.target.value as ModelId)}
          aria-label="Modelo de IA"
          className={`${selectClass} max-w-[150px]`}
        >
          {MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Change API key */}
        <button
          onClick={onChangeKey}
          aria-label="Trocar chave de API"
          title="Trocar chave de API"
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-sm"
        >
          🔑
        </button>
      </div>

      {/* Mode tagline */}
      <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span aria-hidden>{currentMode.icon}</span>
        <span>
          <strong className="text-slate-700 dark:text-slate-300">{currentMode.label}</strong>
          {' — '}{currentMode.tagline}
        </span>
      </div>
    </header>
  )
}
