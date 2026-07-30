import type { AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";

export interface RadarData {
  name: string;
  value: [number, number, number, number, number]
}

export async function getRadarData(
  db: AsyncDuckDBConnection
): Promise<RadarData[]> {
  const result = await db.query(`
    SELECT
    CASE
        WHEN age < 30 THEN 'Jeunes'
        WHEN age < 60 THEN 'Adultes'
        ELSE 'Seniors'
    END AS tranche,

    AVG(education) / 3    AS etudes,
    AVG(wealth) / 3  AS richesse,
    AVG(sport)    AS sport,
    AVG(reading)  AS lecture,
    AVG(music)  AS musique

    FROM individus
    GROUP BY tranche
    ORDER BY
      CASE tranche
          WHEN 'Jeunes' THEN 1
          WHEN 'Adultes' THEN 2
          ELSE 3
      END;
  `);

  return result.toArray().map(row => ({
    name: row.tranche,
    value:[
      Number(row.etudes),
      Number(row.richesse),
      Number(row.sport),
      Number(row.musique),
      Number(row.lecture)
    ]
  }));
}
