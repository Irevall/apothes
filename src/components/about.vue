<template>
    <div class="about">
        <article>
            <h2>Why? What is this website for?</h2>
            <span>
                This website is for cropping and sharing those crops. <br/>
                I often change avatars on Discord or Steam and I couldn't find a good website for that since browsing random art gets boring after a while.
                I also wanted an easier way to crop the images.
            </span>
        </article>
        <hr/>
        <article>
            <h2>I have an issue/found a bug</h2>
            <span>Please report them <a href="https://github.com/Irevall/apothes/issues" target="_blank">here.</a></span>
        </article>
        <hr/>
        <article>
            <h2>My art is featured here and I want it removed</h2>
            <span>Write me an email at @ and I'll delete it.</span>
        </article>
        <hr/>
        <article>
            <h2>Rules</h2>
            <span>
                Good place to look at before uploading. :v <br/>
                <ul>
                    <li>Those rules can be changed at any time with no warning</li>
                    <li>Uploads are not guaranteed to stay, even if following the rules</li>
                    <li>No nudity</li>
                    <li>No 'gross' content</li>
                    <li>No controversial content</li>
                    <li>No low resolution content (as in upscaled and pixelated, pixel art is fine)</li>
                    <li>Wrong sources will be corrected or removed</li>

                </ul>
            </span>
        </article>
        <hr/>
        <article>
            <h2>Contact for anything else</h2>
            <span>kjm@irevall.me - I will try to respond as soon as possible.</span>
        </article>
    </div>
</template>

<script>
    export default {
        name: "about",
        data: function() {
            return {
            }
        },
        mounted() {
            const articles = document.querySelectorAll('article');
            articles.forEach((article, index) => {
                article.querySelector('h2').addEventListener('click', (e) => {
                    let element = articles[index].querySelector('span');
                    if (window.getComputedStyle(element).display === 'none') {
                        element.style.display = 'inherit';
                    } else {
                        element.style.display = 'none';
                    }
                })
            })
        }
    }
</script>

<style scoped>
    .about {
        max-width: 550px;
        margin: 0 auto;
    }

    article * {
        padding: 3px 5px;
        margin: 0;
    }

    article > h2 {
        font-weight: 600;
        cursor: pointer;
    }

    article > hr {

    }

    article > span {
        display: none;
    }

    article ul {
        margin-left: 0px;
    }

</style>