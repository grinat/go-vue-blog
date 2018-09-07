<template>
  <div class="article">
    <div class="card">
      <div class="card-content">
        <h1 class="title">{{item.title}}</h1>
        <div v-html="item.description"></div>
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
