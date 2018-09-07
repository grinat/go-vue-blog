import { DOMAIN, DOMAIN_IN_CONTAINER } from "../configs/config"
import { USER_DATA } from "../store/state"

export function prepareInitialState (state) {
  // set user from store
  const userData = localStorage.getItem(USER_DATA) ? JSON.parse(localStorage.getItem(USER_DATA)) : null
  if (userData) {
    state._userData = userData
  }

  // replace domains
  let keys = ['endpoints', 'cache']
  keys.forEach(storeKey => {
    for (let key in state[storeKey]) {
      let replacedKey = key.replace(DOMAIN_IN_CONTAINER, DOMAIN)
      state[storeKey][replacedKey] = state[storeKey][key]
      delete state[storeKey][key]
    }
  })

  return state
}
