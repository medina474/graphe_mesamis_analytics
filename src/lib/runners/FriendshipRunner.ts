import { DirectedGraph } from "graphology";
import { FriendsGenerator } from "../generators/FriendsGenerator.js";
import { Person } from "../models/Person.js";
import { Club } from "../models/Club.js";

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
    let friendsGenerator = new FriendsGenerator(this.graph,
      this.population.filter(p => p.clubs.some(c => c.id == 'club-rugby')));
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(this.graph,
      this.population.filter(p => p.clubs.some(c => c.id == 'club-danse')));
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(this.graph,
      this.population.filter(p => p.clubs.some(c => c.id == 'club-basketball')));
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(this.graph,
    this.population.filter(p => p.clubs.some(c => c.id == 'club-lecture')));
    friendsGenerator.generate(25);

    friendsGenerator = new FriendsGenerator(this.graph,
    this.population.filter(p => p.clubs.some(c => c.id == 'club-golf')));
    friendsGenerator.generate(20);

    friendsGenerator = new FriendsGenerator(this.graph,
    this.population.filter(p => p.clubs.some(c => c.id == 'club-tennis')));
    friendsGenerator.generate(25);

    // Général
    friendsGenerator = new FriendsGenerator(this.graph, this.population);
    friendsGenerator.generate(iterations);

    console.log(`----------------------------------------`);
  }
}
