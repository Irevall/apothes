import Vue from 'vue'
import Router from 'vue-router'

import home from '../components/home.vue'
import upload from '../components/upload.vue'
import about from '../components/about.vue'
import avatar from '../components/avatar.vue'
import dashboard from '../components/dashboard.vue'
import not_found from '../components/not_found.vue'

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
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: dashboard
        },
        {
            path: '/404',
            name: 'not_found',
            component: not_found
        },
        {
            path: '*',
            redirect: '/404'
        },
    ]
})