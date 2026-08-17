import { DirectedGraph } from "graphology";
import { AddressGenerator } from "../generators/AddressGenerator.js";
import { Address, Voie } from "../models/Address.js";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { AddressLoader } from "../loaders/AddressLoader.js";
import { Person } from "../models/Person.js";
import { Random } from "../utilities/Random.js";
import { Geo } from "../utilities/Geo.js";
import { exportObjectsToCsv } from "../utilities/CSVExporter.js";

export class AddressRunner {
  private voies: Voie[] = [];
  private addresses: Address[] = [];

  constructor(
    private readonly graph: DirectedGraph,
    private readonly population: Person[],
  ) {}

  public load(voiePath: string, addressPath: string) {
    this.voies = JsonLoader.load(voiePath, Voie);
    this.addNodesVoies(this.voies);

    this.addresses = AddressLoader.load(addressPath, this.voies);
    this.addAddresses(this.addresses);
  }

  public run(): void {
    const addressGenerator = new AddressGenerator(this.graph, this.addresses);
    addressGenerator.generateAll(this.population);

    for (const p of this.population) {
      if (p.address) {
        this.addEdgeLive(p);

        // 20 mètres autour
        const { x, y } = Geo.coordToGraph(p.address.lat, p.address.lon);
        const position = Random.circle(x, y, 0.05);

        this.graph.mergeNodeAttributes(p.id, {
          x_geo: position.x,
          y_geo: position.y,
        });
      }
    }
  }

  public export(pathVoies: string, pathAdresses: string) {
    exportObjectsToCsv(
      pathVoies,
      this.voies.map((r) => ({
        id: r.id,
        voie: r.voie,
      })),
    );
    
    exportObjectsToCsv(
      pathAdresses,
      this.population.map((r) => ({
        id: r.id,
        adresse: r.adress.id
      })),
    );
  }

  public import(path: string) {
  }

  addEdgeLive(person: Person) {
    this.graph.addEdge(person.id, person.address!.id, {
      relation: "LIVE",
      weight: 1,
    });
  }

  addNodesVoies(voies: Voie[]) {
    for (const voie of voies) {
      this.addNodeVoie(voie);
    }
  }

  addNodeVoie(voie: Voie): void {
    this.graph.addNode(voie.id, {
      category: "Way",
      label: voie.voie,
      color: "#ff3535",
    });
  }

  addAddresses(addresses: Address[]) {
    for (const address of addresses) {
      this.addAddress(address);
    }
  }

  addAddress(address: Address): void {
    const { x, y } = Geo.coordToGraph(address.lat, address.lon);

    this.graph.addNode(address.id, {
      category: "Address",
      label: address.label,
      x_geo: x,
      y_geo: y,
      size: 1,
      color: "#540303",
    });

    this.graph.addEdge(address.id, address.voie.id, {
      relation: "place",
      weight: 1,
    });
  }
}
