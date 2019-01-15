<template>
    <div class="avatar">
        <img :src="image.link"/>
        <span><span class="title">Source:</span> {{ image.source }}</span>
        <span><span class="title">Posted at:</span> {{ image.date }}</span>
        <span><span class="title">Downloads:</span> {{ image.downloads }}</span>
        <span class="non-approved" v-if="!image.approved">This image hasn't been approved by moderator yet, so it's not publicly visible.</span>
    </div>
</template>

<script>
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
            this.image.link = `/${this.$route.params.id}.png`;
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

                const date = new Date(parsedResponse.data[0].date);
                this.image.source = parsedResponse.data[0].source;
                this.image.date = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}, ${('0' + date.getDate()).slice(-2)}/${('0' + date.getMonth() + 1).slice(-2)}/${date.getFullYear()}`;
                this.image.downloads = parsedResponse.data[0].downloads;
                this.image.approved = (parsedResponse.data[0].approved === 1)
            });
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