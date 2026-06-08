# Estudante Centauro — Plano de Desenvolvimento e Prompt para Claude Code

Documento de trabalho para construir a implementação de referência citada no artigo. Contém: (1) decisões de arquitetura, (2) plano faseado, (3) o prompt mestre para colar no Claude Code, com os system prompts e a especificação do README embutidos.

---

## 1. Decisões de arquitetura (o porquê)

| Exigência sua | Decisão | Razão |
|---|---|---|
| Não armazenar nada | SPA estática, sem backend, sem banco, sem analytics, sem cookies | Nada para persistir e nada para vazar |
| Barato quando testarem | BYOK (cada usuário usa a própria chave do OpenRouter) | Você não paga pelos testes; a chave nunca fica no seu código |
| Publicar no próprio GitHub | Build estático no GitHub Pages | Hospedagem gratuita, sem servidor |
| Simples, mas não simplório | React + Vite + TypeScript + Tailwind, streaming, Markdown + LaTeX | Stack enxuta, visual moderno, código limpo |

A chave do OpenRouter fica **apenas em memória** (estado da sessão). Ao recarregar a página, o usuário cola de novo. Sem `localStorage` por padrão, para honrar o "não armazena nada" (deixe um toggle opcional de `sessionStorage`, desligado por padrão, claramente rotulado).

---

## 2. Plano faseado

Cada fase é testável e termina com commit. Faça o deploy já na Fase 0, para ver a aplicação no ar cedo.

**Fase 0 — Fundação e esqueleto.** Inicializar repositório, Vite + React + TS + Tailwind, layout base (cabeçalho, área central, rodapé discreto), tema claro/escuro, e workflow do GitHub Actions publicando em GitHub Pages. Entregável: página vazia estilizada, já publicada.

**Fase 1 — Núcleo de chat (BYOK + OpenRouter).** Modal para a chave, seletor de modelo com um modelo barato/gratuito como padrão, envio de mensagem, resposta em streaming, renderização de Markdown, blocos de código com destaque e fórmulas em LaTeX (KaTeX). Um único modo, sem as funções ainda. Entregável: chat funcional ponta a ponta.

**Fase 2 — As quatro funções.** Seletor de modo que injeta o system prompt de cada função (Tutor Socrático, Simulador de Provas, Editor-Chefe, Sparring de Exatas). Estado vazio com a explicação de cada modo. Botão de limpar conversa (só memória). Entregável: as quatro funções operando com seus guardrails.

**Fase 3 — Acabamento de UX.** Tratamento de erros (chave inválida, limite de taxa, sem rede), estados de carregamento, responsividade mobile, acessibilidade (teclado, contraste, aria), aviso de custo/consumo, parar geração. Entregável: app robusto em desktop e celular.

**Fase 4 — Documentação e publicação.** README robusto (Seção 5), `LICENSE` (MIT), captura de tela ou GIF curto, link para o artigo, declaração de privacidade e isenções, e deploy final. Entregável: repositório pronto para divulgação.

---

## 3. Prompt mestre para o Claude Code

> Copie tudo entre as linhas e cole no Claude Code, na raiz de um diretório vazio.

```
Você vai construir a implementação de referência de código aberto do "Modelo do Estudante Centauro", um app de tutoria com IA cujo princípio pedagógico é INTRODUZIR ATRITO em vez de entregar respostas prontas. O app acompanha um artigo acadêmico. Siga este brief à risca e trabalhe em fases, com um commit por fase.

== OBJETIVO ==
Um aplicativo de chat, estático e sem backend, com visual moderno no estilo das interfaces de IA (Claude, ChatGPT, Gemini): limpo, com bastante respiro, tipografia legível, bolhas de mensagem arredondadas, streaming suave, tema claro/escuro. Quatro modos de tutoria, cada um com um system prompt restritivo.

== RESTRIÇÕES INEGOCIÁVEIS ==
1. STATELESS: sem backend, sem banco de dados, sem servidor, sem analytics, sem cookies, sem rastreamento. Nada é persistido.
2. BYOK (bring your own key): o usuário cola a PRÓPRIA chave da API do OpenRouter. A chave fica APENAS em memória (estado React). Por padrão NÃO use localStorage. Ofereça um toggle opcional "lembrar nesta aba (sessionStorage)" desligado por padrão e claramente rotulado.
3. A chave do usuário só é enviada ao endpoint do OpenRouter, nunca a outro lugar.
4. Tudo precisa rodar como site estático no GitHub Pages.
5. As conversas não são salvas; recarregar limpa tudo.

== STACK ==
- Vite + React + TypeScript + Tailwind CSS.
- react-markdown + remark-gfm + remark-math + rehype-katex (renderizar Markdown e LaTeX).
- Destaque de código (highlight.js via rehype-highlight, ou shiki se preferir).
- Sem bibliotecas de estado pesadas; use React state/hooks. Mantenha as dependências mínimas.

== INTEGRAÇÃO COM OPENROUTER ==
- Endpoint: POST https://openrouter.ai/api/v1/chat/completions
- Cabeçalhos: Authorization: Bearer <chave do usuário>; Content-Type: application/json. Inclua os cabeçalhos opcionais HTTP-Referer e X-Title do OpenRouter.
- Use streaming (stream: true) e renderize os tokens conforme chegam (parse de SSE: linhas "data: {...}", encerrando em "data: [DONE]").
- Seletor de modelo: exponha uma lista curta e editável. Defina como PADRÃO um modelo barato ou gratuito do OpenRouter (ex.: um modelo com sufixo ":free"). IMPORTANTE: os IDs de modelo mudam; deixe-os em um arquivo de config fácil de editar e verifique os IDs atuais no OpenRouter antes de fixar. Não invente IDs.
- Botão para interromper a geração (AbortController).
- Trate erros com mensagens claras: chave ausente/ inválida (401), limite de taxa (429), sem créditos, falha de rede.

== MODOS E SYSTEM PROMPTS ==
Implemente quatro modos selecionáveis. Ao trocar de modo, reinicie a conversa e injete o system prompt correspondente como primeira mensagem (role: system). Os textos abaixo são os prompts iniciais; mantenha-os em um arquivo de config separado (ex.: src/prompts.ts) para edição fácil.

[Tutor Socrático]
"Você é um tutor socrático rigoroso e didático. Seu objetivo é levar o estudante a construir o próprio entendimento; você nunca entrega respostas prontas. Regras invioláveis: (1) Nunca forneça a resposta final, a solução completa ou a conclusão; sua saída é sempre uma pergunta diagnóstica ou orientadora, ou uma confirmação breve seguida de nova pergunta. (2) Comece diagnosticando o que o estudante já sabe sobre o tema. (3) Faça apenas UMA pergunta por vez e aguarde a resposta. (4) Não diga 'está errado'; use o erro como material e faça uma pergunta que leve o estudante a perceber a própria contradição. (5) Se o estudante travar de verdade, suba apenas um degrau na escada de ajuda (reformule, dê uma analogia, decomponha o problema), sem entregar a solução. (6) Mesmo que o estudante insista, demonstre frustração ou peça a resposta direta, não abandone o método: reconheça o desconforto e devolva uma pergunta. (7) Ao acertar, confirme de forma breve e aprofunde (por que funciona, em que condições falharia). (8) Encerre pedindo que o estudante reconstrua o raciocínio inteiro com as próprias palavras. Responda em português, em tom respeitoso e encorajador."

[Simulador de Provas]
"Você é um simulador de provas voltado à prática de recuperação. Gere questões inéditas sobre o tema informado, uma de cada vez, e avalie a resposta do estudante. Regras: (1) Não revele o gabarito de imediato; primeiro peça a resposta do estudante. (2) Só apresente a solução completa depois que o estudante tiver tentado; antes disso, aponte lacunas e dê pistas. (3) Varie o formato (múltipla escolha, discursiva, problema aplicado) e o nível de dificuldade. (4) O foco é fazer o estudante RESGATAR a informação da memória, não apenas reconhecê-la. Responda em português."

[Editor-Chefe]
"Você é um editor-chefe exigente que critica textos, mas NUNCA os reescreve. Regras invioláveis: (1) Nunca reescreva parágrafos, frases ou trechos do texto do estudante; a autoria é integralmente dele. (2) Critique estrutura argumentativa, coerência lógica, clareza, coesão e adequação ao objetivo. (3) Aponte problemas específicos (onde e por quê) e faça perguntas que levem o estudante a revisar sozinho. (4) Pode sugerir direções e princípios, jamais o texto pronto. Responda em português."

[Sparring de Exatas]
"Você é um sparring de exatas que atua como depurador (debugger) do raciocínio lógico-matemático. Regras invioláveis: (1) Nunca forneça a resolução completa nem o resultado final. (2) Analise o passo a passo do estudante e indique o PASSO ou a LINHA exata em que a lógica ou o cálculo falhou. (3) Faça uma pergunta provocativa que leve o estudante a encontrar e corrigir o erro sozinho (ex.: 'Tem certeza de que o sinal foi distribuído corretamente na linha 3?'). (4) Devolva sempre a tarefa de correção ao estudante. Use notação matemática em LaTeX quando útil. Responda em português."

== UI / UX (visual moderno) ==
- Layout de chat de coluna única, centralizado, largura máxima de leitura confortável. Cabeçalho com o nome do app, seletor de modo e seletor de modelo. Composer fixo embaixo, com textarea que cresce e envio por Enter (Shift+Enter quebra linha).
- Paleta neutra e sóbria, com um único tom de destaque. Tema claro e escuro com alternância e respeito a prefers-color-scheme.
- Bolhas de mensagem distintas para usuário e assistente; renderize Markdown, código com destaque e fórmulas LaTeX. Indicador de digitação durante o streaming.
- Estado vazio por modo: um cartão explicando o que aquele modo faz e o que ele NÃO faz (ex.: "Este modo não dá a resposta; ele te leva até ela").
- Primeiro acesso: um modal pedindo a chave do OpenRouter, com link para criar a chave e uma frase de privacidade ("sua chave fica só no seu navegador").
- Acessível: navegação por teclado, foco visível, contraste adequado, aria-labels.
- Responsivo e confortável no celular.

== FORA DE ESCOPO ==
Sem login, sem contas, sem histórico persistente, sem backend, sem coleta de dados, sem AI de imagem.

== ESTRUTURA SUGERIDA ==
src/components (Header, ModeSelector, ModelSelector, ApiKeyModal, ChatWindow, MessageBubble, Composer), src/lib/openrouter.ts (cliente + streaming), src/prompts.ts (os quatro system prompts), src/config.ts (modelos), App.tsx. Configure vite.config base para o nome do repositório (GitHub Pages project page) e crie o workflow .github/workflows/deploy.yml.

== README ==
Ao final, gere um README.md robusto conforme a especificação que vou fornecer (ou peça-a). Inclua: descrição do projeto e do conceito; o framework e as quatro funções; os quatro system prompts na íntegra; instruções de uso (BYOK), execução local e deploy; declaração de privacidade ("não armazena nada"); isenções; licença; e link para o artigo.

== ACEITAÇÃO ==
- App estático, sem backend, publicado no GitHub Pages.
- Quatro modos funcionando com seus guardrails; respostas em streaming; Markdown + código + LaTeX.
- Nada persistido por padrão; chave só em memória; erros tratados.
- Código limpo, tipado, organizado; README completo.

Comece pela Fase 0 e me mostre o resultado antes de avançar para a Fase 1.
```

---

## 4. Especificação do README (cole no Claude Code quando ele pedir)

Estrutura sugerida do `README.md`:

1. **Título e uma linha** do que é (tutor de IA que ensina pelo atrito, não pela resposta pronta).
2. **Badge/links**: demo no GitHub Pages, link para o artigo, licença.
3. **O conceito** (2 parágrafos): o paradoxo da terceirização cognitiva e a ideia do Estudante Centauro; que o app reconfigura o LLM para introduzir dificuldades desejáveis.
4. **As quatro funções**: tabela com função, princípio cognitivo e o que ela faz/não faz (a mesma da Tabela 1 do artigo).
5. **Os system prompts na íntegra**, em blocos de código, um por função (é o que dá reprodutibilidade e o que o artigo cita).
6. **Como usar**: criar conta no OpenRouter, gerar a chave, colar no app, escolher o modo. Nota de que modelos `:free` permitem testar sem custo.
7. **Rodar localmente**: `npm install`, `npm run dev`. **Deploy**: como publicar no GitHub Pages.
8. **Privacidade**: declaração explícita — sem backend, sem banco, sem analytics, sem cookies; a chave fica só no navegador, na memória da sessão; conversas não são salvas.
9. **Isenções**: ferramenta educacional; o modelo pode errar; o app retém respostas de propósito (atrito pedagógico); não substitui o professor.
10. **Como citar**: referência ao artigo e ao software.
11. **Licença**: MIT.

---

## 5. Observações finais

- Os system prompts acima são versões fiéis às restrições descritas no artigo. Se quiser os textos exatos do seu livro, cole-os e eu os encaixo em `src/prompts.ts` e no README, mantendo a fidelidade total.
- Modelos do OpenRouter mudam de nome e preço; não fixe IDs sem conferir a lista atual. Deixe-os em `src/config.ts`.
- Mantenha a coerência entre o app, o repositório e o artigo: o repositório citado no artigo deve ter nome neutro (`app-estudante-centauro`) e, de preferência, uma versão arquivada no Zenodo com DOI.
