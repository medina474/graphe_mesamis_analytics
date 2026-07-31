import type { DashboardData } from "./DashboardData";

export function createEmptyDashboard(): DashboardData {
  return {
    datasetLoaded: false,

    genders: [],

    stats: {
      total: 0,
      moyenne: 0,
      stdev: 0,
      mediane: 0,
      minimum: 0,
      maximum: 0
    },

    generation: [],
    pyramide: [],
    radar: [],

    heatmappH: {
      ages: [],
      values: []
    },

    heatmappF: {
      ages: [],
      values: []
    },

    education: [],
    wealth: []
  };
}
