<script lang="ts">
  import * as duckdb from "@duckdb/duckdb-wasm";
  import { db, connection } from "./lib/duckdb";
  import { Chart } from "svelte-echarts";

  import { init, use } from "echarts/core";
  import { BarChart } from "echarts/charts";
  import { GridComponent, TitleComponent } from "echarts/components";
  import { CanvasRenderer } from "echarts/renderers";

  // now with tree-shaking
  use([BarChart, GridComponent, CanvasRenderer, TitleComponent]);

  let options = {
    title: {
      text: "ECharts Example",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    ],
  };

  let option2 = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };

  let individus: unknown[] = [];

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


      const result = await connection.query(`
          SELECT COUNT(*) AS total, AVG(age) as moyenne
          FROM individus;
      `);

      total = Number(result.getChild("total")?.get(0));
      moyenne = Number(result.getChild("moyenne")?.get(0));
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
    <span id="median" class="number">{mediane}</div>

    <div class="strong">Écart-type :
    <span id="ecart" class="number">{stdev}</div>

    <div class="strong">Minimum :
    <span id="min" class="number">{minimum}</div>

    <div class="strong">Maximum :
    <span id="max" class="number">{maximum}</span></div>
</div>

<div class="app">
  <Chart {init} {options} />
</div>

<style>
  .app {
    width: 100vw;
    height: 50vh;
  }
</style>
