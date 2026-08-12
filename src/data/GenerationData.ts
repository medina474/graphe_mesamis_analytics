import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

import type { PieData } from "./PieData";
import { getPieData } from "./PieData";

export async function getGenerationData(
  db: AsyncDuckDBConnection
): Promise<PieData[]> {
  return getPieData(db, `
    SELECT
      CASE
        WHEN age BETWEEN  0 AND 13 THEN 'Enfants'
        WHEN age BETWEEN 13 AND 17 THEN 'Adolescents'
        WHEN age BETWEEN 18 AND 29 THEN 'Jeunes'
        WHEN age BETWEEN 30 AND 59 THEN 'Adultes'
        ELSE 'Séniors'
      END AS name,
      COUNT(*) AS value
    FROM individus
    GROUP BY name
    ORDER BY
      CASE name
        WHEN 'Enfants' THEN 1
        WHEN 'Adolescents' THEN 2
        WHEN 'Jeunes' THEN 3
        WHEN 'Adultes' THEN 4
        WHEN 'Séniors' THEN 5
      END;
  `);
}
