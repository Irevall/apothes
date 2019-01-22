const sqlite = require('sqlite');

async function main(id) {
    let db, result;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            throw(err);
        });

        result = await db.get('SELECT * FROM images WHERE id = ?', [id]).catch((err) => {
            throw(err);
        });
    } catch(err) {
        console.log(err);
        return null;
    } finally {
        await db.close().catch((err) => {
            console.log(err);
        });
    }
    return result === undefined;
}

module.exports = main;