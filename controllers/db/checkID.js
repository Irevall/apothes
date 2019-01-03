const sqlite = require('sqlite');
let db;

async function main(id) {
    db = await sqlite.open('database/generic.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    const result = await db.get('SELECT * FROM images WHERE image_id = ?', [id]).catch((err) => {
        return {status: 500, message: 'Database error.'};
    });

    await db.close().catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });

    return result === undefined;
}

module.exports = main;