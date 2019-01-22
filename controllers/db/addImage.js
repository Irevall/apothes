const sqlite = require('sqlite');

async function main(id, data) {
    let db;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            throw(err);
        });

        let values = {};
        values.id = id;
        values.source = data.source;
        values.date = Date.now();
        values.downloads = 0;
        values.approved = 0;

        await db.run(`INSERT INTO images (id, source, date, downloads, approved) VALUES (${Object.keys(values).map(() => '(?)' ).join(', ')})`, Object.values(values)).catch((err) => {
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
    return true;
}

module.exports = main;