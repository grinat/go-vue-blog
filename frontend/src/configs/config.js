export const USER_DATA = 'USER_DATA'
export const CACHE_TIME = 15000

export const DOMAIN = function () {
  if ( process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') {
    if (typeof window !== "undefined") {
      return window.location.origin
    }
    return ''
  } else {
    return 'http://localhost:9050'
  }
}()

export const DOMAIN_IN_CONTAINER = 'http://go-vue-blog.api:9050'

export const ROOT_API = function () {
  if (typeof window !== "undefined") {
    return `${DOMAIN}/api`
  }
  return `${DOMAIN_IN_CONTAINER}/api`
}()
