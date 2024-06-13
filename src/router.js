import Vue from 'vue'
import Router from 'vue-router'
import FilesHome from '@/views/FilesHome'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: FilesHome
        }
    ]
})