const sqlite = require('sqlite');

async function main() {
    let db;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            throw(err);
        });

        await db.run('CREATE TABLE if not exists images (id TEXT NOT NULL UNIQUE, source TEXT, date INTEGER, downloads INTEGER, approved BOOLEAN)').catch((err) => {
            throw(err);
        });

        await db.run('CREATE TABLE if not exists reports (id INTEGER PRIMARY KEY, text TEXT, image_id TEXT, date INTEGER)').catch((err) => {
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