document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.img-upload');
    const selection = document.querySelector('#selection');
    const image = document.querySelector('#preview').querySelector('img');

    document.querySelector('#preview').draggable = false;
    image.draggable = false;
    selection.draggable = false;

    let selectionSize;
    let position = {};
    const boundaries = {
        min_size: 184
    };


    image.addEventListener('load', (e) => {
        selection.style.display = 'initial';
        updateSize();
        updateBoundaries();
        center();
    });

    window.addEventListener('resize', updateBoundaries);

    function updateBoundaries() {
        const clientRect = image.getBoundingClientRect();
        boundaries.max_size = Math.min(clientRect.height, clientRect.width);
        boundaries.min_x = clientRect.left;
        boundaries.min_y = clientRect.top;
        boundaries.max_x = clientRect.left + clientRect.width;
        boundaries.max_y = clientRect.top + clientRect.height;
    }

    function center() {
        const clientRect = image.getBoundingClientRect();
        selection.style.left = `${clientRect.left + (clientRect.width - selectionSize) / 2}px`;
        selection.style.top = `${clientRect.top + (clientRect.height - selectionSize) / 2}px`;
    }

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

        if (target.x >= boundaries.min_x && target.x <= (boundaries.max_x - selectionSize)) {
            selection.style.left = `${target.x}px`;
        } else{
            if (target.x < boundaries.min_x) {
                selection.style.left = `${boundaries.min_x}px`;
            } else {
                selection.style.left = `${boundaries.max_x - selectionSize}px`;
            }
        }

        if (target.y >= boundaries.min_y && target.y <= (boundaries.max_y - selectionSize)) {
            selection.style.top = `${target.y}px`;
        } else{
            if (target.y < boundaries.min_y) {
                selection.style.top = `${boundaries.min_y}px`;
            } else {
                selection.style.top = `${boundaries.max_y - selectionSize}px`;
            }
        }

        position.x = x;
        position.y = y;
    }

    function updateSize() {
        selectionSize = window.getComputedStyle(selection).width.slice(0, -2);
    }

    selection.addEventListener('wheel', (e) => {
        const direction = (e.deltaY < 0) ? (1) : (-1);
        let size = window.getComputedStyle(selection).width.slice(0, -2) * (20 + direction) / 20;

        if (size < boundaries.min_size) {
            size = boundaries.min_size;
        } else if (size > boundaries.max_size) {
            size = boundaries.max_size;
        } else {
            const x = window.getComputedStyle(selection).left.slice(0, -2);
            const y = window.getComputedStyle(selection).top.slice(0, -2);
            const difference_x = boundaries.max_x - x;
            const difference_y = boundaries.max_y - y;

            if (difference_x < difference_y) {
                if (size > difference_x) {
                    size = difference_x;
                }
            } else {
                if (size > difference_y) {
                    size = difference_y;
                }
            }
        }

        selection.style.width = `${size}px`;
        selection.style.height = `${size}px`;
        updateSize();
    });
}, {once: true});