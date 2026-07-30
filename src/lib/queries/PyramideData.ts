import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface PyramideData {
  age: number;
  hommes: number;
  femmes: number;
  hommesEcart: number;
  femmesEcart: number;
}

export async function getPyramideData(
  db: AsyncDuckDBConnection
): Promise<PyramideData[]> {
  const result = await db.query(`
    WITH population AS (
      SELECT
          age,
          SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS hommes,
          SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS femmes
      FROM individus
      GROUP BY age
    )
    SELECT
      age,
      hommes,
      femmes,

      LEAST(hommes, femmes) AS commun,

      hommes - LEAST(hommes, femmes) AS ecart_hommes,
      femmes - LEAST(hommes, femmes) AS ecart_femmes

    FROM population
    ORDER BY age;
  `);

  return result.toArray().map(row => ({
    age: Number(row.age),

    // côté gauche de la pyramide
    hommes: -Number(row.commun),
    hommesEcart: -Number(row.ecart_hommes),

    // côté droit
    femmes: Number(row.commun),
    femmesEcart: Number(row.ecart_femmes)
  }));
}
