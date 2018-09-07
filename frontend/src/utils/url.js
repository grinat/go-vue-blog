export function buildURLQueryFromRoute (route = {}) {
  let { query = {} } = route
  let url = ''
  for (let key in query) {
    if (query[key] === "undefined") {
      continue
    }
    url += url.length > 0 ? '&' : '?'
    if (Array.isArray(query[key])) {
      query[key].forEach(v => {
        url += key + '[]=' + v + '&'
      })
    } else if (typeof query[key] === 'object') {
      for (let objKey in query[key]) {
        url += key + '[' + objKey + ']=' + query[key][objKey] + '&'
      }
    } else {
      url += key + '=' + query[key]
    }
  }
  return url
}

export function getRouteCopy (route = {}) {
  let { name = '', params = {}, query = {} } = route
  return {
    name,
    params: Object.assign({}, params),
    query: Object.assign({}, query)
  }
}
