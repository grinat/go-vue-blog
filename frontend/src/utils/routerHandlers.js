import { handleAccessError } from './errorHandlers'

// executes async data function
// in component and nested mixins
// on route change
export function routerHandlers (c, { store, from, to }) {
  let methods = Object.create(null) // c.methods
  if (c.mixins) {
    c.mixins.forEach((mixin) => {
      // TODO: go deepy get from mixin.mixins.forEach...
      if (mixin.methods) {
        for (let name in mixin.methods) {
          methods[name] = mixin.methods[name]
        }
      }
    })
  }
  if (c.methods) {
    for (let name in c.methods) {
      methods[name] = c.methods[name]
    }
  }
  if (c.asyncData) {
    return c.asyncData({ store, route: to, fromRoute: from, methods, ctx: c })
  } else if (c.mixins) {
    let last = null
    c.mixins.forEach((mixin) => {
      if (mixin.asyncData) {
        last = mixin.asyncData({ store, route: to, fromRoute: from, methods, ctx: c })
      }
    })
    if (last !== null) {
      return last
    }
  }
  return Promise.resolve(true)
}

// called Before Each route
// check user access to new routes and etc...
export function handleBeforeEach (to, from, next, store) {
  if (to.meta && to.meta.accessHandler) {
    to.meta.accessHandler({ store, from, to, next })
  } else if (to.meta && to.meta.needRoles) {
    if (to.meta.needRoles.indexOf(store.getters.userRole) > -1) {
      next()
    } else {
      const onAccessError = to.meta && to.meta.onAccessError ? to.meta.onAccessError : handleAccessError
      onAccessError({ store, from, to, next })
    }
  } else {
    next()
  }
}

export function handleOwnerAccess ({ store, from, to, next }) {
  if (store.getters.isGuest === false && (store.getters.userRole === 'admin' || store.getters.userData.id === to.params.id)) {
    next()
  } else {
    next({ name: 'blog.home' })
    store.commit('snackMessage', { message: 'Access denied' })
  }
}

// Add router hook for handling asyncData
export function attachBeforeResolve ({router, store, bar}) {
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
}

export function installRouterMixins (vm, {bar}) {
  // a global mixin that calls `asyncData` when a route component's params change
  vm.mixin({
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
}
