const sqlite = require('sqlite');
let db;

async function main(id, data) {
    db = await sqlite.open('data/database.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    let values = {};
    values.image_id = id;
    values.source = data.source;
    values.tags = 'test, tagow';
    values.date = Date.now();
    values.downloads = 0;
    values.approved = 0;

    let response = true;
    await db.run(`INSERT INTO images (image_id, source, tags, date, downloads, approved) VALUES (${Object.keys(values).map(() => '(?)' ).join(', ')})`, Object.values(values)).catch((err) => {
        console.log(err);
        response = {status: 500, message: 'Database error.'};
        return {status: 500, message: 'Database error.'};
    });

    await db.close().catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });

    return new Promise(function (resolve, reject) {
        if (response === true) {
            resolve(true)
        } else {
            reject(response);
        }
    });
}

module.exports = main;