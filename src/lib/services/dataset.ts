import { connection } from "../duckdb/duckdb";
import { importCsv } from "../duckdb/import";

import { getStats } from "../queries/StatsData";
import { getGenderData } from "../queries/GenderData";

import type { StatsData } from "../queries/StatsData";
import type { GenderData } from "../queries/GenderData";

export interface DashboardData {
  stats: StatsData;
  genders: GenderData[];
}

export async function loadDataset(file: File): Promise<DashboardData> {
  await importCsv(file);

  return {
    stats: await getStats(connection),
    genders: await getGenderData(connection)
  };
}
