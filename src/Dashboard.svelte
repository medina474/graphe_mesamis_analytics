<script lang="ts">
  import * as duckdb from "@duckdb/duckdb-wasm";
  import { db, connection } from "./lib/duckdb";
  import { stats } from "./lib/queries/statistiques";
  import { genres } from "./lib/queries/genres";

  import GenderChart from './lib/GenderChart.svelte'

  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { BarChart, PieChart } from "echarts/charts";
  import { GridComponent, TitleComponent } from "echarts/components";
  import { CanvasRenderer } from "echarts/renderers";

  // now with tree-shaking
  use([BarChart, PieChart, GridComponent, CanvasRenderer, TitleComponent]);

let genres_data = stats([])


  let total = $state(0);
  let moyenne = $state(0);
  let stdev = $state(0);
  let mediane = $state(0);
  let minimum = $state(0);
  let maximum = $state(0);

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

      const result = await stats(connection);

      total = Number(result.getChild("total")?.get(0));
      moyenne = Number(result.getChild("moyenne")?.get(0));

      const result2 = await genres(connection);
      genres_data = result2.toArray().map(row => ({
        name: row.name,
        value: Number(row.value)
    }));

    console.log(genres_data);
    } catch (err) {
      console.error("Impossible de lire le fichier JSON :", err);
    }
  }
</script>

<input type="file" accept="text/csv,.csv" onchange={chargerFichier} />

<div class="flex">
  <div class="strong">Individus :
  <span id="total" class="number">{total}</span></div>

  <div class="strong">Âge moyen :<span id="mean" class="number"
    >{moyenne}</span></div>

    <div class="strong">Médiane :
    <span class="number">{mediane}</span>
    </div>

    <div class="strong">Écart-type :
    <span class="number">{stdev}</span>
    </div>

    <div class="strong">Minimum :
    <span class="number">{minimum}</span>
    </div>

    <div class="strong">Maximum :
    <span class="number">{maximum}</span>
    </div>
</div>

<div class="app">
  <GenderChart />
</div>

<style>
  .app {
    width: 100vw;
    height: 50vh;
  }
</style>
