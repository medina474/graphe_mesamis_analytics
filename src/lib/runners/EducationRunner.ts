import { DirectedGraph } from "graphology";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { Enterprise, Facture } from "../models/Enterprise.js";
import { Person } from "../models/Person.js";

interface Grade {
  niveau: string;
  age: number;
  classe: number;
  tailleMax: number;
  classes: Person[][];
  ageDistribution: any;
}

export class EducationRunner {
  private grades: Grade[];

  constructor(
    private readonly graph: DirectedGraph,
    private readonly population: Person[],
  ) {
    this.grades = [
      {
        niveau: "CP",
        age: 6,
        tailleMax: 30,
        classe: 2,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "CE1",
        age: 7,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "CE2",
        age: 8,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "CM1",
        age: 9,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "CM2",
        age: 10,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "6e",
        age: 11,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "5e",
        age: 12,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "4e",
        age: 13,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "3e",
        age: 14,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "2nd",
        age: 15,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "1ere",
        age: 16,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "T",
        age: 17,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "BUT 1",
        age: 18,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "BUT 2",
        age: 19,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "BUT 3",
        age: 20,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 2,
      },
      {
        niveau: "Master 1",
        age: 21,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classe: 3,
      },
      {
        niveau: "Master 2",
        age: 22,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
          { ageOffset: 2, probability: 0.01 },
          { ageOffset: 3, probability: 0.01 },
          { ageOffset: 4, probability: 0.01 },
        ],
        classe: 3,
      },
    ];
  }

  public run(): void {
    console.log(`----------------------------------------`);

    for (let grade of this.grades) {
      const eleves = this.population.filter((p) => p.age == grade.age);

      for (let c = 0; c < grade.classe; c++) {
        grade.classes[c] = [];
        grade.classes[c].push(...eleves.splice(0, 30));
      }
    }
  }
}
