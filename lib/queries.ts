import pool from "@/lib/db";

export type PostoOption = {
  id: number;
  nome: string;
  endereco: string;
  bairro: string;
  bandeira: string;
};
export type CombustivelOption = { id: number; nome: string };
export type BairroOption = { id: number; nome: string };

export async function getPostos() {
  const [rows] = await pool.query(`
    SELECT
      p.id_posto AS id,
      p.nome,
      p.endereco,
      b.nome AS bairro,
      '' AS bandeira
    FROM Posto p
    JOIN Bairro b ON b.id_bairro = p.id_bairro
    ORDER BY p.nome
  `);
  return rows as PostoOption[];
}

export async function getCombustiveis() {
  const [rows] = await pool.query(`
    SELECT id_combustivel AS id, nome
    FROM TipoCombustivel
    ORDER BY nome
  `);
  return rows as CombustivelOption[];
}

export async function getBairros() {
  const [rows] = await pool.query(`
    SELECT id_bairro AS id, nome
    FROM Bairro
    ORDER BY nome
  `);
  return rows as BairroOption[];
}

export async function getPrecosRecentes() {
  const [rows] = await pool.query(`
    SELECT
      p.id_posto AS posto_id,
      p.nome AS posto,
      b.nome AS bairro,
      '' AS bandeira,
      tc.id_combustivel AS combustivel_id,
      tc.nome AS combustivel,
      c.valor AS preco,
      DATE_FORMAT(c.data_hora, '%Y-%m-%d') AS data,
      DATE_FORMAT(c.data_hora, '%Y-%m-%d %H:%i:%s') AS data_coleta
    FROM Coleta c
    JOIN Posto p ON c.id_posto = p.id_posto
    JOIN Bairro b ON p.id_bairro = b.id_bairro
    JOIN TipoCombustivel tc ON c.id_combustivel = tc.id_combustivel
    JOIN (
      SELECT id_posto, id_combustivel, MAX(data_hora) AS data_mais_recente
      FROM Coleta
      GROUP BY id_posto, id_combustivel
    ) ult ON ult.id_posto = c.id_posto
         AND ult.id_combustivel = c.id_combustivel
         AND ult.data_mais_recente = c.data_hora
    ORDER BY p.nome, tc.nome
  `);
  return rows as Array<{
    posto_id: number;
    posto: string;
    bairro: string;
    bandeira: string;
    combustivel_id: number;
    combustivel: string;
    preco: number;
    data: string;
    data_coleta: string;
  }>;
}

export async function getMenorMaiorPreco() {
  const [rows] = await pool.query(`
    SELECT
      tc.nome AS combustivel,
      MIN(c.valor) AS menor_preco,
      MAX(c.valor) AS maior_preco
    FROM Coleta c
    JOIN TipoCombustivel tc ON c.id_combustivel = tc.id_combustivel
    GROUP BY tc.id_combustivel, tc.nome
    ORDER BY tc.nome
  `);
  return rows as Array<{
    combustivel: string;
    menor_preco: number;
    maior_preco: number;
  }>;
}

export async function getMediaQuantidade() {
  const [rows] = await pool.query(`
    SELECT
      p.id_posto AS posto_id,
      p.nome AS posto,
      b.nome AS bairro,
      tc.id_combustivel AS combustivel_id,
      tc.nome AS combustivel,
      COUNT(c.id_coleta) AS quantidade,
      ROUND(AVG(c.valor), 2) AS media
    FROM Coleta c
    JOIN Posto p ON c.id_posto = p.id_posto
    JOIN Bairro b ON p.id_bairro = b.id_bairro
    JOIN TipoCombustivel tc ON c.id_combustivel = tc.id_combustivel
    GROUP BY p.id_posto, p.nome, b.nome, tc.id_combustivel, tc.nome
    ORDER BY p.nome, tc.nome
  `);
  return rows as Array<{
    posto_id: number;
    posto: string;
    bairro: string;
    combustivel_id: number;
    combustivel: string;
    quantidade: number;
    media: number;
  }>;
}

export async function getEstatisticas() {
  const [[postos], [combustiveis], [bairros], [coletas]] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS total FROM Posto`),
    pool.query(`SELECT COUNT(*) AS total FROM TipoCombustivel`),
    pool.query(`SELECT COUNT(*) AS total FROM Bairro`),
    pool.query(`SELECT COUNT(*) AS total FROM Coleta`),
  ]);

  return {
    totalPostos: (postos as any[])[0].total,
    totalCombustiveis: (combustiveis as any[])[0].total,
    totalBairros: (bairros as any[])[0].total,
    totalAmostras: (coletas as any[])[0].total,
  };
}

export async function getHistoricoPreco(
  postoId?: number,
  combustivelId?: number,
) {
  let sql = `
    SELECT
      c.id_coleta AS id,
      p.id_posto AS posto_id,
      p.nome AS posto,
      b.nome AS bairro,
      tc.id_combustivel AS combustivel_id,
      tc.nome AS combustivel,
      c.valor AS preco,
      DATE_FORMAT(c.data_hora, '%Y-%m-%d') AS data,
      DATE_FORMAT(c.data_hora, '%Y-%m-%d %H:%i:%s') AS data_coleta
    FROM Coleta c
    JOIN Posto p ON c.id_posto = p.id_posto
    JOIN Bairro b ON p.id_bairro = b.id_bairro
    JOIN TipoCombustivel tc ON c.id_combustivel = tc.id_combustivel
  `;
  const params: Array<number> = [];
  const conditions: string[] = [];
  if (postoId) {
    conditions.push("c.id_posto = ?");
    params.push(postoId);
  }
  if (combustivelId) {
    conditions.push("c.id_combustivel = ?");
    params.push(combustivelId);
  }
  if (conditions.length) sql += ` WHERE ${conditions.join(" AND ")}`;
  sql += " ORDER BY c.data_hora ASC";
  const [rows] = await pool.query(sql, params);
  return rows as Array<{
    id: number;
    posto_id: number;
    posto: string;
    bairro: string;
    combustivel_id: number;
    combustivel: string;
    preco: number;
    data: string;
    data_coleta: string;
  }>;
}

export async function getHistoricoAgrupadoCombustivel(combustivelId: number) {
  const [rows] = await pool.query(
    `
    SELECT
      base.data,
      ROUND(AVG(base.valor), 2) AS preco
    FROM (
      SELECT
        DATE_FORMAT(c.data_hora, '%Y-%m-%d') AS data,
        c.valor
      FROM Coleta c
      WHERE c.id_combustivel = ?
    ) base
    GROUP BY base.data
    ORDER BY base.data
  `,
    [combustivelId],
  );
  return rows as Array<{ data: string; preco: number }>;
}

export async function getComparativoTodosCombustiveis(postoId?: number) {
  let sql = `
    SELECT
      base.data,
      base.combustivel,
      ROUND(AVG(base.valor), 2) AS preco
    FROM (
      SELECT
        DATE_FORMAT(c.data_hora, '%Y-%m-%d') AS data,
        tc.id_combustivel,
        tc.nome AS combustivel,
        c.valor
      FROM Coleta c
      JOIN TipoCombustivel tc ON tc.id_combustivel = c.id_combustivel
  `;
  const params: Array<number> = [];
  if (postoId) {
    sql += " WHERE c.id_posto = ?";
    params.push(postoId);
  }
  sql += `
    ) base
    GROUP BY base.data, base.id_combustivel, base.combustivel
    ORDER BY base.data, base.combustivel
  `;
  const [rows] = await pool.query(sql, params);
  return rows as Array<{ data: string; combustivel: string; preco: number }>;
}

export async function getColetas() {
  const [rows] = await pool.query(`
    SELECT
      c.id_coleta AS id,
      tc.nome AS combustivel,
      p.nome AS posto,
      b.nome AS bairro,
      DATE_FORMAT(c.data_hora, '%Y-%m-%d %H:%i:%s') AS data_coleta,
      c.valor AS preco
    FROM Coleta c
    JOIN Posto p ON c.id_posto = p.id_posto
    JOIN Bairro b ON p.id_bairro = b.id_bairro
    JOIN TipoCombustivel tc ON c.id_combustivel = tc.id_combustivel
    ORDER BY c.data_hora DESC
  `);

  return rows as Array<{
    id: number;
    combustivel: string;
    posto: string;
    bairro: string;
    data_coleta: string;
    preco: number;
  }>;
}
