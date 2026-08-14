import { DirectedGraph } from "graphology";
import { FriendsGenerator } from "../generators/FriendsGenerator.js";
import { Person } from "../models/Person.js";

export class FriendshipRunner {

    constructor(
        private readonly graph: DirectedGraph,
        private readonly population: Person[],
    ) {
    }

    public run(iterations: number):void {
        console.log(`----------------------------------------`);
        const friendsGenerator = new FriendsGenerator(this.graph, this.population);
        friendsGenerator.generate(iterations);
    }
}
