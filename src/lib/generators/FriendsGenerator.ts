import { Random } from "../utilities/Random.js";
import { Person } from "../models/Person.js";
import { UndirectedGraph } from "graphology";

export class FriendsGenerator {
  private readonly stats: { mean: number; std: number }[];
  private readonly sigma: number;

  constructor(
    private readonly graph: UndirectedGraph,
    private readonly individus: Person[],
    private readonly genderAffinityParam: number = 0.7
  ) {
    this.stats = this.computeStats();
    this.sigma = this.calibrateSigma();

    // à lancer une fois, sur un échantillon de paires aléatoires
    console.log("Similarité")
    const sample = [];
    for (let i = 0; i < 1000; i++) {
      const a = individus[Math.floor(Math.random() * individus.length)];
      const b = individus[Math.floor(Math.random() * individus.length)];
      if (a.id === b.id) continue;

      sample.push(this.similarity(a, b));
    }

    sample.sort((x, y) => x - y);
    console.log("min", sample[0]);
    console.log("p25", sample[Math.floor(sample.length * 0.25)]);
    console.log("median", sample[Math.floor(sample.length * 0.5)]);
    console.log("p75", sample[Math.floor(sample.length * 0.75)]);
    console.log("max", sample[sample.length - 1]);
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

  private calibrateSigma(): number {
    const sampleSize = Math.min(1000, this.individus.length * 5);
    const distances: number[] = [];

    for (let i = 0; i < sampleSize; i++) {
      const a =
        this.individus[Math.floor(Math.random() * this.individus.length)];
      const b =
        this.individus[Math.floor(Math.random() * this.individus.length)];
      if (a.id === b.id) continue;

      const va = this.vector(a);
      const vb = this.vector(b);
      const squaredDist = va.reduce((sum, v, i) => sum + (v - vb[i]) ** 2, 0);

      distances.push(squaredDist);
    }

    distances.sort((x, y) => x - y);
    const medianSquaredDist = distances[Math.floor(distances.length / 2)];

    // On veut qu'une paire à distance médiane ait une similarité ~0.5
    // exp(-d / (2*sigma^2)) = 0.5  =>  sigma^2 = d / (2*ln(2))
    return Math.sqrt(medianSquaredDist / (2 * Math.log(2)));
  }

  generate(iterations: number): void {
    for (let k = 0; k < iterations; k++) {
      const a = this.randomPerson();
      const result = this.preferentialPerson(a);

      if (!result) {
        console.log(`${k} ${a.firstname} pas de personne préférentielle`);
        continue;
      }

      const { person: b, affinity, context } = result;

      /*
       * Opportunités sociales
       */
      const triadic = this.triadicScore(a.id, b.id);
      const opportunity = 2 * triadic;

      /*
       * Probabilité finale
       */
      const z = -2 + 3 * affinity + opportunity;
      const p = 1 / (1 + Math.exp(-z));

      if (Math.random() < p) {
        a.friendsCount++;
        b.friendsCount++;

        a.friends.push(b);

        // Faire le lien maintenant, car utilisé dans l'exclusion
        this.graph.addEdge(a.id, b.id, {
          relation: "FRIENDS",
          weight: 1,
        });
      }
    }
  }

  private randomPerson(): Person {
    return this.individus[Math.floor(Math.random() * this.individus.length)];
  }

  private preferentialPerson(
    exclude: Person,
  ): { person: Person; affinity: number; context: number } | null {
    const candidates = this.individus.filter(
      (person) =>
        person.id !== exclude.id && !this.graph.hasEdge(exclude.id, person.id),
    );

    if (candidates.length === 0) {
      return null;
    }

    const scored = candidates.map((person) => {
      /*
       * Affinité intrinsèque
       */
      const affinity =
        this.similarity(exclude, person) *
        this.ageAffinity(exclude, person) *
        this.genderAffinity(exclude, person);

      const context = this.contextAffinity(exclude, person);
      const degreeWeight = Math.pow(this.friendDegree(person.id) + 1, 0.5);
      const weight = degreeWeight * (0.1 + affinity * (1 + context));

      return { person, affinity, context, weight };
    });

    const total = scored.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * total;

    for (const s of scored) {
      random -= s.weight;
      if (random <= 0) {
        return { person: s.person, affinity: s.affinity, context: s.context };
      }
    }

    const last = scored[scored.length - 1];
    return {
      person: last.person,
      affinity: last.affinity,
      context: last.context,
    };
  }

  private similarityCosine(a: Person, b: Person): number {
    const va = this.vector(a);
    const vb = this.vector(b);

    return Random.cosineSimilarity(va, vb);
  }

  private similarity(a: Person, b: Person): number {
    const va = this.vector(a);
    const vb = this.vector(b);

    const squaredDist = va.reduce((sum, v, i) => sum + (v - vb[i]) ** 2, 0);

    return Math.exp(-squaredDist / (2 * this.sigma * this.sigma));
  }

  private contextAffinity(a: Person, b: Person): number {
    let score: number = 0;

    // Clubs communs
    const clubsA = this.getNeighborsByRelation(a.id, "MEMBER");
    const clubsB = this.getNeighborsByRelation(b.id, "MEMBER");

    const commonClubs = this.intersectionSize(clubsA, clubsB);

    // Entreprise commune
    const enterprisesA = this.getNeighborsByRelation(a.id, "WORK");
    const enterprisesB = this.getNeighborsByRelation(b.id, "WORK");

    const commonEnterprises = this.intersectionSize(enterprisesA, enterprisesB);

    /**
     * 1 - Math.exp(-commonClubs)
     * 0 : 0
     * 1 : 0.63
     * 2 : 0.86
     * 3 : 0.95
     */
    score += 1 - Math.exp(-commonClubs);
    score += 0.32 * (1 - Math.exp(-commonEnterprises));

    /* 1 et 1 : min : 0 max : 1.32 */
    return score;
  }

  public ageAffinity(a: Person, b: Person): number {
    const difference = Math.abs(a.age - b.age);
    return Math.exp(-difference / 15);
  }

  public genderAffinity(a: Person, b: Person): number {
    return a.gender === b.gender ? this.genderAffinityParam : 0.0;
  }

  /**
   * Fermeture Triadique
   * Si deux personnes sont amies avec une même personne, elles ont plus de chances de devenir amies à leur tour
   * @param a
   * @param b
   * @returns
   */
  public triadicScore(a: string, b: string): number {
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

  private getNeighborsByRelation(
    personId: string,
    relation: string,
  ): Set<string> {
    const result = new Set<string>();

    for (const neighbor of this.graph.neighbors(personId)) {
      if (this.graph.getNodeAttribute(neighbor, "relation") === relation) {
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
        relation === "CHILD"
      ) {
        score += 0.6;
      }
    }

    // Clubs communs
    const clubsA = this.getNeighborsByRelation(a, "MEMBER");
    const clubsB = this.getNeighborsByRelation(b, "MEMBER");

    const commonClubs = this.intersectionSize(clubsA, clubsB);

    if (commonClubs > 0) {
      score += 0.35 * (1 - Math.exp(-commonClubs));
    }

    // Entreprise commune
    const enterprisesA = this.getNeighborsByRelation(a, "WORK");
    const enterprisesB = this.getNeighborsByRelation(b, "WORK");

    const commonEnterprises = this.intersectionSize(enterprisesA, enterprisesB);

    if (commonEnterprises > 0) {
      score += 0.35 * (1 - Math.exp(-commonEnterprises));
    }

    return Math.min(score, 1);
  }

  private friendDegree(personId: string): number {
    let count = 0;

    for (const edge of this.graph.edges(personId)) {
      if (this.graph.getEdgeAttribute(edge, "relation") === "FRIENDS") {
        count++;
      }
    }

    return count;
  }
}
