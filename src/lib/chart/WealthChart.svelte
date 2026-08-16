<script lang="ts">
import { init, use } from "echarts/core";
import type { EChartsOption } from "echarts";
import type { PieData } from "../data/PieData";

import { Chart } from "svelte-echarts";
import { PieChart } from "echarts/charts";

import { LegendComponent, TitleComponent } from 'echarts/components';
use([LegendComponent, TitleComponent, PieChart]);

let { data }: { data: PieData[] } = $props();

let options = $derived<EChartsOption>({
    title: {
      text: "Revenus",
    },
    color: ["#90CAF9", "#81C784", "#FFD54F", "#E57373"],
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
          formatter: (d) => `${d.value}`
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
