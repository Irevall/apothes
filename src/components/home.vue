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
            <div class="popout-background" @click="hidePopout($event)" v-if="avatar_info.show">
                <div class="popout avatar-info" v-bind:data-id="avatar_info.id" v-if="avatar_info.show" ref="avatar_info">
                    <div class="sizes">
                        <div class="img-full">
                            <span>256 px</span>
                            <img v-bind:src="avatar_info.link"/>
                        </div>
                        <div class="img-medium">
                            <span>160 px</span>
                            <img v-bind:src="avatar_info.link"/>
                        </div>
                        <div class="img-small">
                            <span>Discord</span>
                            <img v-bind:src="avatar_info.link"/>
                        </div>
                    </div>
                    <div class="info">
                        <a :href="avatar_info.link" download @click="downloaded(avatar_info.id)">Download</a>
                        <span class="source">Source: <span v-html="avatar_info.source"></span></span>
                        <span><router-link target="_blank" :to="'/avatar/' + avatar_info.id">Permalink</router-link></span>
                        <span class="success" v-if="report.sent">Your report has been sent.</span>
                    </div>

                    <div class="buttons">
                        <img src="../assets/report.png" title="Report" @click="report.show = true; clearNotifications()"/>
                        <img src="../assets/close.png" title="Close" @click="avatar_info.show = false; report.show = false; clearNotifications()"/>

                    </div>

                    <div class="popout report" v-if="report.show && avatar_info.show">
                        <textarea></textarea>
                        <span class="warning" v-if="report.failed">Failed to send. Try again.</span>
                        <span class="warning" v-if="report.none">Report message can't be empty.</span>
                        <div class="buttons">
                            <input type="button" value="Report" @click="sendReport(avatar_info.id)"/>
                            <input type="button" value="Cancel" @click="report.show = false; clearNotifications()"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import shared from '../script/shared'

    export default {
        name: "home",
        data: function () {
            return {
                images_data: [],
                images: [],
                avatar_info: {
                    show: false,
                    id: '',
                    link: '',
                    source: ''
                },
                report: {
                    show: false,
                    sent: false,
                    failed: false,
                    none: false,
                }
            }
        },
        async created() {
            window.fetch('/api/images', {
                method: 'GET'
            }).then(async (response) => {
                return {status: response.status === 200, data: await response.json()};
            }).then((parsedResponse) => {
                if (!parsedResponse) {
                    console.log('fail');
                    return false;
                }

                parsedResponse.data.forEach((image) => {
                    this.images_data.push({id: image.id, link: `${image.id}.png`, source: image.source});
                });

                this.loadImages();
            });

            document.addEventListener('scroll', () => {
                if (document.querySelector('body').scrollHeight - (window.scrollY + window.innerHeight) < 400) {
                    this.loadImages();
                }
            });

            document.addEventListener('DOMContentLoaded', () => {
                document.querySelector('.gallery').style.gridTemplateColumns = `repeat(${Math.min(5, Math.floor((window.innerWidth - 2 * 20) / (184 + 35)))}, 184px)`;
            });

            window.addEventListener('resize', () => {
                if (document.querySelector('body').scrollHeight - (window.scrollY + window.innerHeight) < 400) {
                    this.loadImages();
                }

                document.querySelector('.gallery').style.gridTemplateColumns = `repeat(${Math.min(5, Math.floor((window.innerWidth - 2 * 20) / (184 + 35)))}, 184px)`;
            });
        },
        methods: {
            moreInfo: function (event) {
                this.avatar_info.id = event.target.dataset.id;
                this.avatar_info.link = event.target.src;
                this.avatar_info.source = shared.urlify(event.target.dataset.source);
                this.avatar_info.show = true;
            },
            hidePopout: function (event) {
                if (event.target !== document.querySelector('.popout-background')) {
                    return false;
                }

                this.avatar_info.show = false;
                this.report.show = false;
                this.clearNotifications();
            },
            loadImages: function () {
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
            },
            downloaded: function (id) {
                window.fetch(`/api/downloadCount/${id}`, {
                    method: 'POST',
                });
            },
            sendReport: function(id) {
                const reportText = document.querySelector('.report').querySelector('textarea').value;

                if (reportText === '') {
                    this.report.none = true;
                    return;
                }

                window.fetch(`/api/report/${id}`, {
                    method: 'POST',
                    body: reportText,
                }).then((response) => {
                    if (response.status === 200) {
                        this.report.show = false;
                        this.report.sent = true;
                    } else {
                        this.report.failed = true;
                    }
                });
            },
            clearNotifications: function() {
                this.report.sent = false;
                this.report.failed = false;
                this.report.none = false;
            }
        }

    }
</script>

<style lang="scss" scoped>
    .container {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .gallery {
        display: grid;
        /*grid-template-columns: repeat(auto-fit, minmax(184px, 1fr));*/
        grid-template-columns: repeat(0, 184px);
        gap: 35px;
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
        padding: 10px;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.6));
        background-color: #1b2838;
    }

    .avatar-info > .sizes {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        size: 1.2em;
        font-weight: 700;
    }

    .avatar-info > .sizes > div {
        display: flex;
        flex-direction: column;
    }

    .avatar-info > .sizes > div:not(:last-child) {
        margin-right: 10px;
    }

    .avatar-info > .sizes span {
        text-align: center;
        margin-bottom: 4px;
    }

    .avatar-info .img-full > img {
        width: 256px;
        height: 256px;
    }

    .avatar-info .img-medium > img {
        width: 160px;
        height: 160px;
    }

    .avatar-info .img-small > img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
    }

    .avatar-info > .info {
        display: flex;
        flex-direction: column;
    }

    .avatar-info > .info > span {
        margin-top: 3px;
        max-width: 500px;
        overflow-wrap: break-word;
    }

    .avatar-info > .buttons {
        position: absolute;
        top: 6px;
        right: 6px;
    }

    .buttons > img {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .report {
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .report > textarea {
        min-height: 70px;
        background-color: #5d5f71;
        color: #dedede;
    }

    .report > *:not(:last-child) {
        margin-bottom: 5px;
    }

    .report > .buttons {
        margin: 0 auto;
    }

    .report > .buttons > *:first-of-type {
        margin-right: 15px;
    }
</style>