/**
 * Dash Comercial — demo de portfólio (dados mock em /data).
 */
const PAGES = {
  comercial_rgm: "Dashboard Comercial",
  dist_consultor: "Distribuição Consultor",
  premiacao: "Premiação",
  minha_performance: "Minha Performance",
  repasse: "Repasse",
};

const charts = {};
let loaded = {};

const brl = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const num = (n) => Number(n).toLocaleString("pt-BR");

async function getData(key) {
  if (loaded[key]) return loaded[key];
  const res = await fetch(`./data/${key}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(key + " " + res.status);
  loaded[key] = await res.json();
  return loaded[key];
}

function chartOpts() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#94a3b8", boxWidth: 12 } } },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { color: "rgba(100,116,139,0.08)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { color: "rgba(100,116,139,0.08)" },
      },
    },
  };
}

function upsertChart(id, cfg) {
  if (charts[id]) charts[id].destroy();
  const el = document.getElementById(id);
  if (!el || typeof Chart === "undefined") return;
  charts[id] = new Chart(el, cfg);
}

function navigate(page) {
  Object.keys(PAGES).forEach((p) => {
    document.getElementById("page-" + p)?.classList.toggle("hidden", p !== page);
  });
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });
  document.getElementById("topbar-title").textContent = PAGES[page] || page;
  renderPage(page);
}

async function renderPage(page) {
  try {
    if (page === "comercial_rgm") await renderComercial();
    if (page === "dist_consultor") await renderDist();
    if (page === "premiacao") await renderPremiacao();
    if (page === "minha_performance") await renderMP();
    if (page === "repasse") await renderRepasse();
  } catch (e) {
    console.error(e);
  }
}

async function renderComercial() {
  const d = await getData("comercial");
  const k = d.kpis;
  document.getElementById("crgm-kpis").innerHTML = `
    <div class="kpi accent-navy"><div class="label">Matrículas no Período</div><div class="value">${num(k.matriculas_periodo)}</div></div>
    <div class="kpi"><div class="label">YTD</div><div class="value">${num(k.ytd)}</div></div>
    <div class="kpi"><div class="label">Inscritos M&amp;M</div><div class="value">${num(k.inscritos_mm)}</div></div>
    <div class="kpi"><div class="label">Média Diária</div><div class="value">${num(k.media_diaria)}</div></div>
    <div class="kpi accent-emerald"><div class="label">Ticket Médio (30%)</div><div class="value">${brl(k.ticket_medio)}</div></div>
    <div class="kpi"><div class="label">vs 6 Meses</div><div class="value" style="color:#34d399">+${k.vs_6m}%</div></div>
    <div class="kpi accent-rose"><div class="label">Evasão no Período</div><div class="value">${num(k.evasao)}</div></div>
    <div class="kpi accent-amber"><div class="label">Fora do Padrão RGM</div><div class="value">${num(k.fora_padrao)}</div></div>`;

  upsertChart("chart-crgm-dia", {
    type: "line",
    data: {
      labels: d.por_dia.labels,
      datasets: [
        {
          label: "Atual",
          data: d.por_dia.atual,
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.1)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Ano anterior",
          data: d.por_dia.ano_ant,
          borderColor: "#64748b",
          borderDash: [6, 4],
          pointRadius: 0,
          tension: 0.3,
        },
      ],
    },
    options: chartOpts(),
  });

  upsertChart("chart-crgm-polo", {
    type: "bar",
    data: {
      labels: d.por_polo.labels,
      datasets: [
        {
          label: "Matrículas",
          data: d.por_polo.values,
          backgroundColor: "rgba(116,174,233,0.75)",
          borderRadius: 6,
        },
      ],
    },
    options: { ...chartOpts(), plugins: { legend: { display: false } } },
  });

  const nivelBadge = (n) => {
    if (n === "Supermeta") return "badge-green";
    if (n === "Meta") return "badge-blue";
    return "badge-amber";
  };
  document.getElementById("table-crgm-ranking").innerHTML = `
    <thead><tr><th>#</th><th>Agente</th><th>Mat.</th><th>Inter.</th><th>Meta</th><th>Super</th><th>Nível</th><th>Leads</th><th>Conv.</th></tr></thead>
    <tbody>${d.ranking
      .map(
        (r) => `<tr>
      <td>${r.pos}</td><td>${r.agente}</td><td>${r.mat}</td><td>${r.inter}</td><td>${r.meta}</td><td>${r.super}</td>
      <td><span class="badge ${nivelBadge(r.nivel)}">${r.nivel}</span></td>
      <td>${num(r.leads)}</td><td>${r.conv}%</td></tr>`
      )
      .join("")}</tbody>`;
}

async function renderDist() {
  const d = await getData("dist_consultor");
  const k = d.kpis;
  document.getElementById("dc-kpis").innerHTML = `
    <div class="kpi accent-navy"><div class="label">Total de Leads</div><div class="value">${num(k.total_leads)}</div></div>
    <div class="kpi"><div class="label">Consultores</div><div class="value">${num(k.consultores)}</div></div>
    <div class="kpi"><div class="label">Origens</div><div class="value">${num(k.origens)}</div></div>
    <div class="kpi"><div class="label">Média por Dia</div><div class="value">${num(k.media_dia)}</div></div>
    <div class="kpi accent-emerald"><div class="label">Matrículas no Período</div><div class="value">${num(k.matriculas_periodo)}</div>
      <div class="sub">${k.matriculas_lead_antigo} de lead antigo</div></div>
    <div class="kpi accent-violet"><div class="label">Taxa de Conversão</div><div class="value">${k.taxa_conversao}%</div></div>`;

  upsertChart("chart-dc-consultor", {
    type: "bar",
    data: {
      labels: d.por_consultor.labels,
      datasets: [
        {
          data: d.por_consultor.values,
          backgroundColor: "rgba(37,99,235,0.75)",
          borderRadius: 6,
        },
      ],
    },
    options: { ...chartOpts(), plugins: { legend: { display: false } } },
  });

  upsertChart("chart-dc-origem", {
    type: "doughnut",
    data: {
      labels: d.por_origem.labels,
      datasets: [
        {
          data: d.por_origem.values,
          backgroundColor: ["#74aee9", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#64748b"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "right", labels: { color: "#94a3b8", boxWidth: 10 } } },
    },
  });

  document.getElementById("table-dc-mat").innerHTML = `
    <thead><tr><th>Consultor</th><th>Matrículas</th><th>Leads</th><th>Conv.</th></tr></thead>
    <tbody>${d.matriculas_consultor
      .map(
        (r) =>
          `<tr><td>${r.consultor}</td><td>${r.matriculas}</td><td>${num(r.leads)}</td><td>${r.conv}%</td></tr>`
      )
      .join("")}</tbody>`;
}

async function renderPremiacao() {
  const d = await getData("premiacao");
  document.getElementById("pa-campanhas").innerHTML = d.campanhas
    .map(
      (c) => `
    <div class="config-row">
      <div>
        <strong>${c.nome}</strong>
        <div style="font-size:10px;color:#94a3b8;margin-top:2px">${c.periodo}</div>
        <span class="badge badge-green" style="margin-top:4px">${c.status}</span>
      </div>
      <div><div class="label" style="font-size:10px;color:#64748b">Inter / R$</div>${c.inter} · ${brl(c.valor_inter)}</div>
      <div><div class="label" style="font-size:10px;color:#64748b">Meta / R$</div>${c.meta} · ${brl(c.valor_meta)}</div>
      <div><div class="label" style="font-size:10px;color:#64748b">Super / R$</div>${c.super} · ${brl(c.valor_super)}</div>
    </div>`
    )
    .join("");

  document.getElementById("table-pa-grupos").innerHTML = `
    <thead><tr><th>Grupo</th><th>Membros</th></tr></thead>
    <tbody>${d.grupos.map((g) => `<tr><td>${g.nome}</td><td>${g.membros}</td></tr>`).join("")}</tbody>`;

  document.getElementById("table-pa-pix").innerHTML = `
    <thead><tr><th>Equipe</th><th>Mín. matrículas</th><th>Valor PIX</th></tr></thead>
    <tbody>${d.pix_faixas
      .map((f) => `<tr><td>${f.equipe}</td><td>${f.min}</td><td>${brl(f.valor)}</td></tr>`)
      .join("")}</tbody>`;
}

async function renderMP() {
  const d = await getData("minha_performance");
  document.getElementById("mp-hero").innerHTML = `
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;align-items:end">
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd">${d.campanha}</div>
        <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;margin-top:.35rem">${d.agente}</div>
        <div style="margin-top:.5rem;font-size:12px;color:#cbd5e1">Seu saldo acumulado</div>
        <div style="font-family:var(--font-mono);font-size:2rem;font-weight:700">${brl(d.saldo)}</div>
        <div style="font-size:11px;color:#94a3b8">pode chegar a ${brl(d.projecao)} · ${d.matriculas} matrículas</div>
      </div>
      <div style="text-align:right">
        <span class="badge badge-green" style="font-size:12px;padding:.35rem .75rem">${d.tier}</span>
        <div style="margin-top:.75rem;font-size:11px;color:#cbd5e1">Ranking</div>
        <div style="font-family:var(--font-mono);font-size:1.6rem;font-weight:700">#${d.ranking_pos}</div>
      </div>
    </div>`;

  document.getElementById("mp-kpis").innerHTML = `
    <div class="kpi accent-emerald"><div class="label">PIX do Dia</div><div class="value">${brl(d.pix_dia)}</div><div class="sub">${d.pix_status}</div></div>
    <div class="kpi"><div class="label">Ritmo Atual</div><div class="value">${d.ritmo}/dia</div></div>
    <div class="kpi"><div class="label">Necessário</div><div class="value">${d.necessario}/dia</div></div>
    <div class="kpi accent-violet"><div class="label">Sequência</div><div class="value">${d.streak}</div><div class="sub">dias batendo a meta diária</div></div>`;

  document.getElementById("table-mp-niveis").innerHTML = `
    <thead><tr><th>Nível</th><th>Alvo (mat)</th><th>R$/mat</th></tr></thead>
    <tbody>${d.niveis
      .map(
        (n) =>
          `<tr><td>${n.nome}${n.nome === d.tier ? ' <span class="badge badge-green">atual</span>' : ""}</td><td>${n.alvo}</td><td>${brl(n.rs)}</td></tr>`
      )
      .join("")}</tbody>`;

  document.getElementById("mp-heat").innerHTML = d.heatmap
    .map((s) => `<div class="heat ${s}" title="${s}"></div>`)
    .join("");
}

async function renderRepasse() {
  const d = await getData("repasse");
  const k = d.kpis;
  document.getElementById("rp-kpis").innerHTML = `
    <div class="kpi accent-emerald"><div class="label">Recebido</div><div class="value">${brl(k.recebido)}</div></div>
    <div class="kpi accent-amber"><div class="label">Total Repasse</div><div class="value">${brl(k.total_repasse)}</div><div class="sub">${k.taxa}% da taxa</div></div>
    <div class="kpi"><div class="label">Com Pagamento</div><div class="value">${num(k.com_pagamento)}</div><div class="sub">alunos</div></div>
    <div class="kpi accent-violet"><div class="label">Consultores</div><div class="value">${num(k.consultores)}</div></div>`;

  const car = document.getElementById("rp-carousel");
  car.innerHTML = d.agentes
    .map(
      (a, i) => `
    <div class="agent-card ${i === 0 ? "active" : ""}" data-idx="${i}">
      <div class="name">${a.nome}</div>
      <div class="meta">${a.alunos} alunos</div>
      <div class="meta">${brl(a.repasse)}</div>
    </div>`
    )
    .join("");

  const paintDetail = () => {
    document.getElementById("table-rp-detalhe").innerHTML = `
      <thead><tr><th>RGM</th><th>Tipo</th><th>Turma</th><th>Ciclo</th><th>Recebido</th><th>Repasse</th></tr></thead>
      <tbody>${d.detalhe
        .map(
          (r) =>
            `<tr><td>${r.rgm}</td><td>${r.tipo}</td><td>${r.turma}</td><td>${r.ciclo}</td><td>${brl(r.recebido)}</td><td>${brl(r.repasse)}</td></tr>`
        )
        .join("")}</tbody>`;
  };
  paintDetail();

  car.querySelectorAll(".agent-card").forEach((card) => {
    card.addEventListener("click", () => {
      car.querySelectorAll(".agent-card").forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const a = d.agentes[Number(card.dataset.idx)];
      document.getElementById("rp-detail-title").textContent = "Detalhe · " + a.nome;
      paintDetail();
    });
  });
}

document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => navigate(btn.dataset.page));
});
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.parentElement.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
  });
});

navigate("comercial_rgm");