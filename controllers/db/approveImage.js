const sqlite = require('sqlite');

async function main(id, approved) {
    let db;
    try {
        db = await sqlite.open('data/database.db').catch((err) => {
            throw(err);
        });

        await db.run(`UPDATE images SET approved=? WHERE id=?`, [approved, id]).catch((err) => {
            throw(err);
        });
    } catch(err) {
        console.log(err);
        return { status: 500, message: 'Database error.' };
    } finally {
        await db.close().catch((err) => {
            console.log(err);
        });
    }
    return { status: 200, message: 'Success!' };
}

module.exports = main;