import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import type { StatsData } from "../types";

export async function getStats(
  db: AsyncDuckDBConnection
): Promise<StatsData> {
  const result = await db.query(`
    SELECT
      COUNT(*) AS total,
      AVG(age) AS moyenne,
      STDDEV(age) AS stdev,
      MEDIAN(age) AS mediane,
      MIN(age) AS minimum,
      MAX(age) AS maximum
    FROM individus;
  `);

  return {
    total: Number(result.getChild("total")?.get(0) ?? 0),
    moyenne: Number(result.getChild("moyenne")?.get(0) ?? 0),
    stdev: Number(result.getChild("stdev")?.get(0) ?? 0),
    mediane: Number(result.getChild("mediane")?.get(0) ?? 0),
    minimum: Number(result.getChild("minimum")?.get(0) ?? 0),
    maximum: Number(result.getChild("maximum")?.get(0) ?? 0)
  };
}
