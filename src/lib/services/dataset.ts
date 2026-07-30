import { connection } from "../duckdb/duckdb";
import { importCsv } from "../duckdb/import";

import { getStats } from "../queries/StatsData";
import { getGenderData } from "../queries/GenderData";
import { getGenerationData } from "../queries/GenerationData";
import { getPyramideData } from "../queries/PyramideData";
import { getRadarData } from "../queries/RadarData";

import type { StatsData } from "../queries/StatsData";
import type { GenderData } from "../queries/GenderData";
import type { GenerationData } from "../queries/GenerationData";
import type { PyramideData } from "../queries/PyramideData";
import type { RadarData } from "../queries/RadarData";

export interface DashboardData {
  datasetLoaded: boolean;
  stats: StatsData;
  genders: GenderData[];
  generation: GenerationData[];
  pyramide: PyramideData[];
  radar: RadarData[];
}

export async function loadDataset(file: File): Promise<DashboardData> {
  await importCsv(file);

  return {
    datasetLoaded: true,
    stats: await getStats(connection),
    genders: await getGenderData(connection),
    generation: await getGenerationData(connection),
    pyramide: await getPyramideData(connection),
    radar:  await getRadarData(connection)
  };
}
