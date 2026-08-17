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
import { WaysRunner } from "./runners/WaysRunner.js";
import { Person } from "./models/Person.js";
import neo4j from "neo4j-driver";

const generateNewData = true;

const graph: MultiDirectedGraph = new MultiDirectedGraph();

const populationRunner = new PopulationRunner(graph);

let population: Person[];

if (generateNewData) {
  populationRunner.load(
    "data/demography/age-pyramid-guyane.json",
    "data/demography/prenoms.json",
    "data/demography/noms.csv",
  );
  population = populationRunner.run(2254, 0, 85);
} else {
  population = populationRunner.import("./public/population.csv");
}

const familyRunner = new FamilyRunner(graph, population);

if (generateNewData) {
  familyRunner.run();
  // Retirer les enfants sans mère, ni père.
  population = population.filter(
    (p) => p.age >= 18 || p.mother != null || p.father != null,
  );
} else {
  familyRunner.import("./public/marriage.csv");
}

const addressRunner = new AddressRunner(graph, population);
addressRunner.load("data/voies.json", "data/geo/adresses.csv");
addressRunner.run();

const workRunner = new WorkRunner(graph, population);
workRunner.run();

const educationRunner = new EducationRunner(graph, population);
educationRunner.run();

const membershipRunner = new MembershipRunner(graph, population);
membershipRunner.load("data/clubs.json");
membershipRunner.run();

const librariesRunner = new LibrariesRunner(
  graph,
  population.filter((p) => p.age >= 18),
);
librariesRunner.load(
  "data/serie.csv",
  "data/books.csv",
  "data/libraries.json",
  "data/awards.csv",
  "data/awardseditions.csv",
);
librariesRunner.run(2000);

const friendshipRunner = new FriendshipRunner(
  graph,
  population,
  membershipRunner.clubs,
);
friendshipRunner.run(1000);

/*
const waysRunner = new WaysRunner(graph);
waysRunner.load("data/geo/points.csv", "data/geo/routes.csv");
waysRunner.run();
*/

/* Export */

writeFileSync(
  "./public/relationships.json",
  JSON.stringify(graph.export(), null, 2),
);

if (generateNewData) {
  populationRunner.export("./public/population.csv");
  familyRunner.export("./public/marriage.csv", "./public/children.csv");
  librariesRunner.export();
  friendshipRunner.export("./public/friends.csv");
  educationRunner.export("./public/etablissement.csv");
}

/*
const driver = neo4j.driver(
  "bolt://host.docker.internal:7687",
  neo4j.auth.basic("neo4j", "supermotdepasse")
);

const session = driver.session();

//try {
  for (const nodeId of graph.nodes()) {
    const attributes = graph.getNodeAttributes(nodeId);

    await session.run(
      `
      MERGE (p:Person {id: $id})
      SET p += $attributes
      `,
      {
        id: nodeId,
        attributes: attributes
      }
    );
  }



//} finally {
  await session.close();
//}
*/
