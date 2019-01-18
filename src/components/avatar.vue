<template>
    <div class="avatar">
        <img :src="`${image.id}.png`"/>
        <span><a :href="`${image.id}.png`" download @click="downloaded(image.id)">Download</a></span>
        <span><span class="title">Source:</span> <span v-html="image.source"></span></span>
        <span><span class="title">Posted at:</span> {{ image.date }}</span>
        <span><span class="title">Downloads:</span> {{ image.downloads }}</span>
        <span class="non-approved" v-if="!image.approved">This image hasn't been approved by moderator yet, so it's not publicly visible.</span>
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
            }
        }
    }
</script>

<style scoped>
    .avatar {
        display: flex;
        flex-direction: column;
        width: 300px;
        margin: 0 auto;
    }

    .avatar > img {
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
</style>