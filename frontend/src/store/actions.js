import api from '../api'
import { user } from '../api/endpoints'
import uuid from '../utils/uuid'
import { CACHE_TIME } from '../configs/config'

export default {
  updateUserData: (context) => {
    if (context.getters.isGuest === true) {
      return Promise.resolve(null)
    }
    const endpoint = user.profile(context.getters.userData.id)
    return api.get(
      context.getters.authToken, endpoint, {}, context
    ).then(response => {
      context.commit('userSetAuthData', response.data)
      return response
    }).catch(e => {
      return Promise.reject(e.response)
    })
  },
  updateUrlEndpoint: (context, { url, endpoint, params, cache = CACHE_TIME, offline = false }) => {
    if (offline === true) {
      if (context.state.endpoints[endpoint]) {
        return Promise.resolve({ data: context.state.endpoints[endpoint] })
      }
      const offlineResponse = { data: { data: [] } }
      context.commit('updateCache', { endpoint, cache })
      context.commit('updateEndpoint', { endpoint, response: offlineResponse })
      return Promise.resolve(offlineResponse)
    }

    const currentTime = +new Date()
    const endpointExist = context.state.endpoints[endpoint] && context.state.cache[endpoint]
    if (endpointExist && context.state.cache[endpoint] > currentTime) {
      return Promise.resolve({ data: context.state.endpoints[endpoint] })
    }

    return api.get(
      context.getters.authToken, url || endpoint, params, context
    ).then((response) => {
        if (response) {
          context.commit('updateCache', { endpoint, cache })
          context.commit('updateEndpoint', { endpoint, response })
        }
        return response
      }).catch(e => {
        return Promise.reject(e.response)
    })
  },
  createModel: (context, { url, data, endpoint, cache = CACHE_TIME, params, action = 'append', offline = false }) => {
    if (offline === true) {
      data._storeUUID = uuid.generate()
      const offlineResponse = { data }
      if (endpoint) {
        context.commit('updateEndpoint', { response: offlineResponse, endpoint, action })
        context.commit('updateCache', { endpoint, cache })
      }
      return Promise.resolve(offlineResponse)
    }

    return api.save(
      context.getters.authToken, url, data, params, context
    ).then((response) => {
      if (endpoint) {
        context.commit('updateEndpoint', { response, endpoint, action })
        context.commit('updateCache', { endpoint, cache })
      }
      return response
    }).catch(e => {
      return Promise.reject(e.response || e)
    })
  },
  updateModel: (context, { url, data, id, endpoint, cache = CACHE_TIME, params, action = 'replaceSame', offline = false }) => {
    if (offline === true) {
      if (!data.hasOwnProperty('_storeUUID')) {
        data._storeUUID = uuid.generate()
      }
      const offlineResponse = { data }
      if (endpoint) {
        context.commit('updateEndpoint', { response: offlineResponse, id, endpoint, action: 'replaceSame' })
      }
      return Promise.resolve(offlineResponse)
    }

    return api.update(
      context.getters.authToken, url, data, params, context
    ).then((response) => {
      if (endpoint) {
        context.commit('updateEndpoint', { response, id, endpoint, action: 'replaceSame' })
      }
      return response
    }).catch(e => {
      return Promise.reject(e.response || e)
    })
  },
  deleteModel: (context, { url, endpoint, ids, params, offline = false }) => {
    if (offline === true) {
      if (endpoint) {
        context.commit('deleteModel', { endpoint, ids })
      }
      return Promise.resolve(true)
    }

    return api.delete(
      context.getters.authToken, url, params, context
    ).then((response) => {
      if (endpoint) {
        context.commit('deleteModel', { endpoint, ids })
      }
      return response
    }).catch(e => {
      return Promise.reject(e.response || e)
    })
  }
}
