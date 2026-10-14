# Octa

Sistema de gestão das escolas Pa-Kua. Next.js (App Router) + TypeScript + Tailwind CSS, ícones com `lucide-react`.

## Rodando

```bash
npm install
cp .env.example .env.local   # no Windows: copy .env.example .env.local
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```
src/
  app/
    layout.tsx            Sidebar + área de conteúdo
    page.tsx              Início
    alunos/  turmas/  financeiro/  administrativo/  configuracoes/
  components/
    Sidebar.tsx           Menu lateral (no celular vira gaveta com botão de menu)
    EscolaAtual.tsx       Escola e usuário logados, buscados via api.ts
    PageHeader.tsx        Título de página e placeholder "em construção"
    OctaMark.tsx          Marca (octógono)
  lib/
    api.ts                resolver() + funções de acesso a dados
    mockData.ts           Todos os dados mockados
  types/index.ts          Tipos do domínio (contrato com o backend)
```

## Dados: mock ou backend

As telas nunca importam `mockData.ts` direto. Elas chamam as funções de `src/lib/api.ts`
(`getAlunos`, `getTurmas`, `getParcelas`, `getCaixaDoDia`...), e todas passam pelo `resolver`:

```ts
export const getAlunos = (filtro: FiltroAlunos = {}) =>
  resolver<Aluno[]>({
    endpoint: "/alunos",          // GET {NEXT_PUBLIC_API_URL}/alunos?status=...
    params: { ...filtro },
    mock: () => mock.alunos.filter(/* mesmo filtro, no mock */),
  });
```

| Variável | Valores | Efeito |
|---|---|---|
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` (padrão) ou `api` | De onde vêm os dados |
| `NEXT_PUBLIC_API_URL` | ex.: `http://localhost:8080/api` | URL base do backend |
| `NEXT_PUBLIC_MOCK_DELAY_MS` | ex.: `600` | Atraso no mock, para testar carregamento |

Para ligar só um endpoint que já está pronto no backend, sem trocar o resto:

```ts
resolver({ endpoint: "/alunos", mock: mock.alunos, fonte: "api" });
```

No modo API, erros chegam como `ApiError` (com `status` e `endpoint`). O backend deve devolver
JSON no formato dos tipos em `src/types/index.ts`.

A sidebar mostra no rodapé qual fonte está ativa ("Dados mockados" ou "Dados do backend").
