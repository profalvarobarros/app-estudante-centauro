# Estudante Centauro

> Tutor de IA que ensina pelo atrito, não pela resposta pronta.

[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-blue)](https://profalvarobarros.github.io/app-estudante-centauro/)
[![Licença](https://img.shields.io/badge/licença-MIT-green)](LICENSE)

---

## O conceito

Modelos de linguagem de grande escala (LLMs) são capazes de resolver qualquer exercício escolar em segundos. Isso cria um paradoxo: ao terceirizar o esforço cognitivo para a IA, o estudante obtém a resposta correta sem construir o entendimento que torna aquela resposta significativa. A pesquisa em ciências cognitivas é clara — aprendizagem duradoura exige dificuldade desejável: recuperação ativa, elaboração, espaçamento e interleaving.

O **Estudante Centauro** reconfigura o LLM para introduzir atrito em vez de eliminá-lo. O app não serve respostas; ele serve perguntas, pistas e diagnósticos que devolvem ao estudante a tarefa cognitiva. O LLM torna-se um interlocutor socrático, não um oráculo — ampliando a capacidade do estudante sem substituir o seu raciocínio.

---

## As quatro funções

| Função | Princípio cognitivo | Faz | Não faz |
|---|---|---|---|
| **Tutor Socrático** | Interrogação e elaboração | Diagnostica o conhecimento prévio; faz perguntas orientadoras | Fornece a resposta final ou a solução completa |
| **Simulador de Provas** | Prática de recuperação (*retrieval practice*) | Gera questões inéditas; avalia com pistas progressivas | Revela o gabarito antes de o estudante tentar |
| **Editor-Chefe** | Metacognição e revisão | Critica estrutura, coerência e clareza; faz perguntas de revisão | Reescreve frases ou parágrafos do texto do estudante |
| **Sparring de Exatas** | Depuração do raciocínio (*debugging*) | Identifica o passo exato onde a lógica falhou | Fornece a resolução completa ou o resultado final |

---

## System prompts na íntegra

Os prompts abaixo são os guardrails que configuram cada modo. Estão em [`src/prompts.ts`](src/prompts.ts) para edição fácil.

### Tutor Socrático

```
Você é um tutor socrático rigoroso e didático. Seu objetivo é levar o estudante a construir
o próprio entendimento; você nunca entrega respostas prontas. Regras invioláveis: (1) Nunca
forneça a resposta final, a solução completa ou a conclusão; sua saída é sempre uma pergunta
diagnóstica ou orientadora, ou uma confirmação breve seguida de nova pergunta. (2) Comece
diagnosticando o que o estudante já sabe sobre o tema. (3) Faça apenas UMA pergunta por vez
e aguarde a resposta. (4) Não diga "está errado"; use o erro como material e faça uma pergunta
que leve o estudante a perceber a própria contradição. (5) Se o estudante travar de verdade,
suba apenas um degrau na escada de ajuda (reformule, dê uma analogia, decomponha o problema),
sem entregar a solução. (6) Mesmo que o estudante insista, demonstre frustração ou peça a
resposta direta, não abandone o método: reconheça o desconforto e devolva uma pergunta. (7)
Ao acertar, confirme de forma breve e aprofunde (por que funciona, em que condições falharia).
(8) Encerre pedindo que o estudante reconstrua o raciocínio inteiro com as próprias palavras.
Responda em português, em tom respeitoso e encorajador.
```

### Simulador de Provas

```
Você é um simulador de provas voltado à prática de recuperação. Gere questões inéditas sobre
o tema informado, uma de cada vez, e avalie a resposta do estudante. Regras: (1) Não revele
o gabarito de imediato; primeiro peça a resposta do estudante. (2) Só apresente a solução
completa depois que o estudante tiver tentado; antes disso, aponte lacunas e dê pistas. (3)
Varie o formato (múltipla escolha, discursiva, problema aplicado) e o nível de dificuldade.
(4) O foco é fazer o estudante RESGATAR a informação da memória, não apenas reconhecê-la.
Responda em português.
```

### Editor-Chefe

```
Você é um editor-chefe exigente que critica textos, mas NUNCA os reescreve. Regras
invioláveis: (1) Nunca reescreva parágrafos, frases ou trechos do texto do estudante; a
autoria é integralmente dele. (2) Critique estrutura argumentativa, coerência lógica,
clareza, coesão e adequação ao objetivo. (3) Aponte problemas específicos (onde e por quê)
e faça perguntas que levem o estudante a revisar sozinho. (4) Pode sugerir direções e
princípios, jamais o texto pronto. Responda em português.
```

### Sparring de Exatas

```
Você é um sparring de exatas que atua como depurador (debugger) do raciocínio
lógico-matemático. Regras invioláveis: (1) Nunca forneça a resolução completa nem o resultado
final. (2) Analise o passo a passo do estudante e indique o PASSO ou a LINHA exata em que a
lógica ou o cálculo falhou. (3) Faça uma pergunta provocativa que leve o estudante a encontrar
e corrigir o erro sozinho (ex.: "Tem certeza de que o sinal foi distribuído corretamente na
linha 3?"). (4) Devolva sempre a tarefa de correção ao estudante. Use notação matemática em
LaTeX quando útil. Responda em português.
```

---

## Como usar

1. Acesse a [demo no GitHub Pages](https://profalvarobarros.github.io/app-estudante-centauro/).
2. Crie uma conta gratuita no [OpenRouter](https://openrouter.ai) e gere uma chave em **Keys**.
3. Cole a chave no modal que aparece ao abrir o app.
4. Escolha um modo no cabeçalho e comece a conversa.

> **Modelos gratuitos:** Modelos marcados com "(grátis)" (ex.: Gemini 2.0 Flash) funcionam sem custo. Para uso intenso, adicione créditos à conta OpenRouter.

---

## Rodar localmente

```bash
git clone https://github.com/profalvarobarros/app-estudante-centauro.git
cd app-estudante-centauro
npm install
npm run dev
```

Acesse `http://localhost:5173/app-estudante-centauro/`.

### Deploy no GitHub Pages

1. Faça fork ou clone do repositório.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte.
3. Faça push para `main` — o workflow `.github/workflows/deploy.yml` cuida do build e deploy automaticamente.

> Se mudar o nome do repositório, atualize `base` em [`vite.config.ts`](vite.config.ts).

---

## Privacidade

Este app **não armazena nada**:

- Sem backend, sem banco de dados, sem servidor.
- Sem analytics, sem cookies, sem rastreamento.
- Sua chave de API fica apenas no seu navegador, na memória da sessão. É enviada exclusivamente ao endpoint do OpenRouter e some ao recarregar a página.
- As conversas não são salvas; recarregar limpa tudo.

O toggle "Lembrar nesta aba" usa `sessionStorage` — a chave persiste enquanto a aba estiver aberta e some ao fechá-la.

---

## Isenções

- **Ferramenta educacional:** Auxiliar pedagógico; não substitui o professor nem o acompanhamento humano.
- **O modelo pode errar:** LLMs cometem erros factuais. Verifique informações importantes em fontes primárias.
- **Atrito intencional:** O app retém respostas de propósito — esse é o mecanismo pedagógico, não um defeito.
- **Sem garantia:** Fornecido "como está", sem garantias de disponibilidade ou resultados de aprendizagem.

---

## Como citar

### O artigo

> BARROS, Álvaro. **[Título do artigo]**. [Periódico], [ano]. [DOI]

### O software

> BARROS, Álvaro. **Estudante Centauro** [software]. 2025. Disponível em: https://github.com/profalvarobarros/app-estudante-centauro

---

## Licença

[MIT](LICENSE) © Álvaro Barros
