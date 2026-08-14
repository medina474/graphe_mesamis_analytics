import { DirectedGraph } from "graphology";
import { AddressGenerator } from "../generators/AddressGenerator.js";
import { Address, Voie } from "../models/Address.js";
import { JsonLoader } from "../loaders/JsonLoader.js";
import { AddressLoader } from "../loaders/AddressLoader.js";
import { Person } from "../models/Person.js";
import { Random } from "../utilities/Random.js";
import { Geo } from "../utilities/Geo.js";

export class AddressRunner {
  private voies: Voie[] = [];
  private addresses: Address[] = [];

  constructor(
    private readonly graph: DirectedGraph,
    private readonly population: Person[],
  ) {}

  public load(voiePath: string, addressPath: string) {
    this.voies = JsonLoader.load(voiePath, Voie);
    this.addVoies(this.voies);

    this.addresses = AddressLoader.load(addressPath, this.voies);
    this.addAddresses(this.addresses);
  }

  public run(): void {
    const addressGenerator = new AddressGenerator(this.graph, this.addresses);
    addressGenerator.generateAll(this.population);

    for (const p of this.population) {
      if (p.address) {
        this.graph.addEdge(p.id, p.address.id, {
          relation: "LIVE",
          weight: 1,
        });

        // 20 mètres autour
        const { x, y } = Geo.coordToGraph(p.address.lat, p.address.lon);
        const position = Random.around(x, y, 0.1);

        this.graph.mergeNodeAttributes(p.id, {
          x_geo: position.x,
          y_geo: position.y,
        });
      }
    }
  }


  addVoies(voies: Voie[]) {
    for (const voie of voies) {
      this.addVoie(voie);
    }
  }

  addVoie(voie: Voie): void {
    this.graph.addNode(voie.id, {
      category: "Way",
      label: voie.voie,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1,
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
