<template>
    <div class="dashboard">
        <form>
            <label for="password">Password:</label>
            <input type="password" id="password" required>
            <input type="button" value="Submit" @click="submit">
        </form>

        <div class="data">
            <div>
                <div><span>Image</span></div>
                <div><span>Source</span></div>
                <div><span>Date</span></div>
                <div><span>Downloads</span></div>
                <div><span>Approve</span></div>
                <div><span>Delete</span></div>
            </div>
            <div class="single-image" v-for="image in images">
                <div :data-id="image.id"><img :src="`${image.id}.png`"/></div>
                <div :data-source="image.source"><span v-html="image.sourceFormatted"></span></div>
                <div :data-date="image.date"><span>{{ image.dateFormatted }}</span></div>
                <div :data-downloads="image.downloads"><span>{{ image.downloads }}</span></div>
                <div class="approve" :data-approved="image.approved"><img src="../assets/approved.svg" v-if="image.approved === 1" @click="approveImage(image.id, image.approved)"/> <img src="../assets/approve.svg" v-if="image.approved === 0" @click="approveImage(image.id, image.approved)"/></div>
                <div><input class="delete" type="button" value="Delete" @click="deleteImage(image.id)"/></div>
            </div>
        </div>
    </div>
</template>

<script>
    import shared from '../script/shared'

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
                        this.getData();
                    } else {
                        return false;
                    }
                })
            },
            getData: function() {
                window.fetch(`/api/allData/auth=${this.password}`, {
                    method: 'GET',
                }).then( async (response) => {
                    if (response.status !== 200) {
                        return false;
                    }
                    const data = await response.json();

                    data.forEach((image) => {
                        image.sourceFormatted = shared.urlify(image.source);
                        image.dateFormatted = shared.dateFormat(image.date);
                        this.images.push(image);
                    });
                })
            },
            deleteImage: function(id) {
                if (!confirm(`Delete image with id: ${id}?`)) {
                    return false;
                }

                window.fetch(`/api/delete/auth=${this.password}`, {
                    method: 'POST',
                    body: JSON.stringify({ id: id })
                }).then((response) => {
                    if (response.status === 200) {
                        this.images = this.images.filter(image => image.id !== id);
                    }
                    console.log(response.statusText);
                })
            },
            approveImage: function(id, approved) {
                window.fetch(`/api/approve/auth=${this.password}`, {
                    method: 'POST',
                    body: JSON.stringify({ id: id, approved: Math.abs(approved - 1) })
                }).then((response) => {
                    if (response.status === 200) {
                        this.images.find((image) => {
                            if (image.id === id) {
                                image.approved = Math.abs(approved - 1);
                            }
                        });
                    }
                    console.log(response);
                })
            }
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
        margin: 0 auto;
    }

    form > * {
        margin-bottom: 5px;
    }

    .data {
        display: grid;
        grid-template-columns: 256px 90px 100px 90px 90px 90px;
        gap: 3px;
        background-color: white;
        width: auto;
    }

    .data > div {
        display: contents;
    }

    .data > div span {
        word-wrap: break-word;
        overflow-wrap: break-word;
        text-align: center;
    }

    .data > div > div {
        background-color: #1b2838;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .approve > img {
        width: 65px;
    }
</style>