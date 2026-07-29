export async function genres(db) {
    return db.query(`
        SELECT
            gender AS name,
            COUNT(*) AS value
        FROM individus
        GROUP BY gender;
    `);
}
