"""
Dash Comercial — portfólio
Front real (templates + JS de produção) + API mock local.
Sem banco, sem .env, sem Kommo.
"""
from __future__ import annotations

import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request

ROOT = Path(__file__).resolve().parent
MOCKS = ROOT / "mocks"

app = Flask(__name__, static_folder="static", template_folder="templates")


def _load(name: str, default=None):
    path = MOCKS / name
    if not path.exists():
        return default if default is not None else {"ok": True}
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def _ok(**extra):
    body = {"ok": True}
    body.update(extra)
    return jsonify(body)


@app.get("/")
def index():
    return render_template("index.html", kommo_web_base="https://example.kommo.com")


# ── identity ──────────────────────────────────────────────────────────────
@app.get("/api/me")
def api_me():
    return jsonify(_load("mp_me.json", {
        "ok": True,
        "username": "portfolio.demo",
        "role": "admin",
        "kommo_user_id": 1001,
        "pages": ["comercial_rgm", "dist_consultor", "premiacao_admin", "minha_performance", "repasse"],
        "categoria": "Comercial",
    }))


# ── Dashboard Comercial ────────────────────────────────────────────────────
@app.get("/api/comercial-rgm/data/kpis")
def crgm_kpis():
    return jsonify(_load("comercial_kpis.json"))


@app.get("/api/comercial-rgm/data/agentes")
def crgm_agentes():
    return jsonify(_load("comercial_agentes.json"))


@app.get("/api/comercial-rgm/data/grids")
def crgm_grids():
    return jsonify(_load("comercial_grids.json"))


@app.get("/api/comercial-rgm/data")
def crgm_data_legacy():
    """Algumas telas ainda pedem /data agregado."""
    k = _load("comercial_kpis.json", {})
    a = _load("comercial_agentes.json", {})
    g = _load("comercial_grids.json", {})
    out = {"ok": True}
    if isinstance(k, dict):
        out.update({x: k[x] for x in k if x != "ok"})
    if isinstance(a, dict):
        out.update({x: a[x] for x in a if x != "ok"})
    if isinstance(g, dict):
        out.update({x: g[x] for x in g if x != "ok"})
    return jsonify(out)


@app.get("/api/comercial-rgm/filters")
def crgm_filters():
    return jsonify(_load("comercial_filters.json"))


@app.get("/api/comercial-rgm/snapshot-info")
def crgm_snapshot():
    return jsonify({"ok": True, "info": "Mock · ciclo 2026/2 · portfólio"})


@app.get("/api/comercial-rgm/metas")
def crgm_metas():
    return jsonify({"ok": True, "metas": []})


@app.get("/api/comercial-rgm/ciclos")
def crgm_ciclos():
    return jsonify({"ok": True, "ciclos": [{"nome": "2026/2", "id": 1}, {"nome": "2026/1", "id": 2}]})


@app.get("/api/comercial-rgm/ciclo-atual")
def crgm_ciclo_atual():
    return jsonify({"ok": True, "ciclo": "2026/2"})


@app.get("/api/comercial-rgm/turmas")
def crgm_turmas():
    return jsonify({"ok": True, "turmas": []})


@app.get("/api/comercial-rgm/atividade-kommo")
def crgm_atividade():
    return jsonify({"ok": True, "atividade": [], "resumo": {}})


@app.get("/api/comercial-rgm/agente-detalhe")
def crgm_agente_detalhe():
    return jsonify({"ok": True, "itens": [], "agente": {"nome": "Demo"}})


@app.get("/api/comercial-rgm/conflitos")
def crgm_conflitos():
    return jsonify({"ok": True, "itens": [], "total": 0})


@app.get("/api/comercial-rgm/consultores")
def crgm_consultores():
    return jsonify({"ok": True, "consultores": []})


@app.get("/api/comercial-rgm/duplicatas")
def crgm_duplicatas():
    return jsonify({"ok": True, "itens": []})


@app.get("/api/comercial-rgm/matriculas-sem-data")
def crgm_sem_data():
    return jsonify({"ok": True, "itens": []})


@app.get("/api/comercial-rgm/rgm-atribuicao")
def crgm_rgm_attr():
    return jsonify({"ok": False, "error": "mock — RGM não encontrado"})


@app.post("/api/comercial-rgm/sync-users")
@app.post("/api/comercial-rgm/congelar")
@app.post("/api/comercial-rgm/outlier/contar-venda")
@app.post("/api/comercial-rgm/kommo-sync-lead")
@app.post("/api/comercial-rgm/conflitos/resolver")
@app.post("/api/comercial-rgm/metas/batch")
@app.post("/api/comercial-rgm/upload")
def crgm_mutations():
    return _ok(message="mock: ação registrada (sem efeito)")


@app.route("/api/comercial-rgm/metas/<int:mid>", methods=["PUT", "DELETE"])
@app.route("/api/comercial-rgm/consultores/<int:uid>", methods=["POST", "DELETE"])
@app.route("/api/comercial-rgm/turmas/<int:tid>", methods=["DELETE"])
@app.route("/api/comercial-rgm/turmas", methods=["POST"])
@app.route("/api/comercial-rgm/ciclos", methods=["POST"])
def crgm_mutations_id(**_kwargs):
    return _ok(message="mock: ok")


# ── Dist. Consultor ────────────────────────────────────────────────────────
@app.get("/api/dist-consultor/me")
def dc_me():
    return jsonify(_load("dist_consultor_me.json", {"ok": True, "role": "admin"}))


@app.get("/api/dist-consultor/fechadas-periodo")
def dc_fechadas():
    return jsonify(_load("dist_fechadas.json"))


@app.get("/api/dist-consultor/matriculas-por-origem")
def dc_mat_origem():
    return jsonify(_load("dist_matriculas_por_origem.json"))


@app.get("/api/dist-consultor/total-kommo")
def dc_total_kommo():
    return jsonify(_load("dist_total_kommo.json"))


@app.get("/api/dist-consultor/detalhe-consultor")
def dc_detalhe():
    return jsonify({"ok": True, "itens": [], "consultor": request.args.get("consultor", "")})


@app.get("/api/dist-consultor/sem-origem")
def dc_sem_origem():
    return jsonify({"ok": True, "itens": []})


@app.get("/api/mock/dist-webhook")
@app.post("/api/mock/dist-webhook")
def dc_webhook_mock():
    """Substitui o webhook n8n em produção — payload no formato esperado pelo front."""
    # Formato típico: linhas consultor/origem/dia
    rows = []
    consultores = ["Rahi", "Gabriel Messias", "Beatriz", "Hugo", "Juliana", "Paloma", "Kamilly", "Claudia"]
    origens = ["Indicação", "Site", "Tronco", "SIAA", "Meta Ads", "Orgânico"]
    for i, c in enumerate(consultores):
        for j, o in enumerate(origens[:4]):
            rows.append({
                "consultor": c,
                "origem": o,
                "dia": f"2026-07-{(i + j) % 28 + 1:02d}",
                "leads": 20 + (i * 3) + j * 5,
                "total_vendas": 1 + (i + j) % 4,
            })
    return jsonify({"ok": True, "data": rows, "rows": rows})


# ── Premiação ──────────────────────────────────────────────────────────────
@app.get("/api/premiacao/campanhas")
def pa_campanhas():
    return jsonify(_load("premiacao_campanhas.json"))


@app.get("/api/premiacao/campanhas-periodos")
def pa_periodos():
    data = _load("premiacao_campanhas.json", {})
    # front aceita lista ou {campanhas:[]}
    if isinstance(data, list):
        return jsonify(data)
    return jsonify(data.get("campanhas", data))


@app.get("/api/premiacao/campanhas/<int:cid>/metas")
@app.get("/api/premiacao/campanhas/<int:cid>/metas-grupo")
@app.get("/api/premiacao/campanhas/<int:cid>/grupos")
@app.get("/api/premiacao/campanhas/<int:cid>/pix-equipe")
@app.get("/api/premiacao/campanhas/<int:cid>/pix-suporte")
@app.get("/api/premiacao/campanhas/<int:cid>/meta-suporte")
def pa_camp_gets(cid: int):
    return jsonify({"ok": True, "metas": [], "grupos": [], "faixas": [], "cid": cid})


@app.get("/api/premiacao/campanha-links")
def pa_links():
    return jsonify({"ok": True, "links": []})


@app.route("/api/premiacao/campanhas", methods=["POST"])
@app.route("/api/premiacao/campanhas/<int:cid>", methods=["PUT", "DELETE"])
@app.route("/api/premiacao/campanhas/<int:cid>/metas", methods=["POST"])
@app.route("/api/premiacao/campanhas/<int:cid>/metas-grupo", methods=["POST"])
@app.route("/api/premiacao/campanhas/<int:cid>/grupos", methods=["POST"])
@app.route("/api/premiacao/campanhas/<int:cid>/pix-equipe", methods=["POST"])
@app.route("/api/premiacao/campanhas/<int:cid>/pix-suporte", methods=["POST"])
@app.route("/api/premiacao/campanhas/<int:cid>/meta-suporte", methods=["POST"])
@app.route("/api/premiacao/grupos/<int:gid>", methods=["PUT", "DELETE"])
@app.route("/api/premiacao/campanha-links", methods=["POST"])
@app.route("/api/premiacao/campanha-links/<int:lid>", methods=["DELETE"])
@app.route("/api/recebimentos/upload", methods=["POST"])
def pa_mutations(**_kwargs):
    return _ok(message="mock: ok")


# ── Minha Performance ──────────────────────────────────────────────────────
@app.get("/api/minha-performance/insights")
def mp_insights():
    return jsonify(_load("mp_insights.json"))


@app.get("/api/minha-performance/historico")
def mp_historico():
    return jsonify({"ok": True, "historico": []})


@app.get("/api/minha-performance/agentes")
def mp_agentes():
    a = _load("comercial_agentes.json", {})
    ranking = a.get("ranking_agentes") if isinstance(a, dict) else []
    agentes = [
        {"kommo_user_id": r.get("user_id"), "nome": r.get("nome"), "id": r.get("user_id")}
        for r in (ranking or [])
    ]
    return jsonify({"ok": True, "agentes": agentes})


@app.get("/api/minha-performance/campanhas")
def mp_campanhas():
    return jsonify(_load("premiacao_campanhas.json"))


@app.get("/api/minha-performance/matriculas")
@app.get("/api/minha-performance/minhas-matriculas")
@app.get("/api/minha-performance/ajustes")
def mp_lists():
    return jsonify({"ok": True, "itens": [], "matriculas": [], "ajustes": []})


@app.route("/api/minha-performance/minhas-matriculas", methods=["POST"])
@app.route("/api/minha-performance/minhas-matriculas/<int:mid>", methods=["PUT", "DELETE"])
@app.route("/api/minha-performance/ajustes", methods=["POST"])
def mp_mutations(**_kwargs):
    return _ok()


# ── Repasse ────────────────────────────────────────────────────────────────
@app.get("/api/repasse/taxa")
def rp_taxa_get():
    return jsonify(_load("repasse_taxa.json", {"ok": True, "taxa": 30}))


@app.put("/api/repasse/taxa")
def rp_taxa_put():
    return _ok(taxa=(request.json or {}).get("taxa", 30))


@app.get("/api/repasse/filtros")
def rp_filtros():
    return jsonify(_load("repasse_filtros.json"))


@app.get("/api/repasse/agentes")
def rp_agentes():
    return jsonify(_load("repasse_agentes.json"))


@app.get("/api/repasse/detalhe")
def rp_detalhe():
    return jsonify(_load("repasse_detalhe.json"))


# ── Catch-alls úteis ───────────────────────────────────────────────────────
@app.get("/api/ajustes-matricula")
def ajustes_list():
    return jsonify({"ok": True, "itens": [], "total": 0})


@app.route("/api/ajustes-matricula/<int:aid>", methods=["PUT", "POST"])
def ajustes_mut(aid: int):
    return _ok(id=aid)


@app.get("/api/kommo/task/<task_id>")
def kommo_task(task_id: str):
    return jsonify({"ok": True, "status": "done", "task_id": task_id})


@app.post("/api/kommo/sync")
def kommo_sync():
    return _ok(task_id="mock-task")


@app.errorhandler(404)
def not_found(e):
    if request.path.startswith("/api/"):
        return jsonify({"ok": True, "mock": True, "path": request.path, "warning": "endpoint sem fixture específica"}), 200
    return e


if __name__ == "__main__":
    print("Dash Comercial (portfólio) → http://127.0.0.1:5055")
    app.run(host="127.0.0.1", port=5055, debug=True)