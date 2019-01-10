import Vue from 'vue'
import Router from 'vue-router'

import home from '../components/home.vue'
import upload from '../components/upload.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
          path: '/',
          name: 'home',
          component: home
        },
        {
            path: '/upload',
            name: 'upload',
            component: upload
        }
    ]
})