export async function stats(db) {
    return db.query(`
        SELECT COUNT(*) AS total, AVG(age) as moyenne
          FROM individus;
    `);
}
