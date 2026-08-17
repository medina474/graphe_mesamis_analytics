import * as fs from "fs";
import { parse } from "csv/sync";

import { DirectedGraph } from "graphology";
import { FriendsGenerator } from "../generators/FriendsGenerator.js";
import { Person } from "../models/Person.js";
import { Club } from "../models/Club.js";
import { exportObjectsToCsv } from "../utilities/CSVExporter.js";

interface Friends {
  friend1: Person;
  friend2: Person;
  ageAffinity: number;
  genderAffinity: number;
}

interface FriendsCSV {
  friend1: string;
  friend2: string;
  ageAffinity: number;
  genderAffinity: number;
}

export class FriendshipRunner {
  constructor(
    private readonly graph: DirectedGraph,
    private readonly population: Person[],
    private readonly clubs: Club[],
  ) {}

  public run(iterations: number): void {
    console.log(`----------------------------------------
Amitié
----------------------------------------`);

    // Ensemencement
    let friendsGenerator = new FriendsGenerator(
      this.graph,
      this.population.filter((p) => p.clubs.some((c) => c.id == "club-rugby")),
    );
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(
      this.graph,
      this.population.filter((p) => p.clubs.some((c) => c.id == "club-danse")),
    );
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(
      this.graph,
      this.population.filter((p) =>
        p.clubs.some((c) => c.id == "club-basketball"),
      ),
    );
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(
      this.graph,
      this.population.filter((p) =>
        p.clubs.some((c) => c.id == "club-lecture"),
      ),
    );
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(
      this.graph,
      this.population.filter((p) => p.clubs.some((c) => c.id == "club-golf")),
    );
    friendsGenerator.generate(20);

    friendsGenerator = new FriendsGenerator(
      this.graph,
      this.population.filter((p) => p.clubs.some((c) => c.id == "club-tennis")),
    );
    friendsGenerator.generate(25);

    // Général
    friendsGenerator = new FriendsGenerator(this.graph, this.population);
    friendsGenerator.generate(iterations);

    console.log(`----------------------------------------`);
  }

  public import(path: string) {
    const contenu = fs.readFileSync(path, "utf-8");

    const records = parse(contenu, {
      columns: true,
      skip_empty_lines: true,
    }) as FriendsCSV[];

    for (const record of records) {
      this.addEdgeFriend(
        record.friend1,
        record.friend2,
      );
    }
  }

  public export(path: string) {
    const friendsGenerator = new FriendsGenerator(this.graph, this.population);

    const friends: Friends[] = [];

    for (const p of this.population) {
      for (const f of p.friends) {
        friends.push({
          friend1: p,
          friend2: f,
          ageAffinity: friendsGenerator.ageAffinity(f, p),
          genderAffinity: friendsGenerator.genderAffinity(f, p),
        });
      }
    }

    exportObjectsToCsv(
      path,
      friends.map((f) => ({
        friend1: f.friend1.id,
        friend2: f.friend2.id,
        ageAffinity: f.ageAffinity,
        genderAffinity: f.genderAffinity,
      })),
    );
  }

  public addEdgeFriend(id1: string, id2: string) {
    this.graph.addEdge(id1, id2, {
      relation: "FRIEND",
      weight: 1,
    });
  }
}
