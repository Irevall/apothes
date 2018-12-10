const sqlite = require('sqlite');
let db;

function createID() {
    let id = '';
    let previous = '';
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    while (id.length < 5) {
        let temp = possible.charAt(Math.floor(Math.random() * possible.length));
        if (temp.toLowerCase() !== previous.toLowerCase()) {
            id += temp;
            previous = temp;
        }
    }

    return id;
}

async function main(data) {
    id = createID();
}

main('xd');