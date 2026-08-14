<script lang="ts">
  import { onMount } from "svelte";
  import { MultiDirectedGraph } from "graphology";
  import Sigma from "sigma";
  import forceAtlas2 from "graphology-layout-forceatlas2";

  let container: HTMLDivElement;
  let relationFilter = $state("NONE");

  let data: any;
  let renderer: Sigma | undefined;
  let showDialog = false;
  let selectedNodeInfo: any = null;
  let selectedRelations: any[] = [];

  function closeDialog() {
    showDialog = false;
    selectedNodeInfo = null;
    selectedRelations = [];
  }

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

    graph.forEachNode((node, attributes) => {

      if (typeof attributes.size === undefined) {
        attributes.size = 1;
      }

      if (typeof attributes.x_geo !== undefined) {
        attributes.x = attributes.x_geo;
        attributes.y = attributes.y_geo;
      } else if (typeof attributes.x === undefined) {
        attributes.x = Math.random() * 1000;
        attributes.y = Math.random() * 1000;
      }

      let count = 0;

      if (relationFilter.includes("MANAGE")) {
        count = attributes.reading * 6;
      } else if (relationFilter.includes("WORK")) {
        count = attributes.wealth * 2;
      } else if (relationFilter.includes("WRITE")) {
        count = countEdge(graph, node, "WRITE")
      }  else if (relationFilter.includes("PARTS-OF")) {
        count = countEdge(graph, node, "PARTS-OF")
      }  else if (relationFilter.includes("CLASSIFY-AS")) {
        count = countEdge(graph, node, "CLASSIFY-AS")
      } else if (relationFilter.includes("CONTAIN")) {
        count = countEdge(graph, node, "CONTAIN")
      } else if (relationFilter.includes("friends")) {
        graph.forEachEdge(node, (_edge, edgeAttributes) => {
          if (edgeAttributes.relation === "friends") {
            count++;
          }
        });
      } else if (relationFilter.includes("CHILD")) {
        graph.forEachEdge(node, (_edge, edgeAttributes) => {
          if (edgeAttributes.relation === "CHILD") {
            count++;
          }
        });
      } else {
        count = 0;
      }

      attributes.size = Math.log2(count + 2);
    });

    return graph;
  }

  function countEdge(graph: MultiDirectedGraph, node: any, relation: string): number {
    let count = 0;
    graph.forEachEdge(node, (_edge, edgeAttributes) => {
      if (edgeAttributes.relation === relation) {
        count++;
      }
    });
    return count;
  }

  function render() {
    renderer?.kill();

    const graph = createGraph();

    if (relationFilter !== "LIVE" && relationFilter !== "ZZ|YY") {
      forceAtlas2.assign(graph, {
        iterations: 200,
        settings: {
          gravity: 0.5,
          scalingRatio: 5,
          barnesHutOptimize: true,
          strongGravityMode: false,
        },
      });
    }

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

      const attributes = graph.getNodeAttributes(node);

      selectedNodeInfo = {
        id: node,
        category: attributes.category,
        label: attributes.label,
        attributes,
      };

      selectedRelations = relations;
      showDialog = true;
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
      <option value="NONE">Toutes les relations</option>
      <option value="marriage|child|father|mother">Famille</option>
      <option value="MEMBER">Clubs</option>
      <option value="WORK">Travail</option>
      <option value="friends">Amitiés</option>
      <option value="WRITE">Livres - auteurs</option>
      <option value="CLASSIFY-AS">- genres</option>
      <option value="PARTS-OF">- series</option>
      <option value="CONTAIN|COPY-OF">Livres - bibliothèques</option>
      <option value="BORROW">- emprunt</option>
      <option value="LEND|FOLLOW">- Prêt</option>
      <option value="FOLLOW|RETURN-TO">Chaine de retour</option>
      <option value="REWARD|NOMINATE|BELONG|WRITE">Récompenses</option>
      <option value="LIVE">Adresse</option>
      <option value="INVOICE">Facturation</option>
      <option value="ZZ|YY">Education</option>
    </select>
  </div>

  {#if showDialog}
    <div class="dialog-backdrop" on:click={closeDialog}>
      <div class="dialog" on:click|stopPropagation>
        <button class="dialog-close" aria-label="Fermer" on:click={closeDialog}>×</button>
        <h3>{selectedNodeInfo?.label}</h3>
        <div class="dialog-section">
          <strong>Catégorie:</strong> {selectedNodeInfo?.category}
        </div>
        <div class="dialog-section">
          <strong>Attributs:</strong>
          <pre class="attrs">{JSON.stringify(selectedNodeInfo?.attributes, null, 2)}</pre>
        </div>
        <div class="dialog-section">
          <strong>Relations ({selectedRelations.length}):</strong>
          <ul>
            {#each selectedRelations as r}
              <li><strong>{r.relation}</strong> — {r.nom} (id: {r.id})</li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  {/if}
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
    height: 100%;
  }

  .graph {
    width: 100%;
    height: 100%;
  }

  .controls {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .dialog-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .dialog {
    background: white;
    color: #111;
    padding: 1rem;
    border-radius: 8px;
    width: min(90%, 700px);
    max-height: 80%;
    overflow: auto;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }

  .dialog-close {
    position: absolute;
    right: 12px;
    top: 8px;
    background: transparent;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
  }

  .dialog-section { margin-top: 0.5rem; }

  .attrs { background: #f7f7f7; padding: 0.5rem; border-radius: 4px; }
</style>
