import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface PieData {
  name: string;
  value: number;
}

export async function getPieData(
  db: AsyncDuckDBConnection,
  sql: string
): Promise<PieData[]> {
  const result = await db.query(sql);

  return result.toArray().map(row => ({
    name: String(row.name),
    value: Number(row.value)
  }));
}
