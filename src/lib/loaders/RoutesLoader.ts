import * as fs from "fs";
import { parse } from "csv/sync";

import { Route } from "../models/Geo.js";

interface Record {
  id: number;
  source: number;
  target: number;
  tag: string;
  directCost: number;
  inverseCost: number;
}

export class RoutesLoader {
  static load(path: string): Route[] {
    const contenu = fs.readFileSync(path, "utf-8");

    const records = parse(contenu, {
      columns: true,
      skip_empty_lines: true,
    }) as Record[];

    const result: Route[] = [];

    for (const r of records) {
      result.push(
        new Route(`route_${r.id}`, `point_${r.source}`, `point_${r.target}`, r.tag, r.directCost, r.inverseCost),
      );
    }

    return result;
  }
}
