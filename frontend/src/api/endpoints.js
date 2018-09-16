import { ROOT_API } from '../configs/config'
import { buildURLQueryFromRoute } from '../utils/url'

export const user = {
  login: () => `${ROOT_API}/user/login`,
  register: () => `${ROOT_API}/user/register`,
  profile: (id) => `${ROOT_API}/user/profile/${id}`
}

export const blog = {
  main: () => `${ROOT_API}/blog/main`,
  articles: (route) => `${ROOT_API}/blog/articles${buildURLQueryFromRoute(route)}`,
  articlesFromUser: (userId, route) => `${ROOT_API}/blog/articles-from-user/${userId}${buildURLQueryFromRoute(route)}`,
  articleCreate: () => `${ROOT_API}/blog/article`,
  articleUpdate: (id) => `${ROOT_API}/blog/article/${id}`,
  articleDelete: (id) => `${ROOT_API}/blog/article/${id}`,
  article: ({ params: { id } }) => `${ROOT_API}/blog/article/${id}`
}
