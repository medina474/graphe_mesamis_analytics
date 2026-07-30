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
      text: "Genres",
    },
    color: ["#4A90E2", "#FF69B4"],
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
          color: '#fff',
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
