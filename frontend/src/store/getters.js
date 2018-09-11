export default {
  needReLogin: state => {
    return state._needReLogin
  },
  authToken: (state, getters) => {
    if (getters.userData !== null) {
      return getters.userData.token
    }
    return null
  },
  userData: state => {
    return state._userData || null
  },
  userRole: (state, getters) => {
    if (getters.userData && getters.userData.role) {
      return getters.userData.role
    }
    return 'guest'
  },
  isGuest: (state, getters) => {
    return getters.userRole === 'guest'
  },
  isAdmin: (state, getters) => {
    return getters.userData !== null && getters.userData.role === 'admin'
  },
  redirectUrl: state => {
    return state._redirectUrl
  },
  readUrlEndpoint: state => (endpoint) => {
    return state.endpoints[endpoint] || null
  },
  navbar: state => {
    return state.navbar
  },
  getError: state => {
    return state._error
  }
}
