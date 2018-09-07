import Vue from 'vue'
import App from './app/app/App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import Buefy from 'buefy'
import VeeValidate from 'vee-validate'
import CommonComponents from './common/components.js'
import Components from './components/components'
import headerMixin from './mixins/header-mixin.js'

Vue.use(Buefy)
Vue.use(VeeValidate)
Vue.use(CommonComponents)
Vue.use(Components)
Vue.mixin(headerMixin)

export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
    router,
    store
  }
}
