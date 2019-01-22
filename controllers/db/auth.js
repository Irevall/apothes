const fs = require('fs').promises;

async function main(password) {
    let auth = await fs.readFile('data/password.txt', 'utf-8').catch((err) => {
        console.log(err);
        return null;
    });
    return auth === password;
}

module.exports = main;