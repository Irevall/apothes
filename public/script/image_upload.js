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
        canvas.style.width = '184px';
        canvas.style.height = '184px';

        const difference_x = window.getComputedStyle(selection).left.slice(0, -2) - image.getBoundingClientRect().left;
        const difference_y = window.getComputedStyle(selection).top.slice(0, -2) - image.getBoundingClientRect().top;

        // console.log(difference_x);
        // console.log(difference_y);
        // console.log(window.getComputedStyle(selection).left.slice(0, -2));
        // console.log(image.getBoundingClientRect().left);

        const selectionSize = window.getComputedStyle(selection).width.slice(0, -2);
        console.log(selectionSize);

        // ctx.drawImage(image, difference_x, difference_y, selectionSize, selectionSize, 0, 0, 184, 184);
        ctx.drawImage(image, 0, 0, 450, 450, 0, 0, 184, 184);
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