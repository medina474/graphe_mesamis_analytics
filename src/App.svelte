<script lang="ts">
  import { loadDataset } from "./lib/services/dataset";
  import type { DashboardData } from "./lib/services/dataset";

  import StatsValues from './lib/StatsValues.svelte'
  import GenderChart from './lib/GenderChart.svelte'
  import GenerationChart from './lib/GenerationChart.svelte'
  import PyramideChart from './lib/PyramideChart.svelte'
  import HeatMap from './lib/HeatMap.svelte'
  import RadarChart from './lib/RadarChart.svelte'

  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  use([CanvasRenderer]);

  let dashboard = $state<DashboardData>({
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
    radar: []
  });

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

<style>
  .app {
    height: 30vh;
  }

  .pyramid {
    height: 90vh;
  }
</style>
