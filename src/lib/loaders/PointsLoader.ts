import * as fs from "fs";
import { parse } from "csv/sync";

import { Point } from "../models/Geo.js";

interface Record {
  id: number;
  nom: string;
  altitude: number;
  longitude: number;
  latitude: number;
}

export class PointsLoader {
  static load(path: string): Point[] {
    const contenu = fs.readFileSync(path, "utf-8");

    const records = parse(contenu, {
      columns: true,
      skip_empty_lines: true,
    }) as Record[];

    const result: Point[] = [];

    for (const r of records) {
      result.push(new Point(`point_${r.id}`, r.nom, r.altitude, r.longitude, r.latitude))
    }

    return result;
  }
}
