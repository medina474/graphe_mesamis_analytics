import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

import type { PieData } from "./PieData";
import { getPieData } from "./PieData";

export async function getEducationData(
  db: AsyncDuckDBConnection
): Promise<PieData[]> {
  return getPieData(db, `
    SELECT education AS name, COUNT(*) AS value
    FROM individus
    WHERE age >= 18
    GROUP BY education;
  `);
}
