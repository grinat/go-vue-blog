import { DOMAIN, DOMAIN_IN_CONTAINER } from "../configs/config"
import { USER_DATA } from "../store/state"

export function prepareInitialState (state) {
  // get data from local storage
  const userData = localStorage.getItem(USER_DATA) ? JSON.parse(localStorage.getItem(USER_DATA)) : null
  // if exist data in cookies and in storage
  if (userData && state._userData && userData.id && state._userData.id && userData.id == state._userData.id) {
    state._userData = Object.assign({}, state._userData, userData)
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
