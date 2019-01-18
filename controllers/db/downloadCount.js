const sqlite = require('sqlite');

async function main(id) {
    let db;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            console.log(err);
            throw('Database connection error.');
        });

        await db.run(`UPDATE images SET downloads=downloads+1 WHERE id=?`, id).catch((err) => {
            console.log(err);
            throw('Database error. Couldn\'t update entry.');
        });
    } catch(err) {
        console.log(err);
        return { status: 500, message: err };
    } finally {
        await db.close().catch((err) => {
            console.log(err);
        });
    }
    return { status: 200, message: 'Success!' };
}

module.exports = main;