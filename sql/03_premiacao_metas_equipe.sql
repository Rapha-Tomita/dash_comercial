-- =============================================================================
-- Premiação: metas e R$/matrícula por equipe (mesma campanha)
-- =============================================================================
-- Uma campanha pode ter "Alta Performance" e "Impulso" com alvos diferentes.
-- Precedência na prática: meta individual → meta da equipe → default da campanha.
-- =============================================================================

-- Schema (idempotente)
CREATE TABLE IF NOT EXISTS premiacao_grupo_meta (
  campanha_id          INTEGER NOT NULL REFERENCES premiacao_campanha(id) ON DELETE CASCADE,
  grupo_id             INTEGER NOT NULL REFERENCES premiacao_grupo(id) ON DELETE CASCADE,
  meta_intermediaria   NUMERIC,
  meta                 NUMERIC,
  supermeta            NUMERIC,
  valor_base           NUMERIC,
  valor_intermediaria  NUMERIC,
  valor_meta           NUMERIC,
  valor_supermeta      NUMERIC,
  updated_at           TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (campanha_id, grupo_id)
);

-- Exemplo: listar equipes da campanha com override (ou NULL = usa default)
SELECT
  g.id   AS grupo_id,
  g.nome AS grupo_nome,
  gm.meta_intermediaria,
  gm.meta,
  gm.supermeta,
  gm.valor_base,
  gm.valor_intermediaria,
  gm.valor_meta,
  gm.valor_supermeta
FROM premiacao_grupo g
LEFT JOIN premiacao_grupo_meta gm
  ON gm.grupo_id = g.id
 AND gm.campanha_id = 7   -- id de exemplo
ORDER BY g.nome;

-- Exemplo de valores (ilustrativo)
-- Alta Performance: inter 40 / meta 50 / super 60 · R$ 25 / 40 / 60
-- Impulso:          inter 25 / meta 32 / super 40 · R$ 20 / 30 / 45
