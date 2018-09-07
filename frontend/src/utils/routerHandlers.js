import { handleAccessError } from './errorHandlers'

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
        last = mixin.asyncData({store, route: to, fromRoute: from, methods, ctx: c})
      }
    })
    if (last !== null) {
      return last
    }
  }
  return Promise.resolve(true)
}

export function handleBeforeEach (to, from, next, store) {
  if (to.meta && to.meta.needRoles) {
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
