document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.gallery').querySelectorAll('img').forEach((img) => {
        img.addEventListener('click', () => {
            let temp = document.getElementsByTagName('template')[0].content;
            temp.querySelector('.sizes').querySelectorAll('img').forEach((img2) => {
                img2.src = img.src
            });
            console.log(img);
            temp.querySelector('.author').innerHTML = img.dataset.imageAuthor;
            temp.querySelector('.source').href = img.dataset.imageSource;
            let clone = temp.cloneNode(true);
            document.body.querySelector('main').appendChild(clone);
        });
    });
});