const fs = require('fs');
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

function writeFile(id, image) {
    image = image.replace(/^data:image\/png;base64,/, '');

    return new Promise(function (resolve, reject) {
        fs.writeFile(`./database/images_temp/${id}.png`, image, 'base64', (err) => {
            if (err) {
                console.log(err);
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}

//add more promises, file validation and delete upload if can't connect to db
async function main(body) {
    const id = await createUnique();
    if (!await writeFile(id, body.image)) {
        return {status: 500, message: 'File write error.'};
    }

    await database.add(id, body).catch((err) => {
        console.log(err);
        return {status: 500, message: 'Database error.'};
    });
}

module.exports = main;