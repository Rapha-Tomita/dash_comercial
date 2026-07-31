# Mocks — Fixtures de API para o portfólio (dash_comercial)

Fixtures JSON estáticas, moldadas nos shapes reais consumidos pelo
front-end vanilla do `dcz-crm-sync` (inspecionados em `static/js/*.js`).
Dados fictícios (contexto de educação comercial brasileira, ciclo
`2026/2`, datas de julho/2026) — sem segredos ou dados de produção.

| Arquivo                          | Rota real que simula                          | Consumido por (frontend) |
|-----------------------------------|-----------------------------------------------|---------------------------|
| `comercial_kpis.json`              | `GET /api/comercial-rgm/data/kpis`             | `static/js/comercial_rgm.js` (`_crgmRenderKPIs`, `_crgmRenderEvolucao`, `_crgmRenderPoloTable`, evasão/fora-padrão) |
| `comercial_agentes.json`           | `GET /api/comercial-rgm/data/agentes`          | `comercial_rgm.js` (ranking de agentes, grid de matrículas, transferência/regresso, histórico diário) |
| `comercial_grids.json`             | `GET /api/comercial-rgm/data/grids`            | `comercial_rgm.js` (leads_grid, evasão completa, fora do padrão RGM completo) |
| `comercial_filters.json`           | `GET /api/comercial-rgm/filters`                | `comercial_rgm.js` (`_crgmLoadFilters` — popula selects de polo/nível/agente) |
| `mp_insights.json`                 | `GET /api/minha-performance/insights`           | `static/js/minha_performance.js` (`_mpRenderHero`, PIX do dia, gauge de meta) |
| `mp_me.json`                       | `GET /api/me`                                   | Vários (`profile.js`, `utils.js`, `minha_performance.js`, `repasse.js`, `dist_consultor.js`) — identidade/role/permissões |
| `premiacao_campanhas.json`         | `GET /api/premiacao/campanhas`                  | `static/js/premiacao_admin.js` (`_paLoadCampanhas`, `_paRenderCampanhasList`) |
| `repasse_agentes.json`             | `GET /api/repasse/agentes`                      | `static/js/repasse.js` (carrossel de agentes + KPIs de repasse) |
| `repasse_detalhe.json`             | `GET /api/repasse/detalhe`                      | `repasse.js` (`_repRenderDetalhe` — tabela de alunos por agente) |
| `repasse_filtros.json`             | `GET /api/repasse/filtros`                      | `repasse.js` (`_repCarregarFiltros` — selects de ciclo/tipo/turma) |
| `repasse_taxa.json`                | `GET /api/repasse/taxa`                         | `repasse.js` (input de taxa de repasse, admin-only) |
| `dist_consultor_me.json`           | `GET /api/dist-consultor/me`                    | `static/js/dist_consultor.js` (`dcLoadMe` — hierarquia admin vs consultor) |
| `dist_fechadas.json`               | `GET /api/dist-consultor/fechadas-periodo`      | `dist_consultor.js` (mapa consultor → fechadas do/fora do período) |
| `dist_matriculas_por_origem.json`  | `GET /api/dist-consultor/matriculas-por-origem` | `dist_consultor.js` (gráfico de origens) |
| `dist_total_kommo.json`            | `GET /api/dist-consultor/total-kommo`           | `dist_consultor.js` (KPI de leads totais no Kommo vs distribuídos) |

## Observações de fidelidade ao shape real

- `ranking_polo` usa as chaves reais `{nome, total}` (não `{polo, total}`
  como um leitor desavisado poderia supor) — confirmado em
  `_crgmRenderPoloTable` (`comercial_rgm.js`).
- Séries de evolução (`evolucao`, `evolucao_bruto`, `evolucao_prev`) usam
  a chave `data` (não `date`) — confirmado em `_crgmRenderEvolucao`.
- `matriculas_grid` traz `count` e `count_liquido`; o front usa
  `count_liquido` quando presente (`_crgmGridCountLiquido`).
- `ranking_agentes[].nome` fica em português; nomes que começam com
  `User #` recebem estilo itálico no front (fallback de nome não resolvido).
- `mp_insights.campanha` inclui `is_active`, `nome`, `dt_inicio`, `dt_fim`
  — usados por `_mpRenderHero` para o banner de campanha encerrada.
- `mp_me.json` inclui um array `pages` extra (não lido literalmente pelo
  front, que resolve permissão via Jinja server-side) só para deixar
  explícito, no mock, quais telas o usuário demo enxergaria.
