document.addEventListener('DOMContentLoaded', () => {
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

    function updateBoundaries() {
        boundaries.max_size = Math.min(image.height, image.width);
        boundaries.max_x = image.width;
        boundaries.max_y = image.height;
    }

    function center() {
        selection.style.left = `${(image.width - selectionSize) / 2}px`;
        selection.style.top = `${(image.height - selectionSize) / 2}px`;
    }

    selection.addEventListener('mousedown', (e) => {
        position.x = e.clientX;
        position.y = e.clientY;

        document.addEventListener('mousemove', moveSelection);
    });

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveSelection)
    });

    document.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', moveSelection)
    });

    function moveSelection(e) {
        const x = e.clientX;
        const y = e.clientY;

        let target = {};
        target.x = parseInt(window.getComputedStyle(selection).left.slice(0, -2)) + (x - position.x);
        target.y = parseInt(window.getComputedStyle(selection).top.slice(0, -2)) + (y - position.y);

        if (target.x >= 0 && target.x <= (boundaries.max_x - selectionSize)) {
            selection.style.left = `${target.x}px`;
        } else {
            if (target.x < 0) {
                selection.style.left = '0px';
            } else {
                selection.style.left = `${boundaries.max_x - selectionSize}px`;
            }
        }

        if (target.y >= 0 && target.y <= (boundaries.max_y - selectionSize)) {
            selection.style.top = `${target.y}px`;
        } else{
            if (target.y < 0) {
                selection.style.top = '0px';
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