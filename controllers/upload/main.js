const fs = require('fs');
const path = require('path');

const database = require('../db');

function createID() {
    let length = 5;
    let id = Math.random().toString(36).substr(2, length);

    for (let i = 0; i < length; i++) {
        if (Math.random() >= 0.5) {
            id = id.slice(0, i) + id.charAt(i).toUpperCase() + id.slice(i + 1);
        }
    }

    return id;
}

async function createUnique() {
    let id = '';

    do {
        id = createID();
    } while (
        false === await database.unique(id).catch((err) => {
            return {status: 500, message: 'Database error.'};
        })
    );

    return id;
}


async function main(file, body) {
    const reader = fs.createReadStream(file.path);
    const id = await createUnique();
    await database.add(id, body).catch((err) => {
        return {status: 500, message: 'Database error.'};
    });
    // fix path to './database/images'
    const stream = fs.createWriteStream(path.join('./database/images_temp', id + '.png'));
    reader.pipe(stream);
    fs.unlink(file.path, (err) => {
        if (err) throw err;
    });
}

module.exports = main;