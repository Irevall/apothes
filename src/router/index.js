import Vue from 'vue'
import Router from 'vue-router'

import home from '../components/home.vue'
import upload from '../components/upload.vue'
import about from '../components/about.vue'
import avatar from '../components/avatar.vue'

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
        },
        {
            path: '/about',
            name: 'about',
            component: about
        },
        {
            path: '/avatar/:id',
            name: 'avatar',
            component: avatar
        }
    ]
})