<template>
  <div class="articles">
    <template
      v-if="items && items.data && items.data.length"
    >
      <div
        class="card"
        v-for="item in items.data"
        :key="item.id"
      >
        <div
          class="card-content"
          v-if="item"
        >
          <h1 class="title">{{item.title}}</h1>
          <div class="content" v-html="item.description"></div>
        </div>
        <footer class="card-footer">
          <router-link
            class="card-footer-item"
            :to="{name: 'blog.article', params: {id: item.id, slug: item.slug}}"
          >
            Open
          </router-link>
          <router-link
            class="card-footer-item"
            v-if="$store.getters.isAdmin"
            :to="{name: 'blog.article.update', params: {id: item.id}}"
          >
            Edit
          </router-link>
          <a
            class="card-footer-item"
            v-if="$store.getters.isAdmin"
            @click="deleteItem(item)"
          >
            Remove
          </a>
        </footer>
      </div>
    </template>
    <template
      v-else
    >
      <div class="card">
        <div class="card-content">No content</div>
      </div>
    </template>
    <g-pagination
      v-if="items"
      :meta="items._meta"
    ></g-pagination>
  </div>
</template>

<script>
  import { blog } from "../../api/endpoints"

  export default {
    name: 'articles',
    title: 'Articles',
    methods: {
      getEndpoint (route) {
        return blog.articles(route)
      },
      deleteItem ({ id }) {
        this.$store.dispatch('deleteModel', {
          url: blog.articleDelete(id),
          endpoint: blog.articles(this.$route),
          ids: [id]
        }).then(r => {

        }).catch(e => {
          console.error(e)
        })
      }
    },
    computed: {
      items () {
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
