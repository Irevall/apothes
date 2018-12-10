const sqlite = require('sqlite');
const fs = require('fs');
let db;

function createTableImg() {
    let sqlQuery = 'CREATE TABLE if not exists images (id INTEGER PRIMARY KEY, image_id TEXT NOT NULL, author TEXT, description TEXT, tags TEXT, downloads INTEGER)';
    return db.run(sqlQuery);
}

function createTableTag() {
    let sqlQuery = 'CREATE TABLE if not exists tags (id INTEGER PRIMARY KEY, tag TEXT)';
    return db.run(sqlQuery);
}

async function main() {
    if (!fs.existsSync('database')) {
        fs.mkdirSync('database');
    }

    db = await sqlite.open('database/generic.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    await createTableImg();
    await createTableTag()
}

main();