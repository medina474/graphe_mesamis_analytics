import { DirectedGraph } from "graphology";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { Person } from "../models/Person.js";
import { Club } from "../models/Club.js";
import { ClubMembershipGenerator } from "../generators/ClubMembershipGenerator.js";

export class MembershipRunner {
  public clubs: Club[] = [];

  constructor(
    private readonly graph: DirectedGraph,
    private readonly population: Person[],
  ) {}

  /**
   * Charge la liste des clubs depuis un fichier json.
   * Ajoute les clubs au graphe.
   * @param clubsPath
   */
  public load(clubsPath: string) {
    this.clubs = JsonLoader.load(clubsPath, Club);
    this.addClubs(this.clubs);
  }

  public run(): void {
    console.log(`----------------------------------------
Clubs
----------------------------------------`);

    const clubMembershipGenerator = new ClubMembershipGenerator(
      this.graph,
      this.population,
      this.clubs,
    );

    clubMembershipGenerator.generateAll();

    let count = 0;
    for (const person of this.population) {
      if (person.clubs.length > 0) {
        count++;
      }
    }
    console.log(`${count} ${this.population.length}`);
  }

  addClubs(clubs: Club[]): void {
    for (const club of clubs) {
      this.addClub(club);
    }
  }

  addClub(club: Club): void {
    this.graph.addNode(club.id, {
      category: "club",
      name: club.name,
      label: club.name,
      color: "#82ff69",
    });
  }
}
