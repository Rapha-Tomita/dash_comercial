-- =============================================================================
-- Recuperação de matrícula que "some" do último SIAA (ranking comercial)
-- =============================================================================
-- Caso real: aluno EM CURSO em relatórios do começo do mês, some do relatório
-- mais novo sem virar cancelado. Se o ranking olhar só o último arquivo, o
-- consultor perde a venda no pagamento.
--
-- Solução: janela ancorada no dia 01 da meta — recupera quem esteve EM CURSO
-- em QUALQUER upload desde o dia 01, com data_matricula no período, e que
-- NÃO está EM CURSO no último snapshot (sumiço real ou cancelado depois).
--
-- Detalhe chato que quebrou silenciosamente: em E-string do Postgres, \d vira
-- só "d". Por isso a regex de data usa [0-9], não \d.
-- =============================================================================

-- data_matricula a partir do JSON (dd/mm/yyyy ou ISO)
-- (mesmo padrão usado no ranking)
WITH params AS (
  SELECT
    DATE '2026-07-01' AS dt_ini,
    DATE '2026-07-31' AS dt_fim,
    DATE '2026-07-01' AS meta_start   -- âncora: dia 01 do mês da meta
),
ultimo AS (
  SELECT id FROM xl_snapshots
  WHERE tipo = 'matriculados'
  ORDER BY id DESC
  LIMIT 1
),
em_curso_no_ultimo AS (
  -- Qualquer ciclo: respeita dedup de pós (não "puxar de volta" quem já está
  -- EM CURSO no último relatório noutro ciclo).
  SELECT DISTINCT
    regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g') AS rgm
  FROM xl_rows r
  WHERE r.snapshot_id = (SELECT id FROM ultimo)
    AND UPPER(TRIM(COALESCE(r.data->>'situacao', ''))) = 'EM CURSO'
    AND regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g') <> ''
)
SELECT DISTINCT ON (rgm_norm)
  regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g') AS rgm_norm,
  NULLIF(TRIM(COALESCE(r.data->>'nome', '')), '') AS nome,
  CASE
    WHEN (r.data->>'data_mat') ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$'
      THEN to_date(r.data->>'data_mat', 'DD/MM/YYYY')
    WHEN (r.data->>'data_mat') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
      THEN (r.data->>'data_mat')::date
    ELSE NULL
  END AS data_matricula
FROM xl_rows r
JOIN xl_snapshots s ON s.id = r.snapshot_id
CROSS JOIN params p
WHERE s.tipo = 'matriculados'
  AND s.uploaded_at::date >= p.meta_start
  AND UPPER(TRIM(COALESCE(r.data->>'situacao', ''))) = 'EM CURSO'
  AND UPPER(TRIM(COALESCE(r.data->>'tipo_matricula', '')))
        = ANY (ARRAY['NOVA MATRICULA', 'RECOMPRA', 'RETORNO'])
  AND regexp_replace(COALESCE(r.data->>'rgm', ''), '[^0-9]', '', 'g')
        NOT IN (SELECT rgm FROM em_curso_no_ultimo)
  AND CASE
        WHEN (r.data->>'data_mat') ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$'
          THEN to_date(r.data->>'data_mat', 'DD/MM/YYYY')
        WHEN (r.data->>'data_mat') ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
          THEN (r.data->>'data_mat')::date
        ELSE NULL
      END BETWEEN p.dt_ini AND p.dt_fim
ORDER BY rgm_norm, s.id DESC;
