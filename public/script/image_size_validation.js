document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.querySelector('#img-file');

    function getSelectedFile() {
        const isFileSelected = fileInput && fileInput.files && fileInput.files[0];

        if (isFileSelected)
            return fileInput.files[0];
        else
            return false;
    }

    function validateResolution(file) {
        let image = new Image();
        image.src = window.URL.createObjectURL(file);

        return new Promise(function (resolve, reject) {
            image.addEventListener('load', (e) => {
                resolve( [image.width >= 184 && image.height >= 184, image.src] );
                reject( [false, Error('Uhh')] );
            }, {once: true});
        });
    }

    function validateFormat(file) {
        const allowed = ['png', 'jpg', 'jpeg'];
        const type = file.type.split('/');

        return type[0] === 'image' && allowed.includes(type[1]);
    }

    async function main() {
        const file = getSelectedFile();

        if (!file) {
            return false;
        }

        if (!validateFormat(file)) {
            document.querySelector('#ext-warning').style.display = 'initial';
            return false;
        }

        const valid = await validateResolution(file);

        if (valid[0]) {
            document.querySelector('#preview').querySelector('img').src = valid[1]
            return true;
        } else {
            document.querySelector('#resolution-warning').style.display = 'initial';
            fileInput.value = null;
            return false;
        }
    }

    fileInput.addEventListener('input', (e) => {
        main();
    });
}, {once: true});