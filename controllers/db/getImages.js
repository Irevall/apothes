const sqlite = require('sqlite');

async function main() {
    let db, response;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            throw(err);
        });

        response = await db.all(`SELECT * FROM images WHERE approved=1 ORDER BY date DESC`).catch((err) => {
            // const response = await db.all(`SELECT * FROM images ORDER BY date DESC`).catch((err) => {
            throw(err);
        });
    } catch(err) {
        console.log(err);
        return false;
    } finally {
        await db.close().catch((err) => {
            console.log(err);
        });
    }
    return response;
}

module.exports = main;