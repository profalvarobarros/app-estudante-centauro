// OpenRouter model list — update IDs here if they change.
// Check current IDs at: https://openrouter.ai/models
export const MODELS = [
  {
    id: 'google/gemini-2.0-flash-exp:free',
    label: 'Gemini 2.0 Flash (grátis)',
    free: true,
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    label: 'Llama 3.3 70B (grátis)',
    free: true,
  },
  {
    id: 'deepseek/deepseek-r1:free',
    label: 'DeepSeek R1 (grátis)',
    free: true,
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    label: 'Claude 3.5 Haiku',
    free: false,
  },
  {
    id: 'openai/gpt-4o-mini',
    label: 'GPT-4o Mini',
    free: false,
  },
] as const

export type ModelId = (typeof MODELS)[number]['id']

export const DEFAULT_MODEL: ModelId = 'google/gemini-2.0-flash-exp:free'

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
export const SITE_URL = 'https://profalvarobarros.github.io/app-estudante-centauro'
export const SITE_NAME = 'Estudante Centauro'
