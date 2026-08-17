import * as fs from "fs";
import { parse } from "csv/sync";

import { DirectedGraph } from "graphology";
import { FamilyGenerator } from "../generators/FamilyGenerator.js";
import { Person, Gender } from "../models/Person.js";
import { exportObjectsToCsv } from "../utilities/CSVExporter.js";
import { ChildProcess } from "child_process";

interface Marriage {
  wife: string;
  husband: string;
}

interface Child {
  child: string;
  parent: string;
}

export class FamilyRunner {
  constructor(
    private readonly graph: DirectedGraph,
    private population: Person[],
  ) {}

  public run(): void {
    const familyGenerator = new FamilyGenerator(this.graph, this.population);

    familyGenerator.generate();
  }

  public export(
    pathMarriage: string,
    pathMother: string,
  ): void {
    exportObjectsToCsv(
      pathMarriage,
      this.population
        .filter((p) => p.spouse != null && p.gender == Gender.Female)
        .map((p) => ({
          id1: p.id,
          id2: p.spouse!.id,
        })),
    );

    const children: Child[] = [];
    for (const p of this.population) {
      if (p.mother) {
        children.push({ child: p.id, parent: p.mother.id });
      }
      if (p.father) {
        children.push({ child: p.id, parent: p.father.id });
      }
    }

    exportObjectsToCsv(
      pathMother,
      children.map((p) => ({
        id: p.child,
        parent: p.parent,
      })),
    );
  }

  public import(path: string) {
    const contenu = fs.readFileSync(path, "utf-8");

    const records = parse(contenu, {
      columns: true,
      skip_empty_lines: true,
    }) as Marriage[];

    for (const record of records) {
      this.addEdgeMarriage(
        this.population.find((p) => p.id == record.wife)!,
        this.population.find((p) => p.id == record.husband)!,
      );
    }

    const records2 = parse(contenu, {
      columns: true,
      skip_empty_lines: true,
    }) as Child[];

    for (const record of records2) {
      this.addEdgeChild(
        this.population.find((p) => p.id == record.child)!,
        this.population.find((p) => p.id == record.parent)!,
      );
    }
  }

  private addEdgeMarriage(femme: Person, epoux: Person) {
    this.graph.addEdge(femme.id, epoux.id, {
      relation: "marriage",
      size: 0.5,
    });
  }

  private addEdgeChild(femme: Person, epoux: Person) {
    this.graph.addEdge(femme.id, epoux.id, {
      relation: "CHILD",
      size: 0.5,
    });
  }
}
