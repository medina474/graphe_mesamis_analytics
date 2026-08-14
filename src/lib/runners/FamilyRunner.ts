import { DirectedGraph } from "graphology";
import { FamilyGenerator } from "../generators/FamilyGenerator.js";
import { Person } from "../models/Person.js";

export class FamilyRunner {

    constructor(
        private readonly graph: DirectedGraph,
        private population: Person[],
    ) {}

    public run():void {
        const familyGenerator = new FamilyGenerator(
            this.graph,
            this.population
        );

        familyGenerator.generate();

    }
}
