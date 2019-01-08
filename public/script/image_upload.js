document.addEventListener('DOMContentLoaded', () => {
    const selection = document.querySelector('#selection');
    const image = document.querySelector('#preview').querySelector('img');
    const fileInput = document.querySelector('.img-upload');
    function crop() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        console.log(`width: ${image.width}`);
        console.log(`height: ${image.height}`);
        canvas.width = 184;
        canvas.height = 184;
        ctx.fillStyle = "#FF0000";

        const difference_x = window.getComputedStyle(selection).left.slice(0, -2) - image.getBoundingClientRect().left;
        const difference_y = window.getComputedStyle(selection).top.slice(0, -2) - image.getBoundingClientRect().top;

        const selectionSize = window.getComputedStyle(selection).width.slice(0, -2);
        console.log(selectionSize);
        console.log(image.width);
        
        const scale = (image.naturalWidth / image.width);
        ctx.drawImage(image, difference_x * scale, difference_y * scale, selectionSize * scale, selectionSize * scale, 0, 0, 184, 184);
        document.querySelector('#test').innerHTML = '';
        document.querySelector('#test').appendChild(canvas);
    }

    document.querySelector('#img-upload').addEventListener('click', (e) => {
        if (fileInput.files.length === 1) {
            console.log('Everything ok!');
            crop();
        } else {
            console.log('Select file first');
        }
    });
}, {once: true});