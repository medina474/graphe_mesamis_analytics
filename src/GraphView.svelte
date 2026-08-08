<script lang="ts">
  import { onMount } from "svelte";
  import { MultiDirectedGraph } from "graphology";
  import Sigma from "sigma";
  import forceAtlas2 from "graphology-layout-forceatlas2";
  import { getAttributesItemsCount } from "sigma/rendering";

  let container: HTMLDivElement;
  let relationFilter = $state("all");

  let data: any;
  let renderer: Sigma | undefined;

  function createGraph() {
    const graph = new MultiDirectedGraph();

    const edges =
      relationFilter === "all"
        ? data.edges
        : data.edges.filter((edge: any) =>
            relationFilter.includes(edge.attributes.relation),
          );

    const nodeIds = new Set<string>();

    edges.forEach((edge: any) => {
      nodeIds.add(edge.source);
      nodeIds.add(edge.target);
    });

    const nodes = data.nodes.filter((node: any) => nodeIds.has(node.key));

    graph.import({
      ...data,
      nodes,
      edges,
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

    renderer = new Sigma(graph, container, {
        enableEdgeEvents: true,
    });

    renderer.on("clickNode", ({ node }) => {
      const relations = [];

      graph.forEachEdge(node, (edge, edgeAttrs, source, target) => {
        const other = source === node ? target : source;

        relations.push({
          id: other,
          nom: graph.getNodeAttribute(other, "label"),
          relation: edgeAttrs.relation,
          source,
          target,
          edge,
        });
      });

      console.clear();
      const attributes = graph.getNodeAttributes(node);
      const info = [];
      info.push({
        id: node,
        category: attributes.category,
        label: attributes.label,
      });
      console.table(info);
      console.log("Noeud sélectionné :", graph.getNodeAttributes(node));
      console.table(relations);
    });

    renderer.on("clickEdge", ({ edge }) => {
      console.clear();
      console.table({
        id: edge,
        source: graph.source(edge),
        target: graph.target(edge),
        ...graph.getEdgeAttributes(edge),
      });
    });
  }

  onMount(() => {
    (async () => {
      const response = await fetch("/relationships.json");
      data = await response.json();
      render();
    })();

    return () => renderer?.kill();
  });

  $effect(() => {
    relationFilter;

    if (data) {
      render();
    }
  });
</script>

<div class="graph-view">
  <div class="graph" bind:this={container}></div>

  <div class="controls">
    <select bind:value={relationFilter}>
      <option value="all">Toutes les relations</option>
      <option value="marriage|child|father|mother">Famille</option>
      <option value="marriage">Famille : mariages</option>
      <option value="child">Famille : enfants</option>
      <option value="member">Clubs</option>
      <option value="work">Travail</option>
      <option value="friends">Amitiés</option>
      <option value="tag|WRITE|belongs-to|publication|parts-of|MANAGE|emprunte">Livres</option>
      <option value="tag">Livres - tag</option>
      <option value="WRITE|tag">Livres - auteurs</option>
      <option value="belongs-to|publication|tag|MANAGE">Livres - bibliothèques</option>
      <option value="prete|publication">Livres - prêt</option>
      <option value="emprunte|publication">Livres - emprunt</option>
      <option value="publication">Livres - publication</option>
      <option value="parts-of|publication">Livres - Séries</option>
      <option value="habite">Adresse</option>
    </select>
  </div>
</div>

<style>
  /*
   * On englobe le graphe et les controls dans un conteneur local
   * `position: relative`. Les controls passent en `absolute` (relatifs
   * à CE conteneur) au lieu de `fixed` (relatif à tout le viewport) :
   * ils ne peuvent plus se superposer à d'autres vues (ex. les
   * statistiques) puisqu'ils restent confinés à GraphView.
   */
  .graph-view {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  .graph {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 10;
  }
</style>
