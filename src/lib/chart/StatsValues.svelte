<script lang="ts">
import type { StatsData } from "../data/StatsData";

let { data }: { data: StatsData } = $props();
</script>

<div class="flex">
  <div class="strong">Individus :
    <span id="total" class="number">{data?.total}</span>
  </div>

  <div class="strong">Âge moyen :
    <span id="mean" class="number">{data?.moyenne}</span>
  </div>

  <div class="strong">Médiane :
    <span class="number">{data?.mediane}</span>
  </div>

  <div class="strong">Écart-type :
    <span class="number">{data?.stdev}</span>
  </div>

  <div class="strong">Minimum :
    <span class="number">{data?.minimum}</span>
  </div>

  <div class="strong">Maximum :
    <span class="number">{data?.maximum}</span>
  </div>
</div>
