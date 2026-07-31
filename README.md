# Dash Comercial

Este repo é o pedaço **comercial** do cockpit que eu montei no dia a dia — as mesmas telas que o time usa, só que aqui rodando em modo demo.

Não é um mockup bonitinho. É o HTML/JS de verdade das abas, com uma API falsa por trás pra qualquer um conseguir abrir e navegar sem precisar de banco, CRM ou `.env`.

## O que tem aqui

| Aba | O que faz |
|-----|-----------|
| **Dashboard Comercial** | Matrículas, ranking de consultores, polos, metas |
| **Distribuição Consultor** | Leads por pessoa e origem, conversão no período |
| **Premiação** | Campanhas, equipes, faixas de meta e PIX |
| **Minha Performance** | Visão do consultor: saldo, ritmo, calendário |
| **Repasse** | Quanto cada um recebe a partir dos pagamentos |

Por baixo dos panos: `comercial_rgm.js`, `dist_consultor.js`, `premiacao_admin.js`, `minha_performance.js`, `repasse.js` — o mesmo código de produção.

## Como abrir

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
python app.py
```

Depois é só entrar em [http://127.0.0.1:5055](http://127.0.0.1:5055).

## Sobre os dados “falsos”

Pra o projeto rodar sozinho, as respostas da API vêm de JSONs em `mocks/` e das rotas do `app.py`.

A Distribuição Consultor, no sistema real, puxa um webhook do n8n. Aqui isso foi trocado por `/api/mock/dist-webhook`, pra não bater em ambiente de produção.

Botões que salvam, excluem ou sincronizam respondem “ok”, mas **não mudam nada de verdade** — é só pra UI não quebrar quando você clica.

## O que ficou de fora (de propósito)

Não subi senha, token, `.env` nem integração real com Kommo/SIAA.

Também não tem o Postgres nem o sync pesado do sistema completo. O resto do monorepo (acadêmico, disparador WhatsApp, etc.) fica em outro lugar — este repo é só a fatia comercial.

## O que isso resolveu no trabalho real

Algumas dores que essas telas foram feitas pra resolver:

- O ranking do comercial precisava bater com as matrículas oficiais — e ainda recuperar aluno que some do relatório do SIAA sem ter cancelado de fato.
- Premiação deixou de ser “uma meta pra todo mundo”: cada equipe (Alta Performance / Impulso) tem meta e R$ próprios, mais PIX no dia.
- O consultor vê a própria performance (saldo, faixas, calendário); o time de Suporte tem uma visão agregada.
- Repasse calcula quanto vai pra cada consultor a partir dos recebimentos, com taxa que dá pra ajustar por ciclo.
- Distribuição mostra de onde veio o lead e pra quem foi, cruzando n8n com o Kommo.

## SQL (exemplos)

Em produção isso tudo bebe de Postgres (snapshots do SIAA em JSONB, dedupe por RGM, metas por equipe…).  
Aqui não tem banco ligado — mas deixei em `sql/` alguns exemplos comentados do tipo de query que escrevi:

- `01_matriculas_periodo.sql` — uma linha por aluno no período (`DISTINCT ON` + data)
- `02_ranking_recuperacao_siaa.sql` — recupera matrícula que sumiu do último relatório
- `03_premiacao_metas_equipe.sql` — metas/R$ diferentes por equipe na mesma campanha

São didáticos (sem dado real). Dá pra ler só os comentários e entender o raciocínio.

---

Feito por [Rapha-Tomita](https://github.com/Rapha-Tomita).  
Portfólio com UI real + dados de demonstração + exemplos de SQL.
