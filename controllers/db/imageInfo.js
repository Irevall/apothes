const sqlite = require('sqlite');

async function main(id) {
    const db = await sqlite.open('data/database.db').catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database connection error.'};
    });

    const response = await db.all(`SELECT * FROM images WHERE id = ?`, [id]).catch((err) => {
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