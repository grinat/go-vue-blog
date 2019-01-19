import Vue from 'vue'
import { createApp, createInjectors } from './app'
import { attachBeforeResolve, handleBeforeEach, installRouterMixins } from './utils/routerHandlers'
import ProgressBar from './components/progress/progress'
import Snack from './components/snack/snack'
import VueGlobalEmitter from 'vue-global-emitter'
import { handleRenderError, handleRouteError } from "./utils/errorHandlers"
import { prepareInitialState } from "./utils/prepareInitialState"
import componentsClient from './components/components-client'
import 'buefy/lib/buefy.css'
import './assets/style/main.scss'

Vue.use(VueGlobalEmitter, { debug: true })
Vue.use(componentsClient)

const { router, store } = createInjectors()

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

// install mixins which called asycndata and etc
installRouterMixins(Vue, {bar})

router.onError(error => handleRouteError({ error, router, store }))

router.beforeEach((to, from, next) => handleBeforeEach(to, from, next, store))

if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = (err, vm, info) => handleRenderError({ err, vm, info, store })
}

Vue.config.productionTip = false
Vue.config.devtools = true

if (process.env.NODE_ENV === 'development') {
  // Add router hook for handling asyncData.
  attachBeforeResolve({store, router, bar})

  createApp({store, router}).$mount('#app')
} else {
  // create app
  const app = createApp({store, router})

  // wait until router has resolved all async before hooks
  // and async components...
  router.onReady(() => {
    // Add router hook for handling asyncData.
    // Doing it after initial route is resolved so that we don't double-fetch
    // the data that we already have. Using router.beforeResolve() so that all
    // async components are resolved.
    attachBeforeResolve({store, router, bar})

    // mount with replace rendered content
    app.$mount('#app')
  })
}
