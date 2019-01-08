document.addEventListener('DOMContentLoaded', () => {
    const selection = document.querySelector('#selection');
    const image = document.querySelector('#preview').querySelector('img');
    const fileInput = document.querySelector('#img-file');
    function crop() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // ctx.webkitImageSmoothingEnabled = false;
        // ctx.mozImageSmoothingEnabled = false;
        // ctx.imageSmoothingEnabled = false;

        console.log(`width: ${image.width}`);
        console.log(`height: ${image.height}`);
        canvas.width = 184;
        canvas.height = 184;

        const x = window.getComputedStyle(selection).left.slice(0, -2);
        const y = window.getComputedStyle(selection).top.slice(0, -2);
        const size = window.getComputedStyle(selection).width.slice(0, -2);

        const scale = (image.naturalWidth / image.width);

        ctx.drawImage(image, Math.floor(x * scale), Math.floor(y * scale), Math.floor(size * scale), Math.floor(size * scale), 0, 0, 184, 184);
        // document.querySelector('#test').innerHTML = '';
        // document.querySelector('#test').appendChild(canvas);
        return canvas;
    }

    function postData(url, data) {
        let form = new FormData();
        form.append('image', data);
        form.append('source', document.querySelector('#img-source').value);

        return fetch(url, {
            method: 'POST',
            body: form
        });
    }

    document.querySelector('#img-download').addEventListener('click', (e) => {
        if (fileInput.files.length === 1) {
            const canvas = crop();
            console.log(canvas);
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = "test.png";
            link.click();
        } else {
            console.log('Select file first');
        }
    });

    document.querySelector('#img-upload').addEventListener('click', (e) => {
        if (fileInput.files.length === 1) {
            const canvas = crop();
            console.log(canvas);
            postData('http://localhost:9010/upload.html', canvas.toDataURL());
        } else {
            console.log('Select file first');
        }
    });
}, {once: true});