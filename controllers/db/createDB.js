const sqlite = require('sqlite');
let db;

function createTableImg() {
    let sqlQuery = 'CREATE TABLE if not exists images (id INTEGER PRIMARY KEY, image_id TEXT NOT NULL, source TEXT, tags TEXT, date INTEGER, downloads INTEGER, approved BOOLEAN)';
    return db.run(sqlQuery);
}

function createTableTag() {
    let sqlQuery = 'CREATE TABLE if not exists tags (id INTEGER PRIMARY KEY, tag TEXT)';
    return db.run(sqlQuery);
}

async function main() {
    db = await sqlite.open('database/generic.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    await createTableImg();
    await createTableTag();

    await db.close().catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });
}

module.exports = main;