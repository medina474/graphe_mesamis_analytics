import { DirectedGraph } from "graphology";
import { Person } from "../models/Person.js";
import type { Grade } from "../models/Education.js";
import { EducationGenerator } from "../generators/EducationGenerator.js";

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
        tailleCible: 25,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        etablissements: [
          { latitude: 48.74438, longitude: -4.01705, classes: [] },
          { latitude: 48.74188, longitude: -4.00033, classes: [] },
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
          { latitude: 48.74438, longitude: -4.01705, classes: [] },
          { latitude: 48.74188, longitude: -4.00033, classes: [] },
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
          { latitude: 48.74438, longitude: -4.01705, classes: [] },
          { latitude: 48.74188, longitude: -4.00033, classes: [] },
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
          { latitude: 48.74438, longitude: -4.01705, classes: [] },
          { latitude: 48.74188, longitude: -4.00033, classes: [] },
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
          { latitude: 48.74438, longitude: -4.01705, classes: [] },
          { latitude: 48.74188, longitude: -4.00033, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74786, longitude: -4.00872, classes: [] },
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
          { latitude: 48.74906, longitude: -4.02761, classes: [] },
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
          { latitude: 48.74906, longitude: -4.02761, classes: [] },
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
          { latitude: 48.74906, longitude: -4.02761, classes: [] },
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
          { latitude: 48.74906, longitude: -4.02761, classes: [] },
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
          { latitude: 48.74906, longitude: -4.02761, classes: [] },
        ],
      },
    ];
  }

  public run(): void {
    console.log(`----------------------------------------
Education
----------------------------------------`);

    const educationGenerator = new EducationGenerator(
      this.population,
      this.grades,
    );
    educationGenerator.generateAll();

    for (let grade of this.grades) {
      console.log(`Niveau ${grade.niveau}`)
      let index = 1;
      for (let etablissement of grade.etablissements) {
        let indexClasse = 1
        console.log(`Établissement ${index++} : ${etablissement.classes.length} classes`)
        for (let classe of etablissement.classes) {
          console.log(
            `Classe ${indexClasse++} : ${classe.length} élèves`,
          );
        }
      }
    }
  }

  addNodesEtablissements() {
    for (const etablissement of this.etablissements) {
      this.addNodeEtablissement(etablissement);
    }
  }
}
