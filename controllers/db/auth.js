const fs = require('fs');

function main(password) {
    return new Promise(function (resolve, reject) {
        fs.readFile('data/password.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
                reject(false)
            }

            resolve(data === password);
        });
    });
}

module.exports = main;