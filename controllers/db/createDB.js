const sqlite = require('sqlite');
let db;

function createTableImg() {
    let sqlQuery = 'CREATE TABLE if not exists images (image_id TEXT NOT NULL, source TEXT, tags TEXT, date INTEGER, downloads INTEGER, approved BOOLEAN)';
    return db.run(sqlQuery);
}

function createTableReports() {
    let sqlQuery = 'CREATE TABLE if not exists reports (id INTEGER PRIMARY KEY, report TEXT, image_id TEXT, date INTEGER)';
    return db.run(sqlQuery);
}

async function main() {
    db = await sqlite.open('data/database.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    await createTableImg();
    await createTableReports();

    await db.close().catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });
}

module.exports = main;