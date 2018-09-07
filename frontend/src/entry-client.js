import Vue from 'vue'
import { createApp } from './app'
import { handleBeforeEach, routerHandlers } from './utils/routerHandlers'
import ProgressBar from './components/progress/progress'
import Snack from './components/snack/snack'
import VueGlobalEmitter from 'vue-global-emitter'
import { handleRenderError, handleRouteError } from "./utils/errorHandlers"
import { prepareInitialState } from "./utils/prepareInitialState"

import 'buefy/lib/buefy.css'
import './assets/style/main.scss'

Vue.use(VueGlobalEmitter, { debug: true })

const { app, router, store } = createApp()

const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)
const snack = new Vue({ store, render: h => h(Snack) }).$mount()
document.body.appendChild(snack.$el)

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(
    prepareInitialState(
      window.__INITIAL_STATE__
    )
  )
}

// a global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    // skip on router.replace()
    if (this.$router.isReplace) {
      next()
      return
    }

    const { asyncData } = this.$options
    bar.start()
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
        fromRoute: from,
        methods: this,
        ctx: this
      }).then(() => {
        if (to && to.name && to.name !== 'error') {
          this.$store.commit('mutateError', null)
        }
        bar.finish()
        next()
      }).catch(() => {
        bar.finish()
        next()
      })
    } else {
      next()
    }
  }
})

router.onError(error => handleRouteError({ error, router, store }))

router.beforeEach((to, from, next) => handleBeforeEach(to, from, next, store))

if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = (err, vm, info) => handleRenderError({ err, vm, info, store })
}

Vue.config.productionTip = false
Vue.config.devtools = true

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    if (!activated.length) {
      return next()
    }

    bar.start()
    Promise.all(
      activated.map(c => routerHandlers(c, { store, from, to }))
    ).then(() => {
      if (to && to.name && to.name !== 'error') {
        store.commit('mutateError', null)
      }
      bar.finish()
      next()
    }).catch(() => {
      bar.finish()
      next()
    })
  })

  // actually mount to DOM
  app.$mount('#app')
})
