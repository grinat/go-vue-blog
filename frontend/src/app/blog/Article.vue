<template>
  <div class="blog article">
    <div class="card">
      <div class="card-content">
        <h1 class="title">{{item.title}}</h1>
        <div v-html="item.description"></div>
        <hr>
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img :src="item.createdUser.avatar" :alt="item.createdUser.name">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">
              <router-link
                :to="{name: 'user.profile', params: { id: item.createdBy }}"
              >
                {{item.createdUser.name}}
              </router-link>
            </p>
            <p class="subtitle is-6">{{item.lastUpdated | fromNow}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { blog } from "../../api/endpoints"

  export default {
    name: 'article-view',
    title () {
      return this.item.title
    },
    methods: {
      getEndpoint (route) {
        return blog.article(route)
      }
    },
    computed: {
      item () {
        return this.$store.getters.readUrlEndpoint(
          this.getEndpoint(this.$route)
        )
      }
    },
    asyncData ({ store, route, fromRoute, methods }) {
      const endpoint = methods.getEndpoint(route)
      return store.dispatch('updateUrlEndpoint', {
        endpoint
      })
    }
  }
</script>
