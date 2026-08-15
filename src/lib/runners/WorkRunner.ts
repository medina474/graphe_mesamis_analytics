import { DirectedGraph } from "graphology";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { WorkGenerator } from "../generators/WorkGenerator.js";
import { Enterprise, Facture, Affectation } from "../models/Enterprise.js";
import { Person } from "../models/Person.js";

export class WorkRunner {
  constructor(private readonly graph: DirectedGraph, private readonly population: Person[]) {}


  public run(): void {
    console.log(`----------------------------------------
Emploi
----------------------------------------`);
    const enterprises = JsonLoader.load("data/entreprises.json", Enterprise);

    for (const enterprise of enterprises) {
      this.addEnterprise(enterprise);
    }

    const affectations: Affectation[] = [];

    const workForce = [...this.population.filter((i) => i.age > 20 && i.age < 65)]

    const workGenerator = new WorkGenerator(
      this.graph,
      workForce,
      enterprises,
      affectations,
    );

    const nbDisponibles = workForce.length;
    console.log(`Population en âge de travailler : ${nbDisponibles}`);

    workGenerator.generate();

    console.log(`Population en activité : ${affectations.length}`);
    console.log(
      `Taux d'activité : ${((affectations.length / nbDisponibles) * 100).toFixed(2)} %`,
    );

    this.addEdgesWork(affectations)

    const factures = JsonLoader.load("data/factures.json", Facture);
    for (const facture of factures) {
      this.addFacture(facture);
    }
  }

  addEnterprise(enterprise: Enterprise): void {
    this.graph.addNode(enterprise.id, {
      category: "Enterprise",
      name: enterprise.name,
      label: enterprise.name,
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

  addEdgeWork(affectation: Affectation): void {
    this.graph.addEdge(affectation.person.id, affectation.enterprise.id, {
      relation: "WORK",
      poste: affectation.poste,
      weight: 1,
    });
  }

  addEdgesWork(affectations: Affectation[]): void {
    for (const affectation of affectations) {
      this.addEdgeWork(affectation)
    }
  }
}
