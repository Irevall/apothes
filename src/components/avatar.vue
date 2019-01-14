<template>
    <div class="avatar">
        <img :src="image.link"/>
        <span>Source: {{ image.source }}</span>
        <span>Posted at: {{ image.date }}</span>
        <span>Downloads: {{ image.downloads }}</span>
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
                console.log(('00' + date.getMinutes()).slice(2));
                this.image.source = parsedResponse.data[0].source;
                this.image.date = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}, ${('0' + date.getDate()).slice(-2)}/${('0' + date.getMonth() + 1).slice(-2)}/${date.getFullYear()}`;
                this.image.downloads = parsedResponse.data[0].downloads;
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
</style>