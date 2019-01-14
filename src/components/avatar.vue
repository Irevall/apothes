<template>
    <div class="avatar">
        <img src=""/>
        <span>Source: d d d</span>
        <span>Posted at: </span>
        <span>Downloads: 0</span>
        <!--<img v-bind:src=""/>-->
    </div>
</template>

<script>
    export default {
        name: "avatar",
        data: function() {
            return {
                image: {
                    img: this.$route.params
                }
            }
        },
        async created() {
            console.log(this.$route.params.id);
            // window.fetch(`/api/image/${this.$route.params.id}`, {
            //     method: 'GET',
            // })
            //     .then(async (response) => {
            //     return { status: response.status === 200, data: await response.json() };
            // }).then((parsedResponse) => {
            //     if (!parsedResponse) {
            //         console.log('fail');
            //         return false;
            //     }
            //
            //     parsedResponse.data.forEach((img) => {
            //         this.images.push({ link: require(`../../database/images/${img.image_id}.png`), source: img.source })
            //     });
            // });
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