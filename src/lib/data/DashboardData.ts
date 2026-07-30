import { connection } from "../duckdb/duckdb";
import { importCsv } from "../duckdb/import";

import { getStats } from "./StatsData";
import { getGenderData } from "./GenderData";
import { getGenerationData } from "./GenerationData";
import { getPyramideData } from "./PyramideData";
import { getRadarData } from "./RadarData";
import { getHeatMapData } from "./HeatMapData";
import { getEducationData } from "./EducationData";

import type { StatsData } from "./StatsData";
import type { PieData } from "./PieData";
import type { GenerationData } from "./GenerationData";
import type { PyramideData } from "./PyramideData";
import type { RadarData } from "./RadarData";

export interface DashboardData {
  datasetLoaded: boolean;
  stats: StatsData;
  genders: PieData[];
  generation: GenerationData[];
  pyramide: PyramideData[];
  radar: RadarData[];
  heatmapp: number[][];
  education: PieData[];
}

export async function loadDataset(file: File): Promise<DashboardData> {
  await importCsv(file);

  return {
    datasetLoaded: true,
    stats: await getStats(connection),
    genders: await getGenderData(connection),
    generation: await getGenerationData(connection),
    pyramide: await getPyramideData(connection),
    radar:  await getRadarData(connection),
    heatmapp: await getHeatMapData(connection),
    education: await getEducationData(connection),
  };
}
