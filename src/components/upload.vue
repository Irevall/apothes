<template>
    <div id="upload">
        <div id="preview">
            <div v-on:mousedown="selection" id="selection"></div>
            <img v-bind:src="img_source"/>
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
                }
            }
        },
        methods: {
            validate: async function() {
                const response = await scripts.validate_image(this.$refs.img_file);
                Object.keys(this.wrong).forEach((key) => {
                   this.wrong[key] = false
                });
                if (response.success) {
                    this.img_source = response.context;
                    document.querySelector('#selection').style.display = 'inherit';
                } else {
                    this.img_source = '';
                    this.wrong[response.context] = true;
                }
            },
            download: function() {
            //     const file = this.$refs.img_file.files;
            //
            //     if (!file) {
            //         console.log('no file');
            //         return false;
            //     }
            },
            selection: function(event) {
                const initial = {
                    x: event.clientX,
                    y: event.clientY
                };

                console.log(event);
                scripts.select_image(initial);
            },
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

    .warning {
        color: #b5100a;
    }
</style>