import { Gender, Person, Education, Wealth } from "../models/Person.js";
import type { Grade } from "../models/Education.js";
import { Random } from "../stats/Random.js";

export class EducationGenerator {
  private readonly assigned = new Set<string>();

  constructor(
    private readonly population: Person[],
    private readonly grades: Grade[],
  ) {}

  public generate(grade: Grade) {
    const students = this.getStudents(grade);

    const nombreClasses = Math.ceil(students.length / grade.tailleCible);

    console.log(
      `Nombre de classes : ${nombreClasses} ${students.length / nombreClasses}`,
    );

    // Répartir le nombre de classes entre les établissements en fonction
    // de la proximité des élèves (les établissements qui attirent le plus
    // d'élèves obtiennent les classes supplémentaires).
    this.assignStudentsToEtablissements(grade, students, nombreClasses);
  }

  public generateAll() {
    for (let grade of this.grades) {
      this.generate(grade);
    }
  }

  private assignStudentsToEtablissements(
    grade: Grade,
    students: Person[],
    nombreClassesParam: number,
  ): void {
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
          distances.push(
            this.haversine(
              student.address.lat,
              student.address.lon,
              et.latitude,
              et.longitude,
            ),
          );
        }
      }

      // Sort establishments by distance ascending. For equal distances, break ties randomly
      const sortedEst = distances
        .map((d, i) => ({ d, i }))
        .sort((a, b) => {
          if (a.d === b.d) return Math.random() - 0.5;
          return a.d - b.d;
        })
        .map((x) => x.i);

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
        .filter((x) => x.d === min)
        .map((x) => x.i);
      const chosen = tied[Math.floor(Math.random() * tied.length)];
      nearestCounts[chosen]++;
      // ensure the chosen appears first in sortedEst so class allocation matches demand
      sd.sortedEst = [chosen, ...sd.sortedEst.filter((i) => i !== chosen)];
    }

    // Répartir le nombre total de classes entre établissements (base + reste par demande)
    const base = Math.floor(nombreClasses / m);
    let remainder = nombreClasses % m;
    const classCounts = new Array(m).fill(base);

    const indicesSortedByDemand = nearestCounts
      .map((c, i) => ({ c, i }))
      .sort((a, b) => b.c - a.c)
      .map((x) => x.i);

    for (const idx of indicesSortedByDemand) {
      if (remainder <= 0) break;
      classCounts[idx]++;
      remainder--;
    }

    // Créer les classes pour chaque établissement
    for (let i = 0; i < m; i++) {
      const nb = classCounts[i];
      grade.etablissements[i].classes = Array.from(
        { length: nb },
        () => [] as Person[],
      );
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
        let bestEi = 0,
          bestCi = 0,
          bestSize = Infinity;
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

  private haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (v: number) => (v * Math.PI) / 180;

    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
