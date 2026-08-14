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

export interface Grade {
  niveau: string;
  age: number;

  tailleCible: number;
  tailleMax: number;

  ageDistribution: AgeDistribution[];
  etablissements: Etablissement[];
}
