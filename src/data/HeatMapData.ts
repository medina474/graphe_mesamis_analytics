import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface HeatMapData {
  ages: string[];
  values: number[][];
}

export async function getHeatMapData(
  db: AsyncDuckDBConnection,
  gender: string
): Promise<HeatMapData> {
  const stmt = await db.prepare(`
    SELECT
      age,
      AVG(sport) * 100  AS sport,
      AVG(reading) * 100 AS lecture,
      AVG(music)  * 100 AS musique
    FROM individus
    WHERE gender = ? AND age >= 18
    GROUP BY age
    ORDER BY age
  `);

  const result = await stmt.query(gender);

  const ages: string[] = [];
  const values: number[][] = [];

  result.toArray().forEach((row, index) => {
      ages.push(row.age.toString());
      values.push([index, 0, row.sport]);
      values.push([index, 1, row.musique]);
      values.push([index, 2, row.lecture]);
  });

  return {
    ages,
    values
  };
}
