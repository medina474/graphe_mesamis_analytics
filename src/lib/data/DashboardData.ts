import { connection } from "../duckdb/duckdb";
import { importCsv, importGraphData } from "../duckdb/import";

import { getStats } from "./StatsData";
import { getGenderData } from "./GenderData";
import { getGenerationData } from "./GenerationData";
import { getPyramideData } from "./PyramideData";
import { getRadarData } from "./RadarData";
import { getHeatMapData } from "./HeatMapData";
import { getEducationData } from "./EducationData";
import { getWealthData } from "./WealthData";

import type { StatsData } from "./StatsData";
import type { HeatMapData } from "./HeatMapData";
import type { PieData } from "./PieData";
import type { PyramideData } from "./PyramideData";
import type { RadarData } from "./RadarData";

export interface DashboardData {
  datasetLoaded: boolean;
  stats: StatsData;
  genders: PieData[];
  generation: PieData[];
  pyramide: PyramideData[];
  radar: RadarData[];
  heatmappH: HeatMapData;
  heatmappF: HeatMapData;
  education: PieData[];
  wealth: PieData[];
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
    heatmappH: await getHeatMapData(connection, 'M'),
    heatmappF: await getHeatMapData(connection, 'F'),
    education: await getEducationData(connection),
    wealth: await getWealthData(connection),
  };
}

export async function loadDatasetFromGraph(graphData: any): Promise<DashboardData> {
  await importGraphData(graphData);

  return {
    datasetLoaded: true,
    stats: await getStats(connection),
    genders: await getGenderData(connection),
    generation: await getGenerationData(connection),
    pyramide: await getPyramideData(connection),
    radar:  await getRadarData(connection),
    heatmappH: await getHeatMapData(connection, 'M'),
    heatmappF: await getHeatMapData(connection, 'F'),
    education: await getEducationData(connection),
    wealth: await getWealthData(connection),
  };
}
