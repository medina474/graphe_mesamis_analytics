import { DirectedGraph } from "graphology";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { Enterprise, Facture } from "../models/Enterprise.js";
import { Person } from "../models/Person.js";

interface AgeDistribution {
  ageOffset: number;
  probability: number;
}

interface Grade {
  niveau: string;
  age: number;

  tailleCible: number;
  tailleMax: number;

  ageDistribution: AgeDistribution[];

  classes: Person[][];
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
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "CE1",
        age: 7,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "CE2",
        age: 8,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: []
      },
      {
        niveau: "CM1",
        age: 9,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "CM2",
        age: 10,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "6e",
        age: 11,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "5e",
        age: 12,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "4e",
        age: 13,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "3e",
        age: 14,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "2nd",
        age: 15,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "1ere",
        age: 16,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "T",
        age: 17,
        tailleCible: 24,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "BUT 1",
        age: 18,
        tailleCible: 35,
        tailleMax: 40,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "BUT 2",
        age: 19,
        tailleCible: 30,
        tailleMax: 35,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "BUT 3",
        age: 20,
        tailleCible: 30,
        tailleMax: 35,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
        classes: [],
      },
      {
        niveau: "Master 1",
        age: 21,
        tailleCible: 18,
        tailleMax: 30,
        classes: [],
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
        ],
      },
      {
        niveau: "Master 2",
        age: 22,
        tailleCible: 18,
        tailleMax: 30,
        ageDistribution: [
          { ageOffset: 0, probability: 0.99 },
          { ageOffset: 1, probability: 0.01 },
          { ageOffset: 2, probability: 0.01 },
          { ageOffset: 3, probability: 0.01 },
          { ageOffset: 4, probability: 0.01 },
        ],
        classes: [],
      },
    ];
  }

  public run(): void {
    console.log(`----------------------------------------`);

    for (let grade of this.grades) {
      const students = this.population.filter((p) => p.age == grade.age);

      const nombreClasses = Math.ceil(
        students.length / grade.tailleCible
      );

      for (let c = 0; c < nombreClasses; c++) {
        grade.classes[c] = [];
        grade.classes[c].push(...students.splice(0, 30));
      }
    }
  }

  private getStudents(grade: Grade): Person[] {
    const students: Person[] = [];

    const targetSize = grade.tailleCible * grade.tailleMax;

    for (const distribution of grade.ageDistribution) {
      const age = grade.age + distribution.ageOffset;

      const candidates = this.population.filter(
        (person) => person.age === age && !this.assigned.has(person.id),
      );

      const expectedCount = Math.round(targetSize * distribution.probability);

      const selected = candidates
        .sort(() => Math.random() - 0.5)
        .slice(0, expectedCount);

      students.push(...selected);

      for (const student of selected) {
        this.assigned.add(student.id);
      }
    }

    return students;
  }

  private createClasses(grade: Grade, students: Person[]): void {
    grade.classes = Array.from({ length: grade.tailleCible }, () => []);

    students
      .sort(() => Math.random() - 0.5)
      .forEach((student, index) => {
        const classIndex = index % grade.tailleCible;

        grade.classes[classIndex].push(student);
      });
  }
}
