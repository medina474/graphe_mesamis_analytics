import { DirectedGraph } from "graphology";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { WorkGenerator } from "../generators/WorkGenerator.js";
import { Enterprise, Facture } from "../models/Enterprise.js";
import { Person } from "../models/Person.js";

export class WorkRunner {
  constructor(private readonly graph: DirectedGraph, private readonly population: Person[]) {}

  public run(): void {
    console.log(`----------------------------------------`);
    const enterprises = JsonLoader.load("data/entreprises.json", Enterprise);

    for (const enterprise of enterprises) {
      this.addEnterprise(enterprise);
    }

    const factures = JsonLoader.load("data/factures.json", Facture);
    for (const facture of factures) {
      this.addFacture(facture);
    }

    const workGenerator = new WorkGenerator(
      this.graph,
      this.population,
      enterprises,
    );

    workGenerator.generate();

    population.reduce((s, c) => { s+= c.enterprise ? : 1 : 0 }, 0)
    console.log(`${ s / population.length }`)
  }

  addEnterprise(enterprise: Enterprise): void {
    this.graph.addNode(enterprise.id, {
      category: "Enterprise",
      name: enterprise.name,
      label: enterprise.name,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1,
      color: "#ffd035",
    });
  }

  addFacture(facture: Facture): void {
    this.graph.addNode(facture.id, {
      category: "Invoice",
      date: facture.date,
      montant_ht: facture.montant_ht,
      taux_tva: facture.taux_tva,
      montant_tva: facture.montant_tva,
      montant_ttc: facture.montant_ttc,
      color: "#3575ff",
    });

    this.graph.addEdge(facture.fournisseur, facture.client, {
      relation: "INVOICE",
      weight: 1,
    });
  }
}
