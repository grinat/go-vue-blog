import axios from 'axios'
import Vue from 'vue'

axios.defaults.headers['Content-Type'] = 'application/json'
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  let { config = {}, response } = error
  let errorReport = { config, response }
  let { store } = config
  let disableErrorHandler = config.disableGlobalError || false
  if (config.method !== 'get') {
    disableErrorHandler = true
  }
  if (response) {
    // not autorized
    if (+error.response.status === 401) {
      errorReport = null
      store.commit('needReLogin', true)
      store.commit('mutateError', error)
      // forbiden
    } else if (+response.status === 403 && config.method === 'get') {
      disableErrorHandler === false && store.commit('mutateError', error)
    } else if (+response.status !== 422 && config.method === 'get') {
      disableErrorHandler === false && store.commit('mutateError', error)
      // validate post error
    } else if (+response.status === 422 && config.method !== 'get') {
      errorReport = null
    }
  } else if (config && config.method === 'get') {
    disableErrorHandler === false && store.commit('mutateError', error)
  } else {
    disableErrorHandler === false && store.commit('mutateError', error)
  }
  if (errorReport && Vue.prototype.$Rollbar) {
    delete errorReport.config.store
    Vue.prototype.$Rollbar.error(error, {
      config: errorReport.config
    })
  }
  return Promise.reject(error)
})

const STATUS_PENDING = 1
const STATUS_COMPLETED = 2
const queuePromises = {}

export default class api {
  static options (token, params, store) {
    let options = {}
    if (token) {
      options.headers = {
        'Authorization': 'Bearer  ' + token
      }
    }
    if (params) {
      options = {
        ...options,
        ...params
      }
    }
    options.store = store
    return options
  }

  static get (token, url, options = {}, store) {
    let task = queuePromises[url] || { url }
    if (task.status === STATUS_PENDING) {
      task.counter = task.counter + 1
      console.warn('Double get data check that', task)
      return task.promise
    }
    queuePromises[url] = task
    task.status = STATUS_PENDING
    task.counter = 1
    task.promise = new Promise((resolve, reject) => {
      axios.get(url, api.options(token, options, store)).then(r => {
        task.status = STATUS_COMPLETED
        if (r.config && r.config.afterResponseAPI) {
          r.config.afterResponseAPI()
          resolve(r)
        } else {
          resolve(r)
        }
      }).catch(e => {
        task.status = STATUS_COMPLETED
        if (e.config && e.config.afterResponseAPI) {
          e.config.afterResponseAPI()
          reject(e)
        } else {
          reject(e)
        }
      })
    })
    return task.promise
  }

  static post (token, url, data, options = {}, store) {
    return axios.post(url, data, api.options(token, options, store))
  }

  static save (token, url, data, options = {}, store) {
    return axios.post(url, data, api.options(token, options, store))
  }

  static update (token, url, data, options = {}, store) {
    return axios.patch(url, data, api.options(token, options, store))
  }

  static delete (token, url, options = {}, store) {
    return axios.delete(url, api.options(token, options, store))
  }
}
