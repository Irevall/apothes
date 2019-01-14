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

function writeFile(id, image, regex) {
    image = image.replace(regex, '');

    return new Promise(function (resolve, reject) {
        fs.writeFile(`./data/images/${id}.png`, image, 'base64', (err) => {
            if (err) {
                console.log(err);
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}

//add more promises
async function main(body) {
    const regex = RegExp(/^data:image\/png;base64,/);

    if (!regex.test(body.image)) {
        return {status: 500, message: 'Not an image file.'};
    }

    const id = await createUnique();
    if (!await writeFile(id, body.image, regex)) {
        return {status: 500, message: 'File write error.'};
    }

    let response = await database.add(id, body).catch((err) => {
        console.log(err);
        fs.unlink(`./data/images/${id}.png`, (err2) => {
            console.log(err2);
        });
        return err;
    });

    if (response === true) {
        return {status: 200, message: id}
    } else {
        return response
    }
}

module.exports = main;