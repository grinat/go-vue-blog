import Vue from 'vue'
import Router from 'vue-router'

import MainLayout from '../common/layout/main-layout'

import AppError from '../app/app/Error'

import BlogHome from '../app/blog/Home'

Vue.use(Router)

export function createRouter() {
  let RouterInstance = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'is-active',
    routes: [
      {
        path: '/app', name: 'app', component: MainLayout,
        children: [
          {path: 'error', name: 'error', component: AppError}
        ]
      },
      {
        path: '/', name: 'blog', component: MainLayout,
        children: [
          {path: 'blog/home', alias: '', name: 'blog.home', component: BlogHome}
        ]
      },
      {path: '*', redirect: {path: '/'}}
    ]
  })

  RouterInstance.replace = function (location, onComplete, onAbort) {
    // notify hooks about replace call
    this.isReplace = true
    // in hooks use this.$router.isReplace
    Router.prototype.replace.call(this, location, onComplete, onAbort)
    // after call unset flag
    this.isReplace = false
  }

  return RouterInstance
}
