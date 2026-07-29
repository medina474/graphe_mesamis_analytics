<script lang="ts">
import { init, use } from "echarts/core";

import { Chart } from "svelte-echarts";
import { PieChart } from "echarts/charts";

let options = {
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
        data: [
          { value: 1048, name: "Hommes" },
          { value: 735, name: "Femmes" }
        ],
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
  };
</script>

<Chart {init} {options} />
