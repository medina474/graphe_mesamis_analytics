import { connection } from "./duckdb";

function escapeSqlValue(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "NULL";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  const stringValue = String(value);
  return `'${stringValue.replace(/'/g, "''")}'`;
}

export async function importGraphData(graphData: any) {
  const nodes = Array.isArray(graphData?.nodes) ? graphData.nodes : [];

  const values = nodes
    .filter((node: any) => node?.attributes?.category === "Person")
    .map((node: any) => {
      const attributes = node.attributes ?? {};

      return `(
        ${escapeSqlValue(node.key ?? null)},
        ${escapeSqlValue(attributes.firstname ?? null)},
        ${escapeSqlValue(attributes.lastname ?? null)},
        ${escapeSqlValue(attributes.genre)},
        ${escapeSqlValue(attributes.age ?? null)},
        ${escapeSqlValue(attributes.education ?? 0)},
        ${escapeSqlValue(attributes.wealth ?? 0)},
        ${escapeSqlValue(attributes.reading ?? 0)},
        ${escapeSqlValue(attributes.sport ?? 0)},
        ${escapeSqlValue(attributes.music ?? 0)}
      )`;
    });

  await connection.query(`
    CREATE OR REPLACE TABLE individus (
      id VARCHAR,
      firstname VARCHAR,
      lastname VARCHAR,
      gender VARCHAR,
      age INTEGER,
      education INTEGER,
      wealth DOUBLE,
      reading DOUBLE,
      sport DOUBLE,
      music DOUBLE
    );
  `);

  if (values.length > 0) {
    await connection.query(`INSERT INTO individus VALUES ${values.join(",")} ;`);
  }
}

export async function importBook(graphData: any) {
  const nodes = Array.isArray(graphData?.nodes) ? graphData.nodes : [];

  const values = nodes
    .filter((node: any) => node?.attributes?.category === "book")
    .map((node: any) => {
      const attributes = node.attributes ?? {};

      return `(
        ${escapeSqlValue(node.key ?? null)},
        ${escapeSqlValue(attributes.label ?? null)},
      )`;
    });

  await connection.query(`
    CREATE OR REPLACE TABLE books (
      id VARCHAR,
      title VARCHAR
    );
  `);

  if (values.length > 0) {
    await connection.query(`INSERT INTO books VALUES ${values.join(",")} ;`);
  }
}
