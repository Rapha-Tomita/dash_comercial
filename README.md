# Dash Comercial

Portfólio com o **front real** das abas comerciais que construí em produção, rodando contra uma **API mock** local (sem banco, sem `.env`, sem Kommo).

## Abas

| Aba | Template | JS (produção) |
|-----|----------|----------------|
| Dashboard Comercial | `_comercial_rgm.html` | `comercial_rgm.js` (~3.4k linhas) |
| Distribuição Consultor | `_dist_consultor.html` | `dist_consultor.js` (~1.5k) |
| Premiação | `_premiacao_admin.html` | `premiacao_admin.js` (~860) |
| Minha Performance | `_minha_performance.html` | `minha_performance.js` (~1.8k) |
| Repasse | `_repasse.html` | `repasse.js` (~430) |

Isso é o código de interface de verdade — não um mockup de 300 linhas.

## Como rodar

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Abra: http://127.0.0.1:5055

## O que é mock

- Respostas em `mocks/*.json` + rotas em `app.py`
- Webhook n8n da Distribuição Consultor → `/api/mock/dist-webhook` (não chama produção)
- Mutações (POST/PUT/DELETE) respondem `{ ok: true }` sem efeito

## O que NÃO vai neste repo

- Credenciais, `.env`, tokens Kommo/SIAA
- Banco Postgres / sync massivo
- Restante do monorepo (acadêmico, disparador, etc.)

## Case study (resumo do trabalho real)

- Ranking comercial alinhado a matrículas oficiais + recuperação de RGM que some do SIAA
- Premiação com metas/R$ por equipe (Alta Performance vs Impulso) + PIX diário
- Minha Performance com saldo, faixas, heatmap e visão Suporte
- Repasse de recebimentos com taxa configurável por ciclo
- Distribuição por consultor/origem (n8n + cruzamento Kommo)

---

[Rapha-Tomita](https://github.com/Rapha-Tomita) · snapshot de portfólio (código de UI real + mocks).
