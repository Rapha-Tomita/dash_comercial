# Dash Comercial

Demo de **portfólio** com as abas comerciais do cockpit:

1. **Dashboard Comercial** — KPIs, matrículas/dia, ranking e polos  
2. **Distribuição Consultor** — leads por consultor/origem e conversão  
3. **Premiação** — campanhas, grupos e PIX por equipe  
4. **Minha Performance** — saldo, PIX do dia, ritmo e heatmap  
5. **Repasse** — recebimentos × taxa × detalhe por consultor  

> Recorte de UI/UX baseado no que construí em produção.  
> Repositório **estático** (HTML/CSS/JS + JSON mock). Sem backend, sem `.env`, sem CRM.

## Como ver

```bash
python -m http.server 8080
# ou: npx serve .
```

Abra: http://localhost:8080

## Estrutura

| Path | Função |
|------|--------|
| `index.html` | Shell + sidebar + 5 páginas |
| `js/app.js` | Navegação, charts e tabelas |
| `css/styles.css` | Tema dark do cockpit |
| `data/*.json` | Mocks ilustrativos |

Números são de ordem de grandeza operacional, **não** dados sensíveis de produção.

---

Feito por [Rapha-Tomita](https://github.com/Rapha-Tomita) · snapshot de portfólio.
