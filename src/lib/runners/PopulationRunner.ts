import * as fs from "fs";
import { parse } from "csv/sync";

import { DirectedGraph } from "graphology";
import { PersonGenerator } from "../generators/PersonGenerator.js";
import { Person, Gender } from "../models/Person.js";

import { FirstnameStat } from "../models/PersonStat.js";
import { LastnameStat } from "../models/PersonStat.js";

import { AgePyramidStat } from "../models/AgePyramidStat.js";

import { AgePyramidLoader } from "../loaders/AgePyramidLoader.js";
import { FirstnameLoader } from "../loaders/FirstnameLoader.js";
import { LastnameLoader } from "../loaders/LastnameLoader.js";

import { exportObjectsToCsv } from "../utilities/CSVExporter.js";

/**
 * Crée une population d'individus
 */
export class PopulationRunner {
  private pyramid: AgePyramidStat;
  private firstnames: FirstnameStat[] = [];
  private lastnames: LastnameStat[] = [];
  private population: Person[] = [];

  constructor(private readonly graph: DirectedGraph) {
    this.pyramid = new AgePyramidStat([]);
  }

  public load(
    pyramidStatPath: string,
    firstnameStatPath: string,
    lastnameStatPath: string,
  ) {
    this.pyramid = AgePyramidLoader.load(pyramidStatPath);
    this.firstnames = FirstnameLoader.load(firstnameStatPath);
    this.lastnames = LastnameLoader.load(lastnameStatPath);
  }

  public run(
    nb: number,
    minAge: number,
    maxAge = Number.MAX_SAFE_INTEGER,
  ): Person[] {
    console.log(`----------------------------------------
Population
----------------------------------------`);

    if (this.firstnames.length == 0 || this.lastnames.length == 0) {
      return [];
    }

    const generator = new PersonGenerator(
      this.pyramid,
      this.firstnames,
      this.lastnames,
      minAge,
      maxAge,
    );

    this.population = generator.generateMany(nb);

    this.addNodesPersons();

    return this.population;
  }

  public import(path: string) {
    const contenu = fs.readFileSync(path, "utf-8");

    const records = parse(contenu, {
      columns: true,
      skip_empty_lines: true,
    }) as Person[];

    const population = records.map((r: Person) => {
      const p = new Person(r.id);
      p.firstname = r.firstname;
      p.lastname = r.lastname;
      p.age = r.age;
      p.education = r.education;
      p.wealth = r.wealth;
      p.reading = r.reading;
      p.sport = r.sport;
      p.music = r.music;
      p.wealth_seed = r.wealth_seed;
      p.reading_seed = r.reading_seed;
      return p;
    });

    this.addNodesPersons();
    return population;
  }

  public export(path: string) {
    exportObjectsToCsv(
      path,
      this.population.map((p) => ({
        id: p.id,
        firstname: p.firstname,
        lastname: p.lastname,
        gender: p.gender,
        age: p.age,
        education: p.education,
        wealth: p.wealth,
        music: p.music,
        reading: p.reading,
        sport: p.sport,
        wealth_seed: p.wealth_seed,
        reading_seed: p.reading_seed,
        friendsCount: p.friendsCount,
      })),
    );
  }

  addNodePerson(person: Person): void {
    this.graph.addNode(person.id, {
      category: "Person",
      firstname: person.firstname,
      lastname: person.lastname,
      genre: person.gender,
      age: person.age,
      sport: person.sport,
      reading: person.reading,
      music: person.music,
      education: person.education,
      wealth: person.wealth,
      label: `${person.firstname} ${person.lastname} (${person.age})`,
      color: person.gender === Gender.Male ? "#4A90E2" : "#FF69B4",
    });
  }

  private addNodesPersons(): void {
    for (const person of this.population) {
      this.addNodePerson(person);
    }
  }
}
