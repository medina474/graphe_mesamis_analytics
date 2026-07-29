<script lang="ts">
  import { loadDataset } from "./lib/services/dataset";
  import type { DashboardData } from "./lib/services/dataset";

  import StatsValues from './lib/StatsValues.svelte'
  import GenderChart from './lib/GenderChart.svelte'
  import GenerationChart from './lib/GenerationChart.svelte'
  import PyramideChart from './lib/GenerationChart.svelte'

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
    pyramide: []
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

<GenerationChart data={dashboard.generation} />

<div class="app">
<PyramideChart data={dashboard.pyramide} />
</div>

<style>
  .app {
    width: 100vw;
    height: 50vh;
  }
</style>
