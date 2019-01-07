document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.querySelector('.img_upload');

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

    async function main() {
        const file = getSelectedFile();

        if (!file) {
            return false;
        }

        const valid = await validateResolution(file);

        if (valid[0]) {
            document.querySelector('#preview').querySelector('img').src = valid[1]
        } else {
            console.log('Too small');
        }
    }

    fileInput.addEventListener('input', (e) => {
        main();
    });
}, {once: true});