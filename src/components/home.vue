<template>
    <div class="container">
        <div class="gallery">
            <div class="avatar" v-for="image in images">
                <img
                        class="img-main"
                        v-bind:src="image.link"
                        v-bind:data-source="image.source"
                        v-bind:data-id="image.id"
                        @click="moreInfo"
                />
                <img
                        class="img-background"
                        v-bind:src="image.link"
                        v-bind:data-source="image.source"
                />
            </div>
            <div class="popout-background" @click="hidePopout" v-if="popout.show">
                <div class="popout" v-bind:data-id="popout.id" v-if="popout.show" ref="popout">
                    <div class="buttons">
                        <img src="../assets/report.png" title="Report" />
                        <img src="../assets/close.png" title="Close" @click="popout.show = false" />

                    </div>
                    <div class="sizes">
                        <div class="img-full">
                            <span>256 px</span>
                            <img v-bind:src="popout.link"/>
                        </div>
                        <div class="img-medium">
                            <span>160 px</span>
                            <img v-bind:src="popout.link"/>
                        </div>
                        <div class="img-small">
                            <span>Discord</span>
                            <img v-bind:src="popout.link"/>
                        </div>
                    </div>
                    <div class="info">
                        <span class="source">Source: {{ popout.source }}</span>
                        <span><router-link target="_blank" :to="'/avatar/' + popout.id">Permalink</router-link></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home",
        data: function () {
            return {
                images_data: [],
                images: [],
                popout: {
                    show: false,
                    id: '',
                    link: '',
                    source: ''
                }
            }
        },
        async created() {
            window.fetch('/api/images', {
                method: 'GET'
            }).then(async (response) => {
                return { status: response.status === 200, data: await response.json() };
            }).then((parsedResponse) => {
                if (!parsedResponse) {
                    console.log('fail');
                    return false;
                }

                parsedResponse.data.forEach((image) => {
                    this.images_data.push({ id: image.id, link: `${image.id}.png`, source: image.source });
                });

                this.loadImages();
            });

            document.addEventListener('scroll', (event) => {
                if (document.querySelector('body').scrollHeight - (window.scrollY + window.innerHeight) < 400) {
                    this.loadImages();
                }
            });

            window.addEventListener('resize', (event) => {
                if (document.querySelector('body').scrollHeight - (window.scrollY + window.innerHeight) < 400) {
                    this.loadImages();
                }

                document.querySelector('.gallery').style.gridTemplateColumns = `repeat(${Math.min(5, Math.floor(window.innerWidth / (184 + 35)))}, 184px)`;
            });
        },
        methods: {
            moreInfo: function(event) {
                this.popout.id = event.target.dataset.id;
                this.popout.link = event.target.src;
                this.popout.source = event.target.dataset.source;
                this.popout.show = true;
            },
            hidePopout: function(event) {
                if (event.target !== document.querySelector('.popout-background') ) {
                    return false;
                }
                this.popout.show = false;
            },
            loadImages: function() {
                let imagesToLoad = 0;
                const images_length = this.images.length;
                const columns = window.getComputedStyle(document.querySelector('.gallery')).gridTemplateColumns.split(' ').length;
                if (images_length === 0) {
                    imagesToLoad = Math.min(this.images_data.length, Math.floor(Math.min(5, window.innerWidth / 200) * window.innerHeight / 200));
                } else {
                    imagesToLoad = Math.min(this.images_data.length - this.images.length, columns);
                }

                for (let i = 0; i < imagesToLoad; i++) {
                    this.images.push(this.images_data[i + images_length]);
                }
            }
        }

    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 0 2em 2em;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .gallery {
        display: grid;

        /*grid-template-columns: repeat(auto-fit, minmax(184px, 1fr));*/
        grid-template-columns: repeat(5, 184px);
        gap: 35px;
        /*min-width: 100%;*/
        /*max-width: 1200px;*/
        /*width: 100%;*/
    }

    .avatar {
        height: 184px;
        width: 184px;
        position: relative;
        box-shadow: 0 0 10px slategrey;
        cursor: pointer;
        overflow: hidden;
    }

    .img-main {
        position: absolute;
        height: 184px;
        width: 184px;
    }

    .img-background {
        position: absolute;
        filter: blur(2px);
        opacity: 1;
        z-index: -1;
        height: 190px;
        width: 190px;
        top: -3px;
        left: -3px;
    }

    .popout-background {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
    }

    .popout {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: auto;
        padding: 10px;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.6));
        background-color: #1b2838;
    }

    .popout > .sizes {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        size: 1.2em;
        font-weight: 700;
    }

    .popout > .sizes > div {
        display: flex;
        flex-direction: column;
    }

    .popout > .sizes > div:not(:last-child) {
        margin-right: 10px;
    }

    .popout > .sizes > * > span {
        text-align: center;
        margin-bottom: 4px;
    }

    .popout > .sizes > * > *:not(span) {
        margin: 0 auto;
    }

    .popout > .sizes > .img-full > img {
        width: 256px;
        height: 256px;
    }

    .popout > .sizes > .img-medium > img {
        width: 160px;
        height: 160px;
    }

    .popout > .sizes > .img-small > img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .popout > .info {
        display: flex;
        flex-direction: column;
    }

    .popout > .info > span {
        margin-top: 3px;
        max-width: 500px;
        overflow-wrap: break-word;
    }

    .popout > .buttons {
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .buttons > img {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }
</style>