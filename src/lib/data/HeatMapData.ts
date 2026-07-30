import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface HeatMapData {
  ages: string[];
  values: number[][];
}

export async function getHeatMapData(
  db: AsyncDuckDBConnection
): Promise<number[][]> {
  const result = await db.query(`
    SELECT
    age,
    AVG(sport)    AS sport,
    AVG(reading)  AS lecture,
    AVG(music)    AS musique
    FROM individus
    GROUP BY age;
  `);

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
