<script lang="ts">
  import { loadDataset } from "./lib/services/dataset";
  import type { DashboardData } from "./lib/services/dataset";

  import StatsValues from './lib/StatsValues.svelte'
  import GenderChart from './lib/GenderChart.svelte'

  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  use([CanvasRenderer]);

  let data = $state<DashboardData>({
    genders: [],
    stats: {
      total: 0,
      moyenne: 0,
      stdev: 0,
      mediane: 0,
      minimum: 0,
      maximum: 0
    }
  });

  async function chargerFichier(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      data = await loadDataset(file);
    } catch (err) {
      console.error("Erreur chargement dataset :", err);
    }
  }
</script>

<input type="file" accept="text/csv,.csv" onchange={chargerFichier} />

<StatsValues data={data?.stats} />

<div class="app">
  <GenderChart data={data?.genders} />
</div>

<style>
  .app {
    width: 100vw;
    height: 50vh;
  }
</style>
