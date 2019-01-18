<template>
    <div id="app">
        <nav>
            <router-link to="/"><img class="logo" src="./assets/temp_logo6.png" alt="Logo"/></router-link>
            <router-link to="/upload">Upload</router-link>
            <router-link to="/about">About</router-link>
        </nav>
        <router-view/>
    </div>

</template>

<script>
    export default {
        name: "App"
    }
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:600,700');
    @import '~normalize.css/normalize.css';

    body {
        font-family: 'Open Sans', sans-serif;
        background-color: #1b2838;
        color: #bfbdbb;
        font-weight: 600;
    }

    input[type=button], a {
        text-decoration: none;
        padding: 0;
        border: none;
        background: none;
        font-weight: 700;
        color: #8b9eb8;
        cursor: pointer;
    }

    #app {
        min-width: 100%;
        min-height: 100%;
    }

    nav {
        display: flex;
        background-color: #171a21;
        font-size: 1.9em;
        height: 50px;
        padding: 8px 0;
        border-bottom: black 2px solid;
        margin-bottom: 60px;
    }

    nav > a {
        display: flex;
        padding: 0;
        margin-right: 50px;
        width: max-content;
        height: 100%;
        align-items: center;
        color: #bfbdbb;
    }

    nav > a:first-of-type {
        margin-left: 60px;
    }

    .logo {
        margin-top: 5px;
        max-height: 70%;
    }

</style>