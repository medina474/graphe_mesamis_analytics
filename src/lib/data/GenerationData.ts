import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

import type { PieData } from "./PieData";
import { getPieData } from "./PieData";

export async function getGenerationData(
  db: AsyncDuckDBConnection
): Promise<PieData[]> {
  return getPieData(db, `
    SELECT
      CASE
        WHEN age < 30 THEN 'Jeunes'
        WHEN age >= 30 AND age < 60 THEN 'Adultes'
        ELSE 'Séniors'
      END AS name,
      COUNT(*) AS value
    FROM individus
    GROUP BY name
    ORDER BY
      CASE name
        WHEN 'Jeunes' THEN 1
        WHEN 'Adultes' THEN 2
        WHEN 'Séniors' THEN 3
      END;
  `);
}
