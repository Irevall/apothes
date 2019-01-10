<template>
    <div id="app">
        <nav>
            <router-link to="/"><img class="logo" src="./assets/temp_logo.png" alt="Logo"/></router-link>
            <router-link to="/top">Top</router-link>
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
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600');
    @import '~normalize.css/normalize.css';

    body {
        font-family: 'Open Sans', sans-serif;
        background-color: #1b2838;
        color: #b8b6b4;
    }

    a {
        text-decoration: none;
        color: #b8b6b4;
    }

    nav {
        display: flex;
        background-color: #171a21;
        font-size: 1.7em;
        height: 50px;
        padding: 5px 0 5px 20px;
        border-bottom: black 2px solid;
    }

    nav > a {
        display: flex;
        padding: 0;
        margin-right: 50px;
        width: max-content;
        align-items: center;
        font-weight: bold;

    }

    .logo {
        max-height: 100%;
    }
</style>