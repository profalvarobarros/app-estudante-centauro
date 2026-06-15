import { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import Composer from './components/Composer'
import ApiKeyModal from './components/ApiKeyModal'
import { streamChat, OpenRouterError } from './lib/openrouter'
import type { ChatMessage } from './lib/openrouter'
import { MODES, DEFAULT_MODE } from './prompts'
import type { ModeKey } from './prompts'
import { DEFAULT_MODEL } from './config'
import type { ModelId } from './config'

function getSystemPrompt(mode: ModeKey): string {
  return MODES.find(m => m.key === mode)!.systemPrompt
}

function buildInitialMessages(mode: ModeKey): ChatMessage[] {
  return [{ role: 'system', content: getSystemPrompt(mode) }]
}

export default function App() {
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem('centauro_key') ?? '')
  const [showKeyModal, setShowKeyModal] = useState(!apiKey)
  const [mode, setMode] = useState<ModeKey>(DEFAULT_MODE)
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL)
  const [messages, setMessages] = useState<ChatMessage[]>(buildInitialMessages(DEFAULT_MODE))
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleKeySubmit = useCallback((key: string, remember: boolean) => {
    setApiKey(key)
    if (remember) sessionStorage.setItem('centauro_key', key)
    else sessionStorage.removeItem('centauro_key')
    setShowKeyModal(false)
  }, [])

  const handleModeChange = useCallback((newMode: ModeKey) => {
    if (isLoading) abortRef.current?.abort()
    setMode(newMode)
    setMessages(buildInitialMessages(newMode))
    setInput('')
    setError(null)
    setIsLoading(false)
    setIsStreaming(false)
  }, [isLoading])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newMessages: ChatMessage[] = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setError(null)
    setIsLoading(true)
    setIsStreaming(false)

    const controller = new AbortController()
    abortRef.current = controller

    let assistantContent = ''
    const assistantMsg: ChatMessage = { role: 'assistant', content: '' }

    try {
      setMessages([...newMessages, assistantMsg])
      setIsStreaming(true)

      await streamChat(
        apiKey,
        model,
        newMessages,
        (token) => {
          assistantContent += token
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
            return updated
          })
        },
        controller.signal,
      )
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // user stopped — keep whatever was generated
      } else if (err instanceof OpenRouterError) {
        setError(err.message)
        if (err.status === 401) setShowKeyModal(true)
        // remove the empty assistant bubble on real errors
        if (!assistantContent) setMessages(newMessages)
      } else {
        const msg = err instanceof Error ? err.message : 'Erro de rede. Verifique sua conexão.'
        setError(msg)
        if (!assistantContent) setMessages(newMessages)
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }, [input, isLoading, messages, apiKey, model])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return (
    <div className="flex flex-col h-dvh">
      {showKeyModal && <ApiKeyModal onSubmit={handleKeySubmit} />}

      <Header
        mode={mode}
        model={model}
        darkMode={darkMode}
        onModeChange={handleModeChange}
        onModelChange={setModel}
        onToggleDark={() => setDarkMode(d => !d)}
        onChangeKey={() => setShowKeyModal(true)}
      />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        mode={mode}
        error={error}
      />

      <Composer
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        onStop={handleStop}
        isLoading={isLoading}
        disabled={showKeyModal}
      />
    </div>
  )
}
