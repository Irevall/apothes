<template>
    <div class="gallery">
        <div class="avatar" v-for="image in images">
            <img
                    class="img-main"
                    v-bind:src="image.link"
                    v-bind:data-source="image.source"
                    @click="moreInfo"
            />
            <img
                    class="img-background"
                    v-bind:src="image.link"
                    v-bind:data-source="image.source"
            />
        </div>

        <div class="popout" ref="popout">
            <div class="sizes">
                <div class="img-full">
                    <span>256 px</span>
                    <img v-bind:src="popout.img"/>
                </div>
                <div class="img-medium">
                    <span>160 px</span>
                    <img v-bind:src="popout.img"/>
                </div>
                <div class="img-small">
                    <span>Discord</span>
                    <img v-bind:src="popout.img"/>
                </div>
            </div>
            <span class="source">Source: {{ popout.source }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "home",
        data: function () {
            return {
                images: [],
                popout: {
                    img: '',
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

                parsedResponse.data.forEach((img) => {
                    // this.images.push({ link: `${img.image_id}.png`, source: img.source })
                });
            });

        },
        methods: {
            moreInfo: function(event) {
                console.log(event.target);
                this.popout.img = event.target.src;
                this.popout.source = event.target.dataset.source;
                this.$refs.popout.style.display = 'inherit';

                document.querySelector('body').addEventListener('click', (event) => {
                    if (!event.path.includes(this.$refs.popout) && !event.target.classList.contains('img-main')) {
                        this.$refs.popout.style.display = 'none';
                    }
                }, { once: true });
            },
        }

    }
</script>

<style lang="scss" scoped>
    .gallery {
        position: relative;
        display: grid;
        grid-template-columns: repeat(5, 184px);
        gap: 48px;
        margin: 24px auto 0 auto;
        width: max-content;
    }

    .avatar {
        height: 184px;
        width: 184px;
        position: relative;
        box-shadow: 0 0 10px slategrey;
        cursor: pointer;
    }

    .img-main {
        position: absolute;
        height: 184px;
        width: 184px;
    }

    .img-background {
        position: absolute;
        filter: blur(2px);
        z-index: -1;
        height: 190px;
        width: 190px;
        top: -3px;
        left: -3px;
    }

    .popout {
        display: none;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: max-content;
        height: max-content;
        margin: auto;
        padding: 10px;
        outline: 2px #4a4f6e solid;
        box-shadow: inset 0 0 5px #4a4f6e;
        background-color: #172438;
    }

    .popout > .sizes {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        size: 1.2em;
        font-weight: bold;
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

    .source {
        margin-top: 7px;
    }
</style>