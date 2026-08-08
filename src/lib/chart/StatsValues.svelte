<script lang="ts">
import type { StatsData } from "../data/StatsData";

let { data }: { data: StatsData } = $props();
</script>

<div class="flex flex--gap">
  <div class="card strong">Individus :
    <span id="total" class="number">{data?.total}</span>
  </div>

  <div class="card strong">Âge moyen :
    <span id="mean" class="number">{data?.moyenne.toFixed(2)}</span>
  </div>

  <div class="card strong">Médiane :
    <span class="number">{data?.mediane.toFixed(2)}</span>
  </div>

  <div class="card strong">Écart-type :
    <span class="number">{data?.stdev.toFixed(2)}</span>
  </div>

  <div class="card strong">Minimum :
    <span class="number">{data?.minimum}</span>
  </div>

  <div class="card strong">Maximum :
    <span class="number">{data?.maximum}</span>
  </div>
</div>
<style>
  .card {
    height: 10vh;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }
  .flex--gap {
    gap: 0.5em;
  }
  .number {
    font-size: 1.75rem;
    font-weight: 600;
    display: block;
  }
</style>
