import Cookies from 'js-cookie'
import { USER_DATA } from '../configs/config'

const findDefaultHandler = (v, id) => {
  if (v && v.hasOwnProperty('id')) {
    return v.id === id
  } else if (v && v.hasOwnProperty('_storeUUID')) {
    return v._storeUUID === id
  }
  return false
}

export default {
  snackMessage: (state, message, type = 'danger', duration = 5000) => {
    state.snackMessage = Object.assign({}, { createdAt: +new Date(), message, type, duration })
  },
  userSetAuthData: (state, data) => {
    state._userData = Object.assign({}, data)
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_DATA, JSON.stringify(data))
      Cookies.set(USER_DATA, JSON.stringify({
        id: data.id,
        token: data.token,
        role: data.role || 'user'
      }), { expires: 365 * 10 })
    }
  },
  userDelAuthData: state => {
    state._userData = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_DATA)
      Cookies.remove(USER_DATA)
    }
  },
  userSetRedirectUrl: (state, route) => {
    state._redirectUrl = Object.assign({}, route)
  },
  needReLogin: (state, val) => {
    state._needReLogin = Object.assign({}, {value: val, createdAt: +new Date()})
  },
  deleteModel: (state, { endpoint, ids = [], findFunc }) => {
    if (state.endpoints[endpoint] && state.endpoints[endpoint].data && Array.isArray(state.endpoints[endpoint].data)) {
      const origin = state.endpoints[endpoint].data.slice()
      const findHandler = findFunc || findDefaultHandler
      origin.forEach((v, i) => {
        ids.forEach(id => {
          if (findHandler(v, id) === true) {
            state.endpoints[endpoint].data.splice(i, 1)
          }
        })
      })
    } else if (state.endpoints[endpoint]) {
      delete state.endpoints[endpoint]
    }
  },
  updateCache: (state, { endpoint, cache = 0 }) => {
    state.cache[endpoint] = +Date.now() + cache
  },
  updateEndpoint: (state, { response, endpoint, action = 'replace', id, findFunc }) => {
    const newData = response.data || { data: [] }
    const endpointsData = Object.assign({}, state.endpoints)

    if (!endpointsData[endpoint]) {
      endpointsData[endpoint] = { data: [], _meta: {} }
    }
    if (action !== 'replace' && !endpointsData[endpoint].data) {
      endpointsData[endpoint].data = []
    }

    const findHandler = findFunc || findDefaultHandler
    console.log('action', action, endpoint)
    switch (action) {
      case 'append':
        endpointsData[endpoint].data.push(newData)
        break
      case 'prepend':
        endpointsData[endpoint].data.unshift(newData)
        break
      case 'replaceSame':
        if (!id) {
          console.warn('Unknown id in ', action)
        }
        const rInd = endpointsData[endpoint].data.findIndex(v => findHandler(v, id))
        if (rInd > -1) {
          endpointsData[endpoint].data[rInd] = newData
        }
        break
      case 'replace':
        endpointsData[endpoint] = newData
        break
      case 'insertAfter':
        if (!id) {
          console.warn('Unknown id in ', action)
        }
        const iInd = endpointsData[endpoint].data.findIndex(v => findHandler(v, id))
        if (iInd > -1) {
          endpointsData[endpoint].data.splice(iInd + 1, 0, ...newData)
        }
        break
    }

    state.endpoints = Object.assign({}, endpointsData)
  },
  updateHeader: (state, values = {}, replace = false) => {
    if (replace === true) {
      state.header = Object.assign({}, {
        title: values.title,
        description: values.description
      })
    } else {
      for (let key in values) {
        state.header[key] = values[key]
      }
    }
    state.header = Object.assign({}, state.header)
  },
  mutateError: (state, error) => {
    if (error === null) {
      state._error = null
    } else {
      let formatError = { title: 'Error', message: '', apiUrl: '', status: 0 }
      if (error && error.response) {
        // http headers
        if (error.response.status) {
          formatError.status = +error.response.status
          formatError.title = error.response.status
        }
        if (error.response.statusText) {
          formatError.title = formatError.title + ' ' + error.response.statusText
        }
        if (error.response.message) {
          formatError.message = error.response.message
        } else {
          formatError.message = error.message
        }
        // yii2 message
        if (error.response.data) {
          if (error.response.data.message) {
            formatError.message = error.response.data.message
          }
        }
        // req params
        if (error.response.request && error.response.request.responseURL) {
          formatError.apiUrl = error.response.request.responseURL
        }
      } else if (error && error.message) {
        formatError.message = error.message
      }

      if (formatError.message === 'Network Error') {
        formatError.message = 'No internet or server connection'
      }
      state._error = Object.assign({}, formatError)
    }
  }
}
