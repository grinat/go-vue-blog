<template>
  <div class="article-update">
    <div class="card">
      <g-form
        @submit="onSubmit"
        :actionTitle="this.$route.params.id ? 'Update' : 'Create'"
        ref="form"
      >
        <g-field
          :model="form"
          label="Title"
          name="title"
          validate="required|min:1"
        ></g-field>

        <g-field
          :model="form"
          label="Description"
          name="description"
          validate="required|min:10"
          type="textarea"
        ></g-field>

        <g-field
          :model="form"
          label="Show on main page"
          name="onMainPage"
          type="checkbox"
        ></g-field>

      </g-form>
    </div>
  </div>
</template>

<script>
  import { blog } from '../../api/endpoints'

  export default {
    name: 'article-update',
    title () {
      return this.$route.params.id
        ? 'Update article'
        : 'Create article'
    },
    data: () => ({
      form: {
        title: '',
        description: '',
        onMainPage: false
      }
    }),
    methods: {
      getEndpoint (route) {
        return blog.article(route)
      },
      onSubmit () {
        this.$store.dispatch(this.$route.params.id
          ? 'updateModel'
          : 'createModel', {
          action: 'prepend',
          url: this.$route.params.id
            ? blog.articleUpdate(this.$route.params.id)
            : blog.articleCreate(),
          endpoint: blog.articles(),
          id: this.$route.params.id,
          modelEndpointFunc: ({ data: { id } }) => blog.article({ params: { id } }),
          data: this.form
        }).then(({ data: { id, slug } }) => {
          this.$router.push({ name: 'blog.article', params: { id, slug } })
        }).catch(e => {
          this.$refs.form.handleServerError(e)
        })
      }
    },
    computed: {
      item () {
        return this.$store.getters.readUrlEndpoint(
          this.getEndpoint(this.$route)
        )
      }
    },
    created () {
      if (this.$route.params.id) {
        this.form = Object.assign({}, this.item)
      }
    },
    asyncData ({ store, route, fromRoute, methods }) {
      const endpoint = methods.getEndpoint(route)
      return route.params.id
        ? store.dispatch('updateUrlEndpoint', { endpoint })
        : Promise.resolve(true)
    }
  }
</script>
