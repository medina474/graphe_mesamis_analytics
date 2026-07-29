import * as duckdb from "@duckdb/duckdb-wasm";
import { db, connection } from "./duckdb";

export async function importCsv(file: File) {
  await db.registerFileHandle(
    "individus.csv",
    file,
    duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
    false
  );

  await connection.query(`
    CREATE OR REPLACE TABLE individus AS
    SELECT *
    FROM read_csv_auto(
      'individus.csv',
      HEADER=true
    );
  `);
}
