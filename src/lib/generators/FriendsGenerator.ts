import { Random } from "../stats/Random.js";
import { Person } from "../models/Person.js";
import { UndirectedGraph } from "graphology";


export class FriendsGenerator {

  private readonly stats: { mean: number; std: number }[];

  constructor(
    private readonly graph: UndirectedGraph,
    private readonly individus: Person[],
  ) {
    this.stats = this.computeStats();
  }

  private rawVector(person: Person): number[] {
    return [
      person.reading,
      person.music,
      person.sport,
      person.education,
      person.wealth,
    ];
  }

  private vector(person: Person): number[] {
    const raw = this.rawVector(person);

    return raw.map((v, i) => (v - this.stats[i].mean) / this.stats[i].std);
  }

  private computeStats(): { mean: number; std: number }[] {
    const vectors = this.individus.map((p) => this.rawVector(p));
    const dims = vectors[0].length;
    const stats = [];

    for (let d = 0; d < dims; d++) {
      const values = vectors.map((v) => v[d]);
      const mean = values.reduce((s, v) => s + v, 0) / values.length;
      const variance =
        values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
      const std = Math.sqrt(variance) || 1; // évite division par 0 si constante

      stats.push({ mean, std });
    }

    return stats;
  }

  generate(iterations: number): void {
    for (let k = 0; k < iterations; k++) {
      const a = this.randomPerson();
      const b = this.preferentialPerson(a);

      if (!b) {
        console.log(`${k} pas de personne préférentielle`);
        continue;
      }

      const idA = a.id;
      const idB = b.id;

      console.log(`${a.firstname} ? ${b.firstname}`)
      if (this.graph.hasEdge(idA, idB)) {
        console.log(`${k} personnes déja liées`);
        continue;
      }

      const similarity = this.similarity(a, b);
      const age = this.ageAffinity(a, b);
      const gender = this.genderAffinity(a, b);

      const triadic = this.triadicScore(idA, idB);
      const interaction = this.interactionScore(idA, idB);

      /*
       * Affinité intrinsèque
       */
      const affinity = 3 * similarity + 1.5 * age + 1 * gender;

      /*
       * Opportunités sociales
       */
      const opportunity = 2 * triadic;

      /*
       * Probabilité finale
       */
      const z = -2 + affinity + opportunity;
      const p = 1 / (1 + Math.exp(-z));

      console.log(`affinity = ${affinity.toFixed(2)} : ${similarity.toFixed(2)} * ${age.toFixed(2)} * ${gender.toFixed(2)}`);
      console.log(`opportunity = ${opportunity.toFixed(2)} : 1 + ${interaction.toFixed(2)} * 2 + ${triadic.toFixed(2)} * 2`);
      console.log(`p = ${p.toFixed(2)} : 0.03 * ${affinity.toFixed(2)} * ${opportunity.toFixed(2)}`);

      if (Math.random() < p) {
        console.log("match");
        a.edges++;
        b.edges++;

        this.graph.addEdge(idA, idB, {
          relation: "friends",
          category: "friends",
          weight: 3,
        });
      }
    }
  }

  private randomPerson(): Person {
    return this.individus[Math.floor(Math.random() * this.individus.length)];
  }

  private preferentialPerson(exclude: Person): Person | null {
    const candidates = this.individus.filter(
      (person) =>
        person.id !== exclude.id && !this.graph.hasEdge(exclude.id, person.id),
    );

    if (candidates.length === 0) {
      return null;
    }

    const weights = candidates.map((person) => {
      const degreeWeight = Math.pow(this.graph.degree(person.id) + 1, 0.5);
      const homophilyWeight = this.contextAffinity(exclude, person); // ex: 1 + bonus clubs/travail

      return degreeWeight * homophilyWeight;
    });

    const total = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * total;

    for (let i = 0; i < candidates.length; i++) {
      random -= weights[i];
      if (random <= 0) return candidates[i];
    }

    return candidates[candidates.length - 1];
  }

  private similarity(a: Person, b: Person): number {
    const va = this.vector(a);
    const vb = this.vector(b);

    return Random.cosineSimilarity(va, vb);
  }

  private contextAffinity(a: Person, b: Person): number {
    let score: number = 0;

    // Clubs communs
    const clubsA = this.getNeighborsByCategory(a.id, "MEMBER");
    const clubsB = this.getNeighborsByCategory(b.id, "MEMBER");

    const commonClubs = this.intersectionSize(clubsA, clubsB);

    // Entreprise commune
    const enterprisesA = this.getNeighborsByCategory(a.id, "WORK");
    const enterprisesB = this.getNeighborsByCategory(b.id, "WORK");

    const commonEnterprises = this.intersectionSize(enterprisesA, enterprisesB);

    /**
     * 1 - Math.exp(-commonClubs)
     * 0 : 0
     * 1 : 0.63
     * 2 : 0.86
     * 3 : 0.95
     */
    score +=  (1 - Math.exp(-commonClubs));
    score += 0.32 * (1 - Math.exp(-commonEnterprises));

    /* 1 et 1 : min : 0 max : 1.32 */
    return score;
  }

  private ageAffinity(a: Person, b: Person): number {
    const difference = Math.abs(a.age - b.age);
    return Math.exp(-difference / 15);
  }

  private genderAffinity(a: Person, b: Person): number {
    return a.gender === b.gender ? 1 : 0.7;
  }

  private triadicScore(a: string, b: string): number {
    const neighborsA = new Set(this.graph.neighbors(a));
    const neighborsB = new Set(this.graph.neighbors(b));

    let common = 0;

    for (const neighbor of neighborsA) {
      if (neighborsB.has(neighbor)) {
        common++;
      }
    }

    return 1 - Math.exp(-common / 2);
  }

  private getNeighborsByCategory(
    personId: string,
    category: string,
  ): Set<string> {
    const result = new Set<string>();

    for (const neighbor of this.graph.neighbors(personId)) {
      if (this.graph.getNodeAttribute(neighbor, "relation") === category) {
        result.add(neighbor);
      }
    }

    return result;
  }

  private intersectionSize(a: Set<string>, b: Set<string>): number {
    let count = 0;

    for (const value of a) {
      if (b.has(value)) {
        count++;
      }
    }

    return count;
  }

  private interactionScore(a: string, b: string): number {
    let score = 0;

    // Famille
    if (this.graph.hasEdge(a, b)) {
      const relation = this.graph.getEdgeAttribute(a, b, "relation");

      if (
        relation === "mother" ||
        relation === "father" ||
        relation === "child"
      ) {
        score += 0.6;
      }
    }

    // Clubs communs
    const clubsA = this.getNeighborsByCategory(a, "MEMBER");
    const clubsB = this.getNeighborsByCategory(b, "MEMBER");

    const commonClubs = this.intersectionSize(clubsA, clubsB);

    if (commonClubs > 0) {
      score += 0.35 * (1 - Math.exp(-commonClubs));
    }

    // Entreprise commune
    const enterprisesA = this.getNeighborsByCategory(a, "WORK");
    const enterprisesB = this.getNeighborsByCategory(b, "WORK");

    const commonEnterprises = this.intersectionSize(enterprisesA, enterprisesB);

    if (commonEnterprises > 0) {
      score += 0.35 * (1 - Math.exp(-commonEnterprises));
    }

    return Math.min(score, 1);
  }
}
