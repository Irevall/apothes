const sqlite = require('sqlite');
let db;

async function main(image_id, text) {
    db = await sqlite.open('data/database.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    let values = {};
    values.image_id = image_id;
    values.text = text;
    values.date = Date.now();

    let response = true;
    await db.run(`INSERT reports reports (image_id, text, date) VALUES (${Object.keys(values).map(() => '(?)' ).join(', ')})`, Object.values(values)).catch((err) => {
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