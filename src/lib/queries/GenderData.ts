import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface GenderData {
  name: string;
  value: number;
}

export async function getGenderData(
  db: AsyncDuckDBConnection
): Promise<GenderData[]> {
  const result = await db.query(`
    SELECT gender AS name, COUNT(*) AS value
    FROM individus
    GROUP BY gender
  `);

  return result.toArray().map(row => ({
    name: String(row.name),
    value: Number(row.value)
  }));
}
