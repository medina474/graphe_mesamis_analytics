import { writeFileSync } from "node:fs";
import { PopulationRunner } from "./runners/PopulationRunner.js";
import { FamilyRunner } from "./runners/FamilyRunner.js";
import { FriendshipRunner } from "./runners/FriendshipRunner.js";
import { LibrariesRunner } from "./runners/LibrariesRunner.js";
import { MembershipRunner } from "./runners/MembershipRunner.js";
import { WorkRunner } from "./runners/WorkRunner.js";
import { AddressRunner } from "./runners/AddressRunner.js";
import { EducationRunner } from "./runners/EducationRunner.js";
import { MultiDirectedGraph } from "graphology";

const graph: MultiDirectedGraph = new MultiDirectedGraph();

const populationRunner = new PopulationRunner(graph);
populationRunner.load(
  "data/age-pyramid-guyane.json",
  "data/prenoms.json",
  "data/noms.csv",
);
const population = populationRunner.run(2254, 1, 85);

const educationRunner = new EducationRunner(graph, population)
educationRunner.run()
const familyRunner = new FamilyRunner(graph, population);
familyRunner.run();

const workRunner = new WorkRunner(graph, population);
workRunner.run();

const membershipRunner = new MembershipRunner(graph, population);
membershipRunner.load("data/clubs.json");
membershipRunner.run();


const librariesRunner = new LibrariesRunner(graph, population.filter(p => p.age >= 18));
librariesRunner.load("data/serie.csv", "data/books.csv", "data/libraries.json", "data/awards.csv", "data/awardseditions.csv");
librariesRunner.run(2000);

const addressRunner = new AddressRunner(graph, population);
addressRunner.load("data/voies.json", "data/adresses.csv");
addressRunner.run();

const friendshipRunner = new FriendshipRunner(graph, population);
friendshipRunner.run(5000);

writeFileSync(
  "./public/relationships.json",
  JSON.stringify(graph.export(), null, 2)
);
