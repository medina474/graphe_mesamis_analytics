<script lang="ts">
  import { loadDataset } from "./lib/data/DashboardData";
  import type { DashboardData } from "./lib/data/DashboardData";
  import { createEmptyDashboard } from "./lib/data/DashboardState.svelte";

  import StatsValues from './lib/chart/StatsValues.svelte'
  import GenderChart from './lib/chart/GenderChart.svelte'
  import EducationChart from './lib/chart/EducationChart.svelte'
  import WealthChart from './lib/chart/WealthChart.svelte'
  import GenerationChart from './lib/chart/GenerationChart.svelte'
  import PyramideChart from './lib/chart/PyramideChart.svelte'
  import HeatMapChart from './lib/chart/HeatMapChart.svelte'
  import RadarChart from './lib/chart/RadarChart.svelte'

  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  use([CanvasRenderer]);

  let dashboard = $state<DashboardData>(createEmptyDashboard());

  async function chargerFichier(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      dashboard = await loadDataset(file);
    } catch (err) {
      console.error("Erreur chargement dataset :", err);
    }
  }
</script>

<input type="file" accept="text/csv,.csv" onchange={chargerFichier} />

<StatsValues data={dashboard.stats} />

<div class="app">
  <GenderChart data={dashboard.genders} />
</div>

<div class="app">
  <GenerationChart data={dashboard.generation} />
</div>

<div class="pyramid">
  <PyramideChart data={dashboard.pyramide} />
</div>

<div class="pyramid">
  <RadarChart data={dashboard.radar} />
</div>

<div class="app">
  <HeatMapChart data={dashboard.heatmapp} />
</div>

<div class="app">
  <EducationChart data={dashboard.education} />
</div>

<div class="app">
  <WealthChart data={dashboard.wealth} />
</div>

<style>
  .app {
    height: 30vh;
  }

  .pyramid {
    height: 90vh;
  }
</style>
