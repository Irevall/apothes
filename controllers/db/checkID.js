const sqlite = require('sqlite');
let db;

async function main(id) {
    db = await sqlite.open('data/database.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    const result = await db.get('SELECT * FROM images WHERE image_id = ?', [id]).catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });

    await db.close().catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });

    return true;
    // return result === undefined;
}

module.exports = main;