import {getRouteCopy} from "./url";

export function handleRenderError({err, vm, info, store}) {
  store.commit('mutateError', {
    response: {
      status: 100,
      statusText: 'Render error',
      message: info.toString()
    }
  })
}

export function handleAccessError({store, from, to, next}) {
  if (store.getters.isGuest) {
    store.commit('userSetRedirectUrl', getRouteCopy(to))
    next({name: 'user.login'})
    store.commit('snackMessage', 'Need login')
  } else {
    next({name: 'blog.home'})
    store.commit('snackMessage', 'You are already authorized')
  }
}

export function handleRouteError({store, router, error}) {
  let msg = 'Navigation error '
  let from = ''
  let to = ''
  if (router.history.pending && router.history.pending.name) {
    to = router.history.pending.name
    msg += ' to ' + to
  }
  if (router.history.current && router.history.current.name) {
    from = router.history.current.name
    msg += ' on ' + from
  }
  msg += '<br>' + error.toString()
  store.commit('mutateError', new Error(msg))
  // if use chunk - redirect
  // router.push({name: 'error'})
}
