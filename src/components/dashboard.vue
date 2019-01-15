<template>
    <div class="dashboard">
        <form>
            <label for="password">Password:</label>
            <input type="password" id="password" required>
            <input type="button" value="Submit" @click="submit">
        </form>

        <div class="data">
            <div class="single-image" v-for="image in images" :data-id="image.id">
                <div><img :src="`${image.id}.png`"/></div>
                <div><span>{{ image.source }}</span></div>
                <div><span>{{ image.date }}</span></div>
                <div><span>{{ image.downloads }}</span></div>
                <div><span>{{ image.approved }}</span></div>
                <div><span>delete</span></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "dashboard",
        data: function() {
            return {
                password: '',
                images: []
            }
        },
        methods: {
            submit: function() {
                window.fetch(`/api/auth`, {
                    method: 'POST',
                    body: document.querySelector('#password').value
                }).then((response) => {
                    if (response.status === 200) {
                        this.password = document.querySelector('#password').value;
                        this.createDash();
                    } else {
                        return false;
                    }
                })
            },
            createDash: function() {
                window.fetch(`/api/allData/auth=${this.password}`, {
                    method: 'GET',
                }).then( async (response) => {
                    if (response.status !== 200) {
                        return false;
                    }
                    const data = await response.json();

                    data.forEach((img) => {
                        this.images.push(img);
                    })
                })
            },
        }
    }
</script>

<style scoped>
    .dashboard {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    form {
        display: flex;
        flex-direction: column;
        width: 200px;
        margin: 0 auto;
    }

    form > * {
        margin-bottom: 5px;
    }

    form > input[type=button] {
        width: 100px;
    }

    .data {
        display: grid;
        grid-template-columns: 256px 150px 50px 50px 50px 50px;
        gap: 3px;
        background-color: white;
        width: auto;
    }

    .data > .single-image {
        display: contents;
    }

    .data > .single-image span {
        overflow-wrap: break-word;
    }

    .single-image > div {
        background-color: #1b2838;
    }

</style>