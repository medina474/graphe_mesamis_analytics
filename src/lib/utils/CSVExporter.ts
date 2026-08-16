import { writeFileSync } from "node:fs";
import { stringify } from "csv/sync";

export function exportObjectsToCsv(path: string, objects: any[], columns?: string[]) {
  if (!objects || objects.length === 0) {
    writeFileSync(path, "");
    return;
  }

  const keys = columns ?? Array.from(
    objects.reduce((set, obj) => {
      Object.keys(obj).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const rows: any[] = [keys];

  for (const obj of objects) {
    rows.push(
      keys.map((k) => {
        const v = obj[k];
        if (v === undefined || v === null) return "";
        if (v instanceof Date) return v.toISOString();
        if (typeof v === "object") {
          try {
            return JSON.stringify(v);
          } catch {
            return String(v);
          }
        }
        return String(v);
      })
    );
  }

  const csv = stringify(rows);
  writeFileSync(path, csv);
}
