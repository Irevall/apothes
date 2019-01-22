function validateResolution(file) {
    let image = new Image();
    image.src = window.URL.createObjectURL(file);

    return new Promise(function (resolve, reject) {
        image.addEventListener('load', (e) => {
            resolve( [image.width >= 184 && image.height >= 184, image] );
            reject( [false, Error('Uhh')] );
        }, {once: true});
    });
}

function validateExt(file) {
    const allowed = ['png', 'jpg', 'jpeg'];
    const type = file.type.split('/');

    return type[0] === 'image' && allowed.includes(type[1]);
}

async function main(fileInput) {
    const file = fileInput.files[0];

    if (!validateExt(file)) {
        fileInput.value = null;
        return { success: false, context: 'ext' }
    }

    const valid = await validateResolution(file);

    if (valid[0]) {
        return { success: true, context: valid[1] }
    } else {
        fileInput.value = null;
        return { success: false, context: 'res' }
    }
}

module.exports = main;