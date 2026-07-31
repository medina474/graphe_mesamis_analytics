<script lang="ts">
    import { onMount } from "svelte";
    import Graph from "graphology";
    import Sigma from "sigma";

    let container: HTMLDivElement;

    onMount(() => {
        const graph = new Graph();

        graph.addNode("1", {
            label: "Jean",
            x: 0,
            y: 0,
            size: 15
        });

        graph.addNode("2", {
            label: "Marie",
            x: 1,
            y: 0,
            size: 15
        });

        graph.addNode("3", {
            label: "Paul",
            x: 0,
            y: 1,
            size: 15
        });

        graph.addNode("4", {
            label: "Sophie",
            x: 1,
            y: 1,
            size: 15
        });

        graph.addEdge("1", "2");
        graph.addEdge("1", "3");
        graph.addEdge("2", "4");

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
