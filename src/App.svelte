<script lang="ts">
  import { onMount } from "svelte";
  import { loadDatasetFromGraph } from "./lib/data/DashboardData";
  import type { DashboardData } from "./lib/data/DashboardData";
  import { createEmptyDashboard } from "./lib/data/DashboardState.svelte";

  import StatsValues from './lib/chart/StatsValues.svelte'
  import GenderChart from './lib/chart/GenderChart.svelte'
  import EducationChart from './lib/chart/EducationChart.svelte'
  import WealthChart from './lib/chart/WealthChart.svelte'
  import GenerationChart from './lib/chart/GenerationChart.svelte'
  import PyramideChart from './lib/chart/PyramideChart.svelte'
  import HeatMapChart from './lib/chart/HeatMapChart.svelte'
  import RadarChart from './lib/chart/RadarChart.svelte'
  import GraphView from "./GraphView.svelte";
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  use([CanvasRenderer]);

  let dashboard = $state<DashboardData>(createEmptyDashboard());

  type ViewId = "stats" | "graph";
  type SectionId =
    | "demographie"
    | "clubs"
    | "emploi"
    | "logement"
    | "lecture"
    | "prets";

  interface Section {
    id: SectionId;
    label: string;
    // Passe à true quand les données + le(s) composant(s) de graphique
    // correspondants sont branchés dans DashboardData.
    ready: boolean;
  }

  // Ajouter une nouvelle table de stats = ajouter une ligne ici,
  // puis un bloc {#if activeSection === "..."} dans le template.
  const sections: Section[] = [
    { id: "demographie", label: "Démographie", ready: true },
    { id: "clubs", label: "Clubs sportifs", ready: false },
    { id: "emploi", label: "Emploi", ready: false },
    { id: "logement", label: "Taux d'occupation logements", ready: false },
    { id: "lecture", label: "Habitudes de lecture", ready: false },
    { id: "prets", label: "Prêts", ready: false },
  ];

  let activeView = $state<ViewId>("stats");
  let activeSection = $state<SectionId>("demographie");

  onMount(async () => {
    try {
      const response = await fetch("/relationships.json");
      const graphData = await response.json();
      dashboard = await loadDatasetFromGraph(graphData);
    } catch (err) {
      console.error("Erreur chargement dataset depuis relationships.json :", err);
    }
  });
</script>

<div class="layout">
  <header class="topbar">
    <h1 class="title">Tableau de bord</h1>
    <nav class="view-switch">
      <button
        class:active={activeView === "stats"}
        onclick={() => (activeView = "stats")}
      >
        Statistiques
      </button>
      <button
        class:active={activeView === "graph"}
        onclick={() => (activeView = "graph")}
      >
        Graphe relationnel
      </button>
    </nav>
  </header>

  {#if activeView === "stats"}
    <div class="stats-layout">
      <aside class="sidebar">
        {#each sections as section (section.id)}
          <button
            class:active={activeSection === section.id}
            class:disabled={!section.ready}
            disabled={!section.ready}
            onclick={() => (activeSection = section.id)}
          >
            <span>{section.label}</span>
            {#if !section.ready}<span class="badge">bientôt</span>{/if}
          </button>
        {/each}
      </aside>

      <main class="content">
        {#if activeSection === "demographie"}
          <StatsValues data={dashboard.stats} />

          <div class="grid">
            <div class="card"><GenderChart data={dashboard.genders} /></div>
            <div class="card"><GenerationChart data={dashboard.generation} /></div>
            <div class="card card--tall"><PyramideChart data={dashboard.pyramide} /></div>
            <div class="card card--tall"><RadarChart data={dashboard.radar} /></div>
            <div class="card"><HeatMapChart data={dashboard.heatmappF} /></div>
            <div class="card"><HeatMapChart data={dashboard.heatmappH} /></div>
            <div class="card"><EducationChart data={dashboard.education} /></div>
            <div class="card"><WealthChart data={dashboard.wealth} /></div>
          </div>
        {:else}
          <p class="placeholder">
            Cette section n'est pas encore alimentée. Ajoutez les données
            correspondantes dans <code>DashboardData</code>, créez le(s)
            composant(s) de graphique associé(s), puis complétez le bloc
            <code>{'{#if activeSection === "' + activeSection + '"}'}</code>
            dans <code>App.svelte</code> pour l'activer ici.
          </p>
        {/if}
      </main>
    </div>
  {:else}
    <GraphView />
  {/if}
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    flex-shrink: 0;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  .view-switch {
    display: flex;
    gap: 0.5rem;
  }

  .view-switch button {
    padding: 0.4rem 0.9rem;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    background: #fff;
    cursor: pointer;
    font: inherit;
  }

  .view-switch button.active {
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;
  }

  .stats-layout {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .sidebar {
    width: 220px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    border-right: 1px solid #e5e7eb;
  }

  .sidebar button {
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font: inherit;
  }

  .sidebar button:not(.disabled):hover {
    background: #f3f4f6;
  }

  .sidebar button.active {
    background: #eff6ff;
    color: #2563eb;
    font-weight: 600;
  }

  .sidebar button.disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }

  .badge {
    font-size: 0.65rem;
    background: #f3f4f6;
    color: #6b7280;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .card {
    height: 30vh;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.5rem;
  }

  .card--tall {
    height: 60vh;
    grid-column: span 2;
  }

  .placeholder {
    color: #6b7280;
    max-width: 45ch;
  }
</style>
