<script lang="ts">
    import { onMount } from "svelte";
    import Graph from "graphology";
    import Sigma from "sigma";
    import forceAtlas2 from "graphology-layout-forceatlas2";

    let container: HTMLDivElement;
    let relationFilter = $state("all");

    let data: any;
    let renderer: Sigma | undefined;

    function createGraph() {
        const graph = new Graph();

        const edges = relationFilter === "all"
            ? data.edges
            : data.edges.filter(
                (edge: any) =>
                    edge.attributes.category === relationFilter
            );

        const nodeIds = new Set<string>();

        edges.forEach((edge: any) => {
            nodeIds.add(edge.source);
            nodeIds.add(edge.target);
        });

        const nodes = data.nodes.filter(
            (node: any) => nodeIds.has(node.key)
        );

        graph.import({
            ...data,
            nodes,
            edges
        });

        return graph;
    }

    function render() {
        renderer?.kill();

        const graph = createGraph();

        forceAtlas2.assign(graph, {
            iterations: 100,
            settings: {
                gravity: 0.5,
                scalingRatio: 5,
                barnesHutOptimize: true,
                strongGravityMode: false
            }
        });

        renderer = new Sigma(graph, container);
    }

    onMount(async () => {

        const response = await fetch(
            "/relationships.json"
        );

        if (!response.ok) {
            throw new Error(
                `Impossible de charger relationships.json : ${response.status}`
            );
        }

        data = await response.json();

        render();

        return () => {
            renderer?.kill();
        };
    });

    $effect(() => {
        relationFilter;

        if (data) {
            render();
        }
    });
</script>

<div class="graph" bind:this={container}></div>

<div class="controls">
    <select bind:value={relationFilter}>
        <option value="all">Toutes les relations</option>
        <option value="family">Famille</option>
        <option value="club">Clubs</option>
        <option value="work">Travail</option>
        <option value="social">Amitiés</option>
        <option value="exchange">Échanges</option>
    </select>
</div>

<style>
    .graph {
        width: 100vw;
        height: 100vh;
    }

    .controls {
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 10;
    }
</style>
