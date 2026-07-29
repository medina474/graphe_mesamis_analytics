<script lang="ts">
import { init, use } from "echarts/core";
import type { GenerationData } from "./queries/GenerationData";

import { Chart } from "svelte-echarts";
import { PieChart } from "echarts/charts";

import { LegendComponent, TitleComponent } from 'echarts/components';
use([LegendComponent, TitleComponent, PieChart]);

let { data }: { data: GenerationData[] } = $props();

let options = $derived({
    title: {
      text: "Génération",
    },
    color: ["#81C784", "#FFD54F", "#E57373"],
    legend: {
      orient: "horizontal",
      bottom: 0,
      left: "center"
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "80%"],
        data,
        label: {
          show: true,
          position: "inside",
          formatter: (d) => `${d.percent.toFixed(1)}%`
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        labelLine: {
          show: false,
        },
      },
    ],
  });
</script>

<Chart {init} {options} />
