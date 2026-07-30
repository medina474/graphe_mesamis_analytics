<script lang="ts">
  import { init, use } from "echarts/core";
  import type { EChartsOption } from "echarts";
  import type { RadarData } from "../data/RadarData";

  import { Chart } from "svelte-echarts";
  import { RadarChart } from "echarts/charts";

import { LegendComponent, TitleComponent, GridComponent } from 'echarts/components';
use([LegendComponent, TitleComponent, GridComponent, RadarChart]);

  let { data }: { data: RadarData[] } = $props();

  let options =$derived<EChartsOption>({
  color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
  title: {
    text: 'Customized Radar Chart'
  },
  legend: {},
  radar: [
    {
      indicator: [
        { text: 'Education', max: 1 },
        { text: 'Richesse', max: 1 },
        { text: 'Sport', max: 1 },
        { text: 'Lecture', max: 1 },
        { text: 'Musique', max: 1 }
      ],
      radius: 120,
      axisName: {
        color: '#fff',
        backgroundColor: '#666',
        borderRadius: 3,
        padding: [3, 5]
      }
    }
  ],
  series: [
    {
      type: 'radar',
      data
    }
  ]
});

</script>

<Chart {init} {options} />
