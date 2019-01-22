<template>
    <div class="avatar">
        <img :src="`${image.id}.png`"/>
        <img src="../assets/report.png" class="report-button" title="Report" @click="report.show = true"/>
        <span><a :href="`${image.id}.png`" download @click="downloaded(image.id)">Download</a></span>
        <span class="non-approved" v-if="!image.approved">This image hasn't been approved by moderator yet, so it's not publicly visible.</span>
        <span class="success" v-if="report.sent">Your report has been sent.</span>
        <span><span class="title">Source:</span> <span v-html="image.source"></span></span>
        <span><span class="title">Posted at:</span> {{ image.date }}</span>
        <span><span class="title">Downloads:</span> {{ image.downloads }}</span>

        <div class="popout-background" @click="hidePopout($event)" v-if="report.show">
            <div class="popout report">
                <textarea></textarea>
                <span class="warning" v-if="report.failed">Failed to send. Try again.</span>
                <span class="warning" v-if="report.none">Report message can't be empty.</span>
                <div class="buttons">
                    <input type="button" value="Report" @click="sendReport(image.id)"/>
                    <input type="button" value="Cancel" @click="report.show = false; clearNotifications()"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import shared from '../script/shared'

    export default {
        name: "avatar",
        data: function() {
            return {
                image: {
                    link: '',
                    source: '',
                    date: '',
                    downloads: '',
                    approved: false
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
            this.image.id = this.$route.params.id;
            window.fetch(`/api/image/${this.$route.params.id}`, {
                method: 'GET',
            })
                .then(async (response) => {
                return { status: response.status === 200, data: await response.json() };
            }).then((parsedResponse) => {
                if (!parsedResponse) {
                    console.log('fail');
                    return false;
                }

                this.image.source = shared.urlify(parsedResponse.data[0].source);
                this.image.date = shared.dateFormat(parsedResponse.data[0].date);
                this.image.downloads = parsedResponse.data[0].downloads;
                this.image.approved = (parsedResponse.data[0].approved === 1);
            });
        },
        methods: {
            downloaded: function(id) {
                window.fetch(`/api/downloadCount/${id}`, {
                    method: 'POST',
                }).then((response) => {
                    if (response.status === 200) {
                        this.image.downloads += 1;
                    }
                    console.log(response);
                })
            },
            hidePopout: function (event) {
                if (event.target !== document.querySelector('.popout-background')) {
                    return false;
                }

                this.report.show = false;
                this.clearNotifications();
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

<style scoped>
    .avatar {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 300px;
        margin: 0 auto;
    }

    .avatar > img:not(.report-button) {
        width: 256px;
        height: 256px;
    }

    .avatar .title {
        font-weight: 700;
    }

    .avatar > span {
        overflow-wrap: break-word;
    }

    .non-approved {
        font-size: 0.8em;
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

    .report-button {
        position: absolute;
        left: 256px;
        width: 24px;
        height: 24px;
        margin-left: 5px;
        cursor: pointer;
    }
</style>