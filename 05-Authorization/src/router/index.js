import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import Admin from '@/components/Admin'
import Ping from '@/components/Ping'
import auth from './../auth/AuthService'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: (to, from, next) => {
        if (!auth.isAuthenticated()) {
          next(false)
        } else {
          next()
        }
      }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        if (!auth.isAuthenticated() || !auth.isAdmin()) {
          next(false)
        } else {
          next()
        }
      }
    },
    {
      path: '/ping',
      name: 'Ping',
      component: Ping
    }
  ]
})
