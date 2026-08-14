import { DirectedGraph } from "graphology";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { Enterprise, Facture } from "../models/Enterprise.js";
import { Person } from "../models/Person.js";

interface Etablissement {
  latitude: number;
  longitude: number;
  classes: Person[][];
}

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
  etablissements: Etablissement[];
}

export class EducationRunner {
  private grades: Grade[];
  private readonly assigned = new Set<string>();

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
          { latitude: 48.74438, longitude: -4.01705, classes: [], },
          { latitude: 48.74188, longitude: -4.00033, classes: [], },
        ]
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
          { ageOffset: 0, probability: 0.90 },
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
          { ageOffset: 0, probability: 0.80 },
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
    console.log(`----------------------------------------`);

    for (let grade of this.grades) {
      const students = this.getStudents(grade);

      const nombreClasses = Math.ceil(
        students.length / grade.tailleCible
      );

      console.log(`Nombre de classes : ${nombreClasses} ${students.length / nombreClasses}`)

      // Répartir le nombre de classes entre les établissements en fonction
      // de la proximité des élèves (les établissements qui attirent le plus
      // d'élèves obtiennent les classes supplémentaires).
      this.assignStudentsToEtablissements(grade, students, nombreClasses);

    }
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (v: number) => (v * Math.PI) / 180;

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private assignStudentsToEtablissements(grade: Grade, students: Person[], nombreClassesParam: number): void {
    const totalStudents = students.length;
    const m = grade.etablissements.length;
    if (m === 0 || totalStudents === 0) return;

    // S'assurer de ne pas dépasser la tailleMax globale
    const minClassesByMax = Math.ceil(totalStudents / grade.tailleMax);
    const nombreClasses = Math.max(nombreClassesParam, minClassesByMax);

    // Pour chaque élève, calculer les distances vers tous les établissements
    type SD = {
      student: Person;
      distances: number[]; // same length as m
      sortedEst: number[]; // indices sorted by distance asc
      nearestDist: number;
    };

    const studentsData: SD[] = students.map((student) => {
      const distances: number[] = [];

      if (!student.address) {
        for (let i = 0; i < m; i++) distances.push(Infinity);
      } else {
        for (let i = 0; i < m; i++) {
          const et = grade.etablissements[i];
          distances.push(this.haversine(student.address.lat, student.address.lon, et.latitude, et.longitude));
        }
      }

      // Sort establishments by distance ascending. For equal distances, break ties randomly
      const sortedEst = distances
        .map((d, i) => ({ d, i }))
        .sort((a, b) => {
          if (a.d === b.d) return Math.random() - 0.5;
          return a.d - b.d;
        })
        .map(x => x.i);

      const nearestDist = Math.min(...distances);

      return { student, distances, sortedEst, nearestDist } as SD;
    });

    // On commence par affecter les élèves les plus éloignés (nearestDist décroissant).
    studentsData.sort((a, b) => {
      // Treat Infinity (no address) as very far but place them last
      const da = a.nearestDist === Infinity ? -1 : a.nearestDist;
      const db = b.nearestDist === Infinity ? -1 : b.nearestDist;
      return db - da;
    });

    // Compter la demande par établissement (nombre d'élèves pour qui c'est le plus proche)
    // Si des établissements sont à égalité pour un élève, choisir l'un au hasard.
    const nearestCounts = new Array(m).fill(0);
    for (const sd of studentsData) {
      const min = Math.min(...sd.distances);
      if (min === Infinity) continue; // pas d'adresse
      const tied = sd.distances
        .map((d, i) => ({ d, i }))
        .filter(x => x.d === min)
        .map(x => x.i);
      const chosen = tied[Math.floor(Math.random() * tied.length)];
      nearestCounts[chosen]++;
      // ensure the chosen appears first in sortedEst so class allocation matches demand
      sd.sortedEst = [chosen, ...sd.sortedEst.filter(i => i !== chosen)];
    }

    // Répartir le nombre total de classes entre établissements (base + reste par demande)
    const base = Math.floor(nombreClasses / m);
    let remainder = nombreClasses % m;
    const classCounts = new Array(m).fill(base);

    const indicesSortedByDemand = nearestCounts
      .map((c, i) => ({ c, i }))
      .sort((a, b) => b.c - a.c)
      .map(x => x.i);

    for (const idx of indicesSortedByDemand) {
      if (remainder <= 0) break;
      classCounts[idx]++;
      remainder--;
    }

    // Créer les classes pour chaque établissement
    for (let i = 0; i < m; i++) {
      const nb = classCounts[i];
      grade.etablissements[i].classes = Array.from({ length: nb }, () => [] as Person[]);
    }

    // Fonction utilitaire pour trouver une classe avec place dans un établissement
    const findClassWithSpace = (etIndex: number): number | null => {
      const classes = grade.etablissements[etIndex].classes;
      if (!classes || classes.length === 0) return null;
      let bestIdx = -1;
      let bestSize = Infinity;
      for (let ci = 0; ci < classes.length; ci++) {
        const size = classes[ci].length;
        if (size < grade.tailleMax && size < bestSize) {
          bestSize = size;
          bestIdx = ci;
        }
      }
      return bestIdx === -1 ? null : bestIdx;
    };

    // Parcourir élèves (les plus éloignés d'abord) et tenter d'affecter à l'établissement le plus proche
    for (const sd of studentsData) {
      let assigned = false;
      for (const etIdx of sd.sortedEst) {
        // essayer cet établissement
        const ci = findClassWithSpace(etIdx);
        if (ci !== null) {
          grade.etablissements[etIdx].classes[ci].push(sd.student);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        // fallback: chercher n'importe quelle classe avec place
        outer: for (let ei = 0; ei < m; ei++) {
          const ci = findClassWithSpace(ei);
          if (ci !== null) {
            grade.etablissements[ei].classes[ci].push(sd.student);
            assigned = true;
            break outer;
          }
        }
      }

      if (!assigned) {
        // Si toujours pas assigné (fort improbable), placer dans la plus petite classe globale
        let bestEi = 0, bestCi = 0, bestSize = Infinity;
        for (let ei = 0; ei < m; ei++) {
          const classes = grade.etablissements[ei].classes;
          for (let ci = 0; ci < classes.length; ci++) {
            if (classes[ci].length < bestSize) {
              bestSize = classes[ci].length;
              bestEi = ei;
              bestCi = ci;
            }
          }
        }
        grade.etablissements[bestEi].classes[bestCi].push(sd.student);
      }
    }

    // Logs concis
    for (let i = 0; i < m; i++) {
      const totalInEtab = grade.etablissements[i].classes.reduce((s, c) => s + c.length, 0);
      console.log(`Grade ${grade.niveau} - Etablissement ${i} : ${grade.etablissements[i].classes.length} classes, ${totalInEtab} élèves`);
    }
  }


  /**
   * Sélectionner les élèves de l'âge normal
   * Ajouter quelques élèves plus âgés
   * @param grade
   * @returns Person[]
   */
  private getStudents(grade: Grade): Person[] {
    const students: Person[] = [];

    let targetSize = 0;

    for (const distribution of grade.ageDistribution) {
      const age = grade.age + distribution.ageOffset;

      const candidates = this.population.filter(
        (person) => person.age === age && !this.assigned.has(person.id),
      );

      let selected;

      if (distribution.ageOffset == 0) {
        targetSize = candidates.length / distribution.probability;
        selected = candidates;
      } else {
        const expectedCount = Math.round(targetSize * distribution.probability);
        selected = candidates
          .sort(() => Math.random() - 0.5)
          .slice(0, expectedCount);
      }

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
