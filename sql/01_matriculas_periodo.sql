-- =============================================================================
-- Matrículas no período (ideia do Dashboard Comercial / Minha Performance)
-- =============================================================================
-- Problema: o relatório SIAA chega em "snapshots". O mesmo RGM pode aparecer
-- várias vezes. Precisamos de UMA linha por aluno — a mais recente — e ainda
-- filtrar por data de matrícula no período da meta.
--
-- Truque: DISTINCT ON (rgm) + ORDER BY snapshot mais novo.
-- Quando o painel precisa bater com "Matrículas Oficiais", lemos TODOS os
-- snapshots do tipo matriculados (não só o último).
-- =============================================================================

WITH base AS (
  SELECT DISTINCT ON (
    regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g')
  )
    regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g') AS rgm,
    NULLIF(TRIM(COALESCE(r.data->>'nome', '')), '')                 AS nome,
    UPPER(TRIM(COALESCE(r.data->>'situacao', '')))                  AS situacao,
    CASE
      WHEN (r.data->>'data_mat') ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$'
        THEN to_date(r.data->>'data_mat', 'DD/MM/YYYY')
      WHEN (r.data->>'data_mat') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        THEN (r.data->>'data_mat')::date
      ELSE NULL
    END AS data_matricula,
    NULLIF(TRIM(COALESCE(r.data->>'ciclo', '')), '') AS ciclo,
    s.id AS snapshot_id
  FROM xl_rows r
  JOIN xl_snapshots s ON s.id = r.snapshot_id
  WHERE s.tipo = 'matriculados'          -- todos os uploads (modo "oficial")
    AND COALESCE(r.data->>'rgm', '') ~ '[0-9]'
  ORDER BY
    regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g'),
    s.id DESC                             -- snapshot mais recente ganha
)
SELECT rgm, nome, situacao, data_matricula, ciclo
FROM base
WHERE situacao = 'EM CURSO'
  AND data_matricula >= DATE '2026-07-01'
  AND data_matricula <= DATE '2026-07-31'
ORDER BY data_matricula, nome;
