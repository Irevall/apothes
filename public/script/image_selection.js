document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.img_upload');
    const selection = document.querySelector('#selection');
    const image = document.querySelector('#preview').querySelector('img');

    let position = {};
    const boundaries = {};

    image.addEventListener('load', (e) => {
        const clientRect = image.getBoundingClientRect();
        boundaries.min_x = clientRect.left;
        boundaries.min_y = clientRect.top;
        boundaries.max_x = clientRect.left + clientRect.width;
        boundaries.max_y = clientRect.top + clientRect.height;
    });

    selection.addEventListener('mousedown', (e) => {
        position.x = e.clientX;
        position.y = e.clientY;

        selection.addEventListener('mousemove', moveSelection);
    });

    document.addEventListener('mouseup', () => {
        selection.removeEventListener('mousemove', moveSelection)
    });

    function moveSelection(e) {
        const x = e.clientX;
        const y = e.clientY;

        let target = {};
        target.x = parseInt(window.getComputedStyle(selection).left.slice(0, -2)) + (x - position.x);
        target.y = parseInt(window.getComputedStyle(selection).top.slice(0, -2)) + (y - position.y);

        if (target.x >= boundaries.min_x && target.x <= (boundaries.max_x - 184)) {
            selection.style.left = `${target.x}px`;
        } else{
            if (target.x < boundaries.min_x) {
                selection.style.left = `${boundaries.min_x}px`;
            } else {
                selection.style.left = `${boundaries.max_x - 184}px`;
            }
        }

        if (target.y >= boundaries.min_y && target.y <= (boundaries.max_y - 184)) {
            selection.style.top = `${target.y}px`;
        } else{
            if (target.y < boundaries.min_y) {
                selection.style.top = `${boundaries.min_y}px`;
            } else {
                selection.style.top = `${boundaries.max_y - 184}px`;
            }
        }

        position.x = x;
        position.y = y;

        // selection.style.top = `${parseInt(window.getComputedStyle(selection).top.slice(0, -2)) + (y - position.y)}px`;
        // position.x = x;
        // position.y = y;

    }
    // function changePosition(id) {
    //
    //     console.log(`x: ${x}`);
    //     console.log(`y: ${y}`);
    //     console.log(`id: ${id}`);
    // }
}, {once: true});