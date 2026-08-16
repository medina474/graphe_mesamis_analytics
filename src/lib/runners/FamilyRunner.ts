import { DirectedGraph } from "graphology";
import { FamilyGenerator } from "../generators/FamilyGenerator.js";
import { Person, Gender } from "../models/Person.js";
import { exportObjectsToCsv } from "../utilities/CSVExporter.js";

export class FamilyRunner {
  constructor(
    private readonly graph: DirectedGraph,
    private population: Person[],
  ) {}

  public run(): void {
    const familyGenerator = new FamilyGenerator(this.graph, this.population);

    familyGenerator.generate();
  }

  public export(pathMarriage: string,pathMother: string,pathFather: string): void {
    exportObjectsToCsv(
      pathMarriage,
      this.population
        .filter((p) => p.spouse != null && p.gender == Gender.Female)
        .map((p) => ({
          id1: p.id,
          id2: p.spouse!.id,
        })),
    );

    exportObjectsToCsv(
      pathMother,
      this.population
        .filter((p) => p.mother != null)
        .map((p) => ({
          id: p.id,
          mother: p.mother!.id,
        })),
    );

    exportObjectsToCsv(
      pathFather,
      this.population
        .filter((p) => p.father != null)
        .map((p) => ({
          id: p.id,
          mother: p.father!.id,
        })),
    );
  }
}
