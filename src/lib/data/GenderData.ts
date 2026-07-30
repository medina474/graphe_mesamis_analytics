import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

import type { PieData } from "./PieData";
import { getPieData } from "./PieData";

export async function getGenderData(
  db: AsyncDuckDBConnection
): Promise<PieData[]> {
  return getPieData(db, `
    SELECT gender AS name, COUNT(*) AS value
    FROM individus
    GROUP BY gender
    ORDER BY
      CASE gender
        WHEN 'F' THEN 1
        WHEN 'M' THEN 2
      END;
  `);
}
