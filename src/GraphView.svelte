<script lang="ts">
    import { onMount } from "svelte";
    import Graph from "graphology";
    import Sigma from "sigma";
    import forceAtlas2 from "graphology-layout-forceatlas2";

    let container: HTMLDivElement;

    onMount(async () => {
        const response = await fetch("/relationships.json");

        if (!response.ok) {
            throw new Error(
                `Impossible de charger relationships.json : ${response.status}`
            );
        }

        const data = await response.json();

        const graph = new Graph();

        graph.import(data);

        forceAtlas2.assign(graph, {
            iterations: 100,
            settings: {
                gravity: 0.5,
                scalingRatio: 5,
                barnesHutOptimize: true,
                strongGravityMode: false
            }
        });

        const renderer = new Sigma(graph, container);

        return () => renderer.kill();
    });
</script>

<div bind:this={container} class="graph"></div>

<style>
    .graph {
        width: 100vw;
        height: 100vh;
    }
</style>
