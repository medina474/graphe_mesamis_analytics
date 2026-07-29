<script lang="ts">
  import * as duckdb from "@duckdb/duckdb-wasm";
  import { db, connection } from "./lib/duckdb";
  import type { StatsData } from "./lib/types";

  import { getStats } from "./lib/queries/statistiques";
  import type { GenderData } from "./lib/queries/GenderData";
  import { getGenderData } from "./lib/queries/GenderData";

  import StatsValues from './lib/StatsValues.svelte'
  import GenderChart from './lib/GenderChart.svelte'

  import { init, use } from "echarts/core";
  import { BarChart, PieChart } from "echarts/charts";
  import { GridComponent, TitleComponent } from "echarts/components";
  import { CanvasRenderer } from "echarts/renderers";

  // now with tree-shaking
  use([BarChart, PieChart, GridComponent, CanvasRenderer, TitleComponent]);

  let genderData = $state<GenderData[]>([]);
  let statsData = $state<StatsData>({
    total: 0,
    moyenne: 0,
    stdev: 0,
    mediane: 0,
    minimum: 0,
    maximum: 0
  });

  async function chargerFichier(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      await db.registerFileHandle(
            "individus.csv",
            file,
            duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
            false
      );

      await connection.query(`
          CREATE OR REPLACE TABLE individus AS
          SELECT *
          FROM read_csv_auto(
              'individus.csv',
              HEADER=true
          );
      `);

      statsData = await getStats(connection);
      genderData = await getGenderData(connection);

    } catch (err) {
      console.error("Impossible de lire le fichier JSON :", err);
    }
  }
</script>

<input type="file" accept="text/csv,.csv" onchange={chargerFichier} />

<StatsValues data={statsData} />

<div class="app">
  <GenderChart data={genderData} />
</div>

<style>
  .app {
    width: 100vw;
    height: 50vh;
  }
</style>
