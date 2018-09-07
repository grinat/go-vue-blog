import Vue from 'vue'
import Router from 'vue-router'

import MainLayout from '../common/layout/main-layout'

import AppError from '../app/app/Error'

import BlogHome from '../app/blog/Home'
import BlogArticles from '../app/blog/Articles'
import BlogArticle from '../app/blog/Article'
import BlogArticleUpdate from '../app/blog/ArticleUpdate'

import UserLogin from '../app/user/Login'
import UserRegister from '../app/user/Register'

Vue.use(Router)

export function createRouter () {
  let RouterInstance = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'is-active',
    routes: [
      {
        path: '/app',
        name: 'app',
        component: MainLayout,
        children: [
          { path: 'error', name: 'error', component: AppError }
        ]
      },
      {
        path: '/',
        name: 'blog',
        component: MainLayout,
        children: [
          { path: '', name: 'blog.home', component: BlogHome },
          { path: 'blog/articles', name: 'blog.articles', component: BlogArticles },
          { path: 'blog/article-create', name: 'blog.article.create', component: BlogArticleUpdate, meta: { needRoles: ['admin'] } },
          { path: 'blog/article-update/:id', name: 'blog.article.update', component: BlogArticleUpdate, meta: { needRoles: ['admin'] } },
          { path: 'blog/:id-:slug', name: 'blog.article', component: BlogArticle }
        ]
      },
      {
        path: '/user',
        name: 'user',
        component: MainLayout,
        children: [
          { path: 'login', name: 'user.login', component: UserLogin, meta: { needRoles: ['guest'] } },
          { path: 'register', name: 'user.register', component: UserRegister, meta: { needRoles: ['guest'] } }
        ]
      },
      {
        path: '*',
        redirect: { name: 'blog.home' }
      }
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
