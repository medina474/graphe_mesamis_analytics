import { Address } from "./Address.js";
import { Club } from "./Club.js";
import { Book, Loan } from "./Book.js";
import { Enterprise } from "./Enterprise.js";

export enum Gender {
  Male = "M",
  Female = "F",
  Unknown = "X",
}

export enum Education {
  None,
  CAP,
  Bac,
  Superior,
}

export enum Wealth {
  Low,
  Medium,
  High,
  VeryHigh,
}

export class Person {

  firstname: string = "";
  lastname: string = "";

  gender: Gender = Gender.Unknown;

  age: number = 0;

  education: Education = Education.None;
  wealth: Wealth = Wealth.Low;

  music: number = 0;
  reading: number = 0;
  sport: number = 0;

  reading_seed = 0;
  wealth_seed = 0;

  books: Book[] = [];
  emprunts: Loan[] = [];
  availableAt: Date;
  oeuvresLues: Set<Book>;
  interestTags: Record<string, number>;
  series: Record<string, number>;

  friendsCount: number = 0;

  // Famille
  spouse?: Person;
  father?: Person;
  mother?: Person;
  children: Person[] = [];
  cousins: Person[] = [];

  address?: Address;
  work?: Enterprise;

  clubs: Club[] = [];
  tags: Set<string>; /* tag pour les type de clubs auxquels la personne est déja membre */

  constructor(public readonly id: string) {
    this.tags = new Set<string>();
    this.interestTags = {};
    this.availableAt = new Date()
    this.oeuvresLues = new Set<Book>;
    this.series = {};
  }

  public isMarried(): boolean {
    return this.spouse != null
  }

  public isChild(): boolean {
    return this.mother != null
  }
}
