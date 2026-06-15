import { OPENROUTER_API_URL, SITE_URL, SITE_NAME } from '../config'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export class OpenRouterError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'OpenRouterError'
    this.status = status
  }
}

export async function streamChat(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
    },
    body: JSON.stringify({ model, messages, stream: true }),
    signal,
  })

  if (!res.ok) {
    if (res.status === 401) throw new OpenRouterError('Chave de API inválida ou ausente.', 401)
    if (res.status === 429) throw new OpenRouterError('Limite de requisições atingido. Aguarde um momento.', 429)
    if (res.status === 402) throw new OpenRouterError('Créditos insuficientes na conta OpenRouter.', 402)
    const text = await res.text().catch(() => '')
    throw new OpenRouterError(`Erro ${res.status}: ${text || res.statusText}`, res.status)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data: ')) continue
      const data = trimmed.slice(6)
      if (data === '[DONE]') return

      try {
        const json = JSON.parse(data)
        const token: string = json.choices?.[0]?.delta?.content ?? ''
        if (token) onToken(token)
      } catch {
        // ignore malformed SSE lines
      }
    }
  }
}
