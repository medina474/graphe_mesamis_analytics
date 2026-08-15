import { DirectedGraph } from "graphology";
import { Point, Route } from "../models/Geo.js";
import { PointsLoader } from "../loaders/PointsLoader.js";
import { RoutesLoader } from "../loaders/RoutesLoader.js";
import { Geo } from "../utilities/Geo.js";

export class WaysRunner {
  private points: Point[] = [];
  private routes: Route[] = [];

  constructor(private readonly graph: DirectedGraph) {}

  public load(pointsPath: string, routesPath: string) {
    this.points = PointsLoader.load(pointsPath);
    this.routes = RoutesLoader.load(routesPath);
  }

  public run(): void {
    this.addPoints();
    this.addRoutes();
  }

  addPoints() {
    for (const point of this.points) {
      this.addPoint(point);
    }
  }

  addPoint(point: Point): void {
    const { x, y } = Geo.coordToGraph(point.latitude, point.longitude);

    this.graph.addNode(point.id, {
      category: "Point",
      label: point.nom,
      x_geo: x,
      y_geo: y,
      color: "#ff3535",
    });
  }

  addRoutes() {
    for (const route of this.routes) {
      this.addRoute(route);
    }
  }

  addRoute(route: Route): void {
    if (route.directCost != -1) {
      this.graph.addEdge(route.source, route.target, {
        relation: "ROUTE",
        weight: route.directCost,
      });
    }

    if (route.inverseCost != -1) {
      this.graph.addEdge(route.target, route.source, {
        relation: "ROUTE",
        tag: route.tag,
        weight: route.inverseCost,
      });
    }
  }
}
