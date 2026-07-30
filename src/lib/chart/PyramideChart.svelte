<script lang="ts">
import { init, use } from "echarts/core";
import type { EChartsOption } from "echarts";
import type { PyramideData } from "../data/PyramideData";

import { Chart } from "svelte-echarts";
import { BarChart } from "echarts/charts";

import { LegendComponent, TitleComponent, GridComponent } from 'echarts/components';
use([LegendComponent, TitleComponent, GridComponent, BarChart]);

let { data }: { data: PyramideData[] } = $props();

let options = $derived<EChartsOption>({
    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      containLabel: true
    },

    title: {
      text: "Pyramide des âges",
    },

    color: ["#81C784", "#FFD54F", "#E57373"],

    legend: {
      orient: "horizontal",
      bottom: 0,
      left: "center"
    },

    yAxis: {
      type: "category",
      data: data.map(x => x.age)
    },
    xAxis: {
      type: "value"
    },
    series: [
      {
        name: "Hommes",
        type: "bar",
        stack: "hommes",
        data: data.map(x => x.hommes),
        itemStyle: {
          color: "#2563eb"
        }
      },
      {
        name: "Écart hommes",
        type: "bar",
        stack: "hommes",
        data: data.map(x => x.hommesEcart),
        itemStyle: {
          color: "#93c5fd"
        }
      },
      {
        name: "Femmes",
        type: "bar",
        stack: "femmes",
        data: data.map(x => x.femmes),
        itemStyle: {
          color: "#db2777"
        }
      },
      {
        name: "Écart femmes",
        type: "bar",
        stack: "femmes",
        data: data.map(x => x.femmesEcart),
        itemStyle: {
          color: "#f9a8d4"
        }
      }
    ],
  });
</script>

<Chart {init} {options} />
