const sqlite = require('sqlite');
const auth = require('../db').auth;

async function main(password) {
    if (!await auth(password)) {
        return false;
    }

    const db = await sqlite.open('data/database.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    // const response = await db.all(`SELECT * FROM images WHERE approved=1 ORDER BY date DESC`).catch((err) => {
    const response = await db.all(`SELECT * FROM images ORDER BY date DESC`).catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });

    await db.close().catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });

    return response;
}

module.exports = main;