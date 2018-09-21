<template>
  <div class="blog home">
    <div class="card">
      <div
        class="card-content"
        v-if="item"
      >
        <h1 class="title">{{item.title}}</h1>
        <div class="content" v-html="item.description"></div>
      </div>
      <div
        class="card-content"
        v-else
      >
        No content
      </div>
    </div>
  </div>
</template>

<script>
  import { blog } from "../../api/endpoints"

  export default {
    name: 'home',
    title: 'Home',
    methods: {
      getEndpoint () {
        return blog.main()
      }
    },
    computed: {
      item () {
        return this.$store.getters.readUrlEndpoint(
          this.getEndpoint()
        )
      }
    },
    asyncData ({ store, route, fromRoute, methods }) {
      const endpoint = methods.getEndpoint()
      return store.dispatch('updateUrlEndpoint', { endpoint })
    }
  }
</script>
