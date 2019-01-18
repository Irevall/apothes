const fs = require('fs').promises;
const sqlite = require('sqlite');

async function main(id) {
    let db;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            console.log(err);
            throw('Database connection error.');
        });

        await db.all(`DELETE FROM images WHERE id=?`, id).catch((err) => {
            console.log(err);
            throw('Database error. Couldn\'t delete entry.');
        });

        await fs.unlink(`./data/images/${id}.png`).catch((err) => {
            console.log(err);
            throw('Database error. Couldn\'t delete file');
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