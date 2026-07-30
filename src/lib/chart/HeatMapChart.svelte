<script lang="ts">
import { init, use } from "echarts/core";
import type { EChartsOption } from "echarts";
import { Chart } from "svelte-echarts";
import { HeatmapChart } from "echarts/charts";
  import type { HeatMapData } from "../data/HeatMapData";

import { LegendComponent, TitleComponent, GridComponent, VisualMapComponent } from 'echarts/components';
use([LegendComponent, TitleComponent, GridComponent, VisualMapComponent, HeatmapChart]);

let { data }: { data: HeatMapData } = $props();

let options = $derived<EChartsOption>({
  xAxis: {
    type: "category",
    data: data.ages
  },

  yAxis: {
    type: "category",
    data: ["Sport", "Musique", "Lecture"]
  },

  visualMap: {
    min: 0,
    max: 1,
    calculable: true,

    orient: "horizontal",
    left: "center",
    bottom: 0,

    inRange: {
        color: [
          "#f5faf5",
            "#d8efd8",
            "#9bd09b",
            "#4d9f4d",
            "#176617"
        ]
    }
  },

  series: {
    type: 'heatmap',
    data: data.values
  }
});
</script>

<Chart {init} {options} />
