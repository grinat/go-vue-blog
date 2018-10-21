<template>
  <div class="blog article-update">
    <div class="card">
      <g-form
        @submit="onSubmit"
        @remove="deleteItem"
        :showRemoveBtn="!!$route.params.id"
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
          type="fullHtmlEditor"
        ></g-field>

        <g-field
          :model="form"
          label="Show on main page"
          name="onMainPage"
          type="checkbox"
        ></g-field>

        <g-field
          :model="form"
          label="Exclude from articles list"
          name="excludeFromArticlesList"
          type="checkbox"
        ></g-field>

        <g-field
          :model="form"
          label="Is draft"
          name="isDraft"
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
        onMainPage: false,
        excludeFromArticlesList: false,
        disableHTMLEditor: false,
        isDraft: false
      }
    }),
    methods: {
      deleteItem () {
        let id = this.$route.params.id
        this.$store.dispatch('deleteModel', {
          url: blog.articleDelete(id),
          ids: [id]
        }).then(r => {
          this.$router.push({ name: 'user.profile', params: { id: this.$store.getters.userData.id } }, () => {
            this.$store.commit('snackMessage', { message: 'Removed', type: 'success' })
          })
        }).catch(e => {
          this.$store.commit('snackMessage', { message: e })
        })
      },
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
          data: this.form
        }).then(({ data: { id, slug } }) => {
          this.$router.push({ name: 'blog.article', params: { id, slug } })
        }).catch(e => {
          if (this.$refs.form) {
            this.$refs.form.handleServerError(e)
          } else {
            this.$store.commit('snackMessage', { message: e })
          }
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
