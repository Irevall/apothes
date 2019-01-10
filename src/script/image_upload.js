const selection = document.querySelector('#selection');
const image = document.querySelector('#preview').querySelector('img');
const fileInput = document.querySelector('#img-file');
function crop() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.mozImageSmoothingEnabled = false;
    // ctx.imageSmoothingEnabled = false;

    canvas.width = 184;
    canvas.height = 184;

    const x = window.getComputedStyle(selection).left.slice(0, -2);
    const y = window.getComputedStyle(selection).top.slice(0, -2);
    const size = window.getComputedStyle(selection).width.slice(0, -2);
    const scale = (image.naturalWidth / image.width);

    ctx.drawImage(image, Math.floor(x * scale), Math.floor(y * scale), Math.floor(size * scale), Math.floor(size * scale), 0, 0, 184, 184);
    return canvas;
}

function postData(url, data) {
    let form = new FormData();
    form.append('image', data);
    form.append('source', document.querySelector('#img-source').value);

    return fetch(url, {
        method: 'POST',
        body: form
    }).then(response => {
        return response;
    });
}

function warningsReset() {
    const warnings = document.querySelector('form').querySelectorAll('p');
    warnings.forEach((ele2) => {
        ele2.style.display = 'none';
    });
}

function main() {
    document.querySelector('#img-download').addEventListener('click', (e) => {
        if (fileInput.files.length === 1) {
            const canvas = crop();
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = "test.png";
            link.click();
        } else {
            warningsReset();
            document.querySelector('#download-nofile').style.display = 'inline';
        }
    });

    document.querySelector('#img-upload').addEventListener('click', async (e) => {
        if (document.querySelector('#img-source').value.length === 0) {
            document.querySelector('#source-empty').style.display = 'inline';
            return false;
        }

        if (fileInput.files.length === 1) {
            const canvas = crop();
            let response = await postData('http://localhost:9010/upload.html', canvas.toDataURL());
            if (response.ok) {
                warningsReset();
                document.querySelector('#upload-success').style.display = 'inline';
                console.log(response);
                document.querySelector('#upload-success').querySelector('a').href = `images_temp/${response.statusText}.png`;
            } else {
                warningsReset();
                document.querySelector('#upload-fail').style.display = 'inline';
                document.querySelector('#upload-fail').innerHTML = response.statusText;
            }
        } else {
            warningsReset();
            document.querySelector('#upload-nofile').style.display = 'inline';
        }
    });
}