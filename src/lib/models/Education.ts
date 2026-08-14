import { Person } from "../models/Person.js";

export interface EtablissementGrade {
  etablissement: Etablissement,
  classes: Person[][];
}

export interface Etablissement {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
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
  etablissements: EtablissementGrade[];
}
