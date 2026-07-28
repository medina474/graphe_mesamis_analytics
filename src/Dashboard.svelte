<script lang="ts">
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
  let moyen = $state(0);
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
      const text = await file.text();
      individus = JSON.parse(text);
      total = individus.length;
    } catch (err) {
      console.error("Impossible de lire le fichier JSON :", err);
    }
  }
</script>

<input type="file" accept="application/json,.json" onchange={chargerFichier} />

<div style="display: flex">
  <div>
    <p>
      <span class="strong">Individus :</span>
      <span id="total" class="number">{total}</span><br />
      <span class="strong">Âge moyen :</span><span id="mean" class="number"
        >{moyen}</span
      ><br />
      <span class="strong">Médiane :</span>
      <span id="median" class="number">{mediane}</span><br />
      <span class="strong">Écart-type :</span>
      <span id="ecart" class="number">{stdev}</span><br />
      <span class="strong">Minimum :</span>
      <span id="min" class="number">{minimum}</span><br />
      <span class="strong">Maximum :</span>
      <span id="max" class="number">{maximum}</span>
    </p>
  </div>
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
