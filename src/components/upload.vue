<template>
    <div id="upload">
        <div id="preview" @mouseleave="lastMove" @mousemove="move">
            <div id="selection" @mousedown="selected" @wheel="resize" @mouseenter="mouse.move = true" v-bind:style="{ left: selection.position.x + 'px', top: selection.position.y + 'px', height: selection.size + 'px', width: selection.size + 'px'}"></div>
            <canvas ref="canvas" v-bind:width="canvas.width" v-bind:height="canvas.height"></canvas>
        </div>
        <form method="post" enctype="multipart/form-data">
            <label id="img-file-label"><span>Choose</span> image to upload<input type="file" id="img-file" @change="validate" ref="img_file" accept=".png, .jpg, .jpeg"></label>
            <label id="resolution-warning" class="warning" v-if="warning.res">Selected file is too small. Minimal size is 184x184.</label>
            <label id="ext-warning" class="warning" v-if="warning.ext">Selected file is in wrong format. Only .png and .jpg accepted.</label>
            <label id="img-source-label">
                <input type="text" id="img-source" name="img-source" placeholder="Source" data-tooltip="Some text" data-tooltip-position="bottom"/>
                <span class="tooltip">Include source like link to original art, name of the author and/or art piece</span>
            </label>
            <label><input type="button" id="img-download" @click="download" value="Download"/> the cropped image</label>
            <label id="download-nofile" class="warning" v-if="warning.down_nofile">Selected the file first.</label>
            <label>Or <input type="button" id="img-upload" @click="upload" value="Upload"/> for everyone to see!</label>
            <label id="upload-nofile" class="warning" v-if="warning.up_nofile">Selected the file first.</label>
            <label class="upload-status success" v-if="success.up">Success! Uploaded <router-link :to="'/avatar/' + upload_response">here</router-link>.</label>
            <label class="upload-status warning" v-if="warning.up_fail">Failed. {{ upload_response }}. Try again later.</label>
        </form>
    </div>
</template>

<script>
    import scripts from '../script';

    export default {
        name: "upload",
        data: function () {
            return {
                img_source: "",
                warning: {
                    res: false,
                    ext: false,
                    down_nofile: false,
                    up_nofile: false,
                    up_fail: false,
                },
                success: {
                    up: false
                },
                upload_response: '',
                mouse: {
                    position: {
                        x: 0,
                        y: 0
                    },
                    move: false,
                    down: false
                },
                canvas: {
                    width: 184,
                    height: 184,
                    scale: 1,
                },
                selection: {
                    position: {
                        x: 0,
                        y: 0
                    },
                    size: 184,
                    min: 184,
                    max: 600,
                },
            }
        },
        mounted() {
            document.querySelector('#selection').grabbable = false;
        },
        methods: {
            validate: async function () {
                this.resetWarns();
                const response = await scripts.validate_image(this.$refs.img_file);

                if (response.success) {
                    this.drawCanvas(response.context);
                    document.querySelector('#selection').style.display = 'inherit';
                } else {
                    this.warning[response.context] = true;
                }
            },
            resetWarns: function() {
                Object.keys(this.warning).forEach((key) => {
                    this.warning[key] = false;
                });
                Object.keys(this.success).forEach((key) => {
                    this.success[key] = false;
                });
            },
            drawCanvas: function (image) {
                let canvas = this.$refs.canvas;
                let ctx = canvas.getContext('2d');

                this.canvas.scale = Math.max(image.width / 800, image.height / 600);
                if (this.canvas.scale < 1) {
                    this.canvas.scale = 1;
                }
                this.selection.min = Math.floor(184 / this.canvas.scale);
                this.selection.max = Math.min(image.height, image.width);

                //add meaningful resolve/reject... maybe?
                let promise = new Promise((resolve) => {
                    this.canvas.width = Math.floor(image.width / this.canvas.scale);
                    this.canvas.height = Math.floor(image.height / this.canvas.scale);
                    resolve(true);
                });

                promise.then(() => {
                    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.canvas.width, this.canvas.height);
                });

            },
            selected: function (event) {
                this.mouse.position.x = event.clientX;
                this.mouse.position.y = event.clientY;
                this.mouse.down = true;
                this.mouse.move = true;

                //both don't do what expected
                this.$root.$el.addEventListener('mouseup', () => {
                    this.mouse.down = false;
                    this.mouse.move = false;
                }, {once: true});
                window.addEventListener('mouseleave', () => {
                    this.mouse.down = false;
                    this.mouse.move = false;
                }, {once: true});
            },
            move: function (event) {
                if (!(this.mouse.down && this.mouse.move)) {
                    return false;
                }

                const currentPosition = {
                    x: event.clientX,
                    y: event.clientY
                };

                const target = {
                    x: this.selection.position.x + (currentPosition.x - this.mouse.position.x),
                    y: this.selection.position.y + (currentPosition.y - this.mouse.position.y)
                };

                if (target.x < 0) {
                    target.x = 0;
                } else if (target.x > this.canvas.width - this.selection.size) {
                    target.x = this.canvas.width - this.selection.size;
                }

                if (target.y < 0) {
                    target.y = 0;
                } else if (target.y > this.canvas.height - this.selection.size) {
                    target.y = this.canvas.height - this.selection.size;
                }

                this.selection.position.x = target.x;
                this.selection.position.y = target.y;

                this.mouse.position.x = currentPosition.x;
                this.mouse.position.y = currentPosition.y;
            },
            lastMove: function (event) {
                this.move(event);
                this.mouse.move = false;
            },
            resize: function (event) {
                const direction = (event.deltaY < 0) ? (1) : (-1);
                let size = this.selection.size * (20 + direction) / 20;

                if (size < this.selection.min) {
                    size = this.selection.min;
                } else if (size > this.selection.max) {
                    size = this.selection.max;
                } else {
                    const difference_x = this.canvas.width - this.selection.position.x;
                    const difference_y = this.canvas.height - this.selection.position.y;

                    if (difference_x < difference_y) {
                        if (size > difference_x) {
                            size = difference_x;
                        }
                    } else {
                        if (size > difference_y) {
                            size = difference_y;
                        }
                    }
                }
                this.selection.size = size;
            },
            crop: function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const image = new Image();
                image.src = window.URL.createObjectURL(this.$refs.img_file.files[0]);

                canvas.width = 256;
                canvas.height = 256;

                return new Promise((resolve) => {
                    image.addEventListener('load', () => {
                        ctx.drawImage(image, Math.floor(this.selection.position.x * this.canvas.scale), Math.floor(this.selection.position.y * this.canvas.scale),
                            Math.floor(this.selection.size * this.canvas.scale), Math.floor(this.selection.size * this.canvas.scale),
                            0, 0, 256, 256);
                        resolve(canvas);
                    }, { once: true });
                })
            },
            download: async function () {
                this.resetWarns();
                const file = this.$refs.img_file.files;
                if (file.length !== 1) {
                    this.warning.down_nofile = true;
                    return false;
                }

                const canvas = await this.crop();
                const link = document.createElement('a');
                link.href = canvas.toDataURL();
                link.download = "test.png";
                link.click();
            },
            upload: async function() {
                this.resetWarns();
                const file = this.$refs.img_file.files;
                console.log(file);
                if (file.length !== 1) {
                    this.warning.up_nofile = true;
                    return false;
                }

                const canvas = await this.crop();

                let form = new FormData();
                form.append('image', canvas.toDataURL());
                form.append('source', document.querySelector('#img-source').value);

                window.fetch('/api/upload', {
                    method: 'POST',
                    body: form
                }).then(response => {
                    if (response.status === 200) {
                        this.success.up = true;
                        this.upload_response = response.statusText;
                    } else {
                        this.warning.up_fail = true;
                        this.upload_response = response.statusText;
                    }
                    console.log(response);
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    $border-color: 3px solid #62738b;

    #upload {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 0 auto;
    }

    form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
    }

    form > * {
        margin: 0 0 5px;
    }

    form > #upload-success {
        color: #50931c;
    }

    #img-file {
        display: none;
    }

    #img-source {
        padding: 2px;
        background: none;
        border: $border-color;
        border-radius: 5px;
        color: #b8b6b4;
        cursor: help;
    }

    #img-source::placeholder {
        color: #b8b6b4;
    }

    #img-source:focus {
        cursor: auto;
        outline: none;
        border: 3px solid #55648b;
    }

    #img-source-label {
        display: flex;
        flex-direction: column;
        position: relative;
    }

    #img-source-label > .tooltip {
        visibility: hidden;
        opacity: 0;
        background-color: black;
        color: #fff;
        border-radius: 6px;
        padding: 3px;
        position: absolute;
        top: 31px;
        z-index: 1;
    }

    #img-source-label:hover .tooltip {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.2s linear 0.5s;

    }

    #preview {
        position: relative;
        margin: 0 auto 15px;
        min-width: 184px;
        min-height: 184px;
        width: max-content;
        height: max-content;
        border: $border-color;
    }

    #preview > img {
        -webkit-user-drag: none;
        user-select: none;
        max-width: 800px;
        max-height: 600px;
    }

    #selection {
        display: none;
        position: absolute;
        margin: 0;
        padding: 0;
        width: 184px;
        height: 184px;
        border: 3px solid red;
        box-sizing: border-box;
    }

    #selection:hover {
        cursor: grab;
    }

    .warning {
        color: #b5100a;
    }

    .success {
        color: #389618;
    }

    #img-file-label span {
        padding: 0;
        border: none;
        background: none;
        font-weight: 700;
        color: #8b9eb8;
        cursor: pointer;
    }
</style>