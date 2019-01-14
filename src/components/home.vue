<template>
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
                    <span><router-link :to="'/avatar/' + popout.id">Permalink</router-link></span>
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
                    this.images.push({ id: image.id, link: `${image.id}.png`, source: image.source })
                });
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
            }
        }

    }
</script>

<style lang="scss" scoped>
    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(184px, 1fr));
        gap: 48px;
        margin: 24px auto 0 auto;
        max-width: 1200px;
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