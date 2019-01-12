<template>
    <div class="gallery">
        <img
                v-for="img in imgs"
                v-bind:src="img.src"
        />
    </div>
</template>

<script>
    export default {
        name: "home",
        data: function () {
            return {
                imgs: [
                    // { src: require('../../database/images/image01.jpg') },
                    // { src: require('../../database/images/image02.jpg') },
                    // { src: require('../../database/images/image03.jpg') },
                    // { src: require('../../database/images/image04.jpg') },
                    // { src: require('../../database/images/image05.jpg') },
                    // { src: require('../../database/images/image06.jpg') },
                    // { src: require('../../database/images/image07.jpg') },
                    // { src: require('../../database/images/image08.jpg') },
                ]
            }
        },
        async created() {
            window.fetch('/getImages', {
                method: 'GET'
            }).then(async (response) => {
                return { status: response.status === 200, data: await response.json() };
            }).then((parsedResponse) => {
                if (!parsedResponse) {
                    console.log('fail');
                    return false;
                }

                console.log(parsedResponse.data);
            });
        },
        methods: {

        }

    }
</script>

<style lang="scss" scoped>
    .gallery {
        display: grid;
        grid-template-columns: repeat(5, 184px);
        gap: 48px;
        margin: 24px auto 0 auto;
        width: max-content;
    }

    .gallery > img {
        width: 184px;
    }

    .popout {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        /*display: flex;*/
        /*flex-direction: column;*/
        /*flex: 1;*/
        width: max-content;
        height: max-content;
        margin: auto;
        padding: 10px;
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
        width: 184px;
        height: 184px;
    }

    .popout > .sizes > .img-medium > img {
        width: 120px;
        height: 120px;
    }

    .popout > .sizes > .img-small > img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .popout > .informations {
        display: flex;
        flex-direction: column;
        max-width: calc(184px + 120px + 64px + 20px);
    }

    .informations span{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .informations .source {

    }
</style>