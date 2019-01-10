<template>
    <div id="upload">
        <div id="preview" @mouseleave="lastMove" @mousemove="move">
            <div id="selection" @mousedown="selected" @wheel="resize" @mouseenter="mouse.move = true" v-bind:style="{ left: selection.position.x + 'px', top: selection.position.y + 'px', height: selection.size + 'px', width: selection.size + 'px'}"></div>
            <canvas ref="canvas" v-bind:width="canvas.width" v-bind:height="canvas.height"></canvas>
        </div>
        <form method="post" enctype="multipart/form-data">
            <label id="img-file-label"><span>Choose</span> image to upload (.png) <input type="file" id="img-file" @change="validate" ref="img_file" accept=".png, .jpg, .jpeg"></label>
            <label id="resolution-warning" class="warning" v-if="wrong.res">Selected file appears to be too small. Minimal size is 184x184.</label>
            <label id="ext-warning" class="warning" v-if="wrong.ext">Selected file appears to be in wrong format. Only .png accepted.</label>
            <label id="img-source-label">
                <input type="text" id="img-source" name="img-source" placeholder="Source" data-tooltip="Some text" data-tooltip-position="bottom"/>
                <span class="tooltip">Include source like link to original art, name of the author and/or art piece</span>
            </label>
            <label><input type="button" id="img-download" v-on:click="download" value="Download"/> the cropped image</label>
            <label>Or <input type="button" id="img-upload" value="Upload"/> for everyone to see!</label>
            <label id="upload-nofile" class="warning" v-if="wrong.ext">Selected file appears to be in wrong format. Only .png accepted.</label>
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
                wrong: {
                    res: false,
                    ext: false
                },
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
        methods: {
            validate: async function() {
                const response = await scripts.validate_image(this.$refs.img_file);
                Object.keys(this.wrong).forEach((key) => {
                   this.wrong[key] = false
                });
                if (response.success) {
                    this.drawCanvas(response.context);
                    document.querySelector('#selection').style.display = 'inherit';
                } else {
                    this.wrong[response.context] = true;
                }
            },
            drawCanvas: function(image) {
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

                // this.canvas.width = Math.floor(image.width / this.canvas.scale);
                // this.canvas.height = Math.floor(image.height / this.canvas.scale);
                // canvas.width = Math.floor(image.width / this.canvas.scale);
                // canvas.height = Math.floor(image.height / this.canvas.scale);

                promise.then(() => {
                    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, this.canvas.width, this.canvas.height);
                });

            },
            download: function() {
            //     const file = this.$refs.img_file.files;
            //
            //     if (!file) {
            //         console.log('no file');
            //         return false;
            //     }
            },
            selected: function(event) {
                this.mouse.position.x = event.clientX;
                this.mouse.position.y = event.clientY;
                this.mouse.down = true;
                this.mouse.move = true;

                //both don't do what expected
                this.$root.$el.addEventListener('mouseup', () => {
                    this.mouse.down = false;
                    this.mouse.move = false;
                }, { once: true });
                window.addEventListener('mouseleave', () => {
                    this.mouse.down = false;
                    this.mouse.move = false;
                }, { once: true });
            },
            move: function(event) {
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
            lastMove: function(event) {
                this.move(event);
                this.mouse.move = false;
            },
            resize: function(event) {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    $border-color: 3px solid #425066;

    #upload {
        display: flex;
        flex-direction: column;
        max-width: max-content;
        margin: 50px auto 0;
    }

    form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
    }

    form > * {
        margin: 0 0 5px;
    }

    form > p {
        display: none;
        font-weight: bold;
        color: #aa2112;
    }

    form > #upload-success {
        color: #50931c;
    }

    #img-file {
        display: none;
    }

    form input[type=button], #img-file-label span {
        padding: 0;
        border: none;
        background: none;
        font-weight: bolder;
        color: #8b9eb8;
        cursor: pointer;
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
        border: 3px solid #62738b;
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

    canvas {
        /*width: 184px;*/
        /*height: 184px;*/
    }

    .warning {
        color: #b5100a;
    }
</style>