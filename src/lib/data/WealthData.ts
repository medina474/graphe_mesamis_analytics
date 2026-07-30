import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

import type { PieData } from "./PieData";
import { getPieData } from "./PieData";

export async function getWealthData(
  db: AsyncDuckDBConnection
): Promise<PieData[]> {
  return getPieData(db, `
    SELECT wealth AS name, COUNT(*) AS value
    FROM individus GROUP BY wealth;
  `);
}
