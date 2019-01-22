const fs = require('fs').promises;
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
    let id, response;

    do {
        id = createID();
        response = await database.unique(id);
        if (response === null) {
            return false
        }
    } while (response === false);

    return id;
}

//add more promises
async function main(body) {
    let id;
    try {
        const regex = RegExp(/^data:image\/png;base64,/);
        if (!regex.test(body.image)) {
            throw('Not an image file.');
        }

        id = await createUnique();
        if (!id) {
            throw('Database error.');
        }

        await fs.writeFile(`./data/images/${id}.png`, body.image.replace(regex, ''), 'base64').catch((err) => {
           console.log(err);
           throw('Database error.');
        });

        let response = await database.add(id, body);

        if (!response) {
            fs.unlink(`./data/images/${id}.png`).catch((err) => {
                console.log(err);
                throw('Database error.');
            });

            throw('Database error.')
        }
    } catch(err) {
        console.log(err);
        return { status: 500, message: err };
    }
    return { status: 200, message: id };
}

module.exports = main;