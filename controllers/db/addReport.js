const sqlite = require('sqlite');

async function main(image_id, text) {
    let db;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            throw(err);
        });

        let values = {};
        values.image_id = image_id;
        values.text = text;
        values.date = Date.now();

        await db.run(`INSERT INTO reports (image_id, text, date) VALUES (${Object.keys(values).map(() => '(?)' ).join(', ')})`, Object.values(values)).catch((err) => {
            throw(err);
        });
    } catch(err) {
        console.log(err);
        return { status: 500, message: 'Database error' };
    } finally {
        await db.close().catch((err) => {
            console.log(err);
        });
    }
    return { status: 200, message: 'Success!' };
}

module.exports = main;