import { DirectedGraph } from "graphology";
import { Person } from "../models/Person.js";
import type {
  Etablissement,
  EtablissementGrade,
  Grade,
} from "../models/Education.js";
import { EducationGenerator } from "../generators/EducationGenerator.js";
import { Geo } from "../utilities/Geo.js";

export class EducationRunner {
  private grades: Grade[];
  private etablissements: Etablissement[];

  constructor(
    private readonly graph: DirectedGraph,
    private readonly population: Person[],
  ) {
    this.etablissements = [
      {
        id: "E1",
        latitude: 48.74438,
        longitude: -4.01705,
        name: "École du Centre",
      },
      {
        id: "E2",
        latitude: 48.74188,
        longitude: -4.00033,
        name: "École du Phare",
      },
      { id: "E3", latitude: 48.74786, longitude: -4.00872, name: "Collège" },
      { id: "E4", latitude: 48.74786, longitude: -4.00872, name: "Lycée" },
      { id: "E5", latitude: 48.74906, longitude: -4.02761, name: "Université" },
    ];

    this.grades = [
      {
        niveau: "CP",
        age: 6,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[0], classes: [] },
          { etablissement: this.etablissements[1], classes: [] },
        ],
      },
      {
        niveau: "CE1",
        age: 7,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[0], classes: [] },
          { etablissement: this.etablissements[1], classes: [] },
        ],
      },
      {
        niveau: "CE2",
        age: 8,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[0], classes: [] },
          { etablissement: this.etablissements[1], classes: [] },
        ],
      },
      {
        niveau: "CM1",
        age: 9,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[0], classes: [] },
          { etablissement: this.etablissements[1], classes: [] },
        ],
      },
      {
        niveau: "CM2",
        age: 10,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[0], classes: [] },
          { etablissement: this.etablissements[1], classes: [] },
        ],
      },
      {
        niveau: "6e",
        age: 11,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[2], classes: [] },
        ],
      },
      {
        niveau: "5e",
        age: 12,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.98 },
          { ageOffset: 1, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[2], classes: [] },
        ],
      },
      {
        niveau: "4e",
        age: 13,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.97 },
          { ageOffset: 1, probability: 0.03 },
        ],
        etablissements: [
          { etablissement: this.etablissements[2], classes: [] },
        ],
      },
      {
        niveau: "3e",
        age: 14,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.96 },
          { ageOffset: 1, probability: 0.04 },
        ],
        etablissements: [
          { etablissement: this.etablissements[2], classes: [] },
        ],
      },
      {
        niveau: "2nd",
        age: 15,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.95 },
          { ageOffset: 1, probability: 0.04 },
          { ageOffset: 2, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[3], classes: [] },
        ],
      },
      {
        niveau: "1ere",
        age: 16,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.94 },
          { ageOffset: 1, probability: 0.04 },
          { ageOffset: 2, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[3], classes: [] },
        ],
      },
      {
        niveau: "T",
        age: 17,
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.9 },
          { ageOffset: 1, probability: 0.06 },
          { ageOffset: 2, probability: 0.03 },
          { ageOffset: 3, probability: 0.01 },
        ],
        etablissements: [
          { etablissement: this.etablissements[3], classes: [] },
        ],
      },
      {
        niveau: "BUT 1",
        age: 18,
        tailleCible: 35,
        tailleMax: 40,
        ageDistribution: [
          { ageOffset: 0, probability: 0.88 },
          { ageOffset: 1, probability: 0.05 },
          { ageOffset: 2, probability: 0.03 },
          { ageOffset: 3, probability: 0.02 },
          { ageOffset: 4, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[4], classes: [] },
        ],
      },
      {
        niveau: "BUT 2",
        age: 19,
        tailleCible: 30,
        tailleMax: 40,
        ageDistribution: [
          { ageOffset: 0, probability: 0.88 },
          { ageOffset: 1, probability: 0.05 },
          { ageOffset: 2, probability: 0.03 },
          { ageOffset: 3, probability: 0.02 },
          { ageOffset: 4, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[4], classes: [] },
        ],
      },
      {
        niveau: "BUT 3",
        age: 20,
        tailleCible: 30,
        tailleMax: 40,
        ageDistribution: [
          { ageOffset: 0, probability: 0.86 },
          { ageOffset: 1, probability: 0.06 },
          { ageOffset: 2, probability: 0.03 },
          { ageOffset: 3, probability: 0.03 },
          { ageOffset: 4, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[4], classes: [] },
        ],
      },
      {
        niveau: "Master 1",
        age: 21,
        tailleCible: 16,
        tailleMax: 22,
        ageDistribution: [
          { ageOffset: 0, probability: 0.82 },
          { ageOffset: 1, probability: 0.07 },
          { ageOffset: 2, probability: 0.05 },
          { ageOffset: 3, probability: 0.04 },
          { ageOffset: 4, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[4], classes: [] },
        ],
      },
      {
        niveau: "Master 2",
        age: 22,
        tailleCible: 16,
        tailleMax: 22,
        ageDistribution: [
          { ageOffset: 0, probability: 0.8 },
          { ageOffset: 1, probability: 0.08 },
          { ageOffset: 2, probability: 0.06 },
          { ageOffset: 3, probability: 0.04 },
          { ageOffset: 4, probability: 0.02 },
        ],
        etablissements: [
          { etablissement: this.etablissements[4], classes: [] },
        ],
      },
    ];
  }

  public run(): void {
    console.log(`----------------------------------------
Education
----------------------------------------`);

    this.addNodesEtablissements();

    const educationGenerator = new EducationGenerator(
      this.population,
      this.grades,
    );
    educationGenerator.generateAll();

    let index = 1;
    for (let grade of this.grades) {
      console.log(`Niveau ${grade.niveau}`);

      for (let e of grade.etablissements) {
        let indexClasse = 1;
        console.log(`${e.etablissement.name} : ${e.classes.length} classes`);
        for (let classe of e.classes) {
          this.addNodeClasse(classe, e, index++, grade);
          console.log(`Classe ${indexClasse++} : ${classe.length} élèves`);
        }
      }
    }
  }

  addNodesEtablissements() {
    for (const etablissement of this.etablissements) {
      this.addNodeEtablissement(etablissement);
    }
  }

  addNodeEtablissement(etablissement: Etablissement) {
    const { x, y } = Geo.coordToGraph(
      etablissement.latitude,
      etablissement.longitude,
    );
    this.graph.addNode(etablissement.id, {
      category: "Etablissement",
      name: etablissement.name,
      label: etablissement.name,
      x,
      y,
      color: "#ffd035",
    });
  }

  addNodeClasse(
    classe: Person[],
    etablissement: EtablissementGrade,
    index: number,
    grade: Grade,
  ) {
    this.graph.addNode(`class-${index}`, {
      category: "Classe",
      name: grade.niveau,
      label: grade.niveau,
      color: "#508415",
    });

    this.graph.addEdge(`${etablissement.etablissement.id}`, `class-${index}`, {
      relation: "ZZ",
      weight: 1,
    });

    for (const p of classe) {
      this.graph.addEdge(
        `class-${index}`,
        p.id,
        {
          relation: "YY",
          weight: 1,
        },
      );
    }
  }
}
