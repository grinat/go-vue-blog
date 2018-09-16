<template>
  <div class="home">
    <div class="card">
      <div
        class="card-content"
      >
        <div class="media">
          <div class="media-left">
            <figure class="image is-96x96">
              <img src="https://bulma.io/images/placeholders/96x96.png" :alt="item.name">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{item.name}}</p>
            <p class="is-6">{{item.email}}</p>
            <p class="is-6">{{item.role}}</p>
          </div>
        </div>
      </div>
    </div>

    <b-table
      class="card"
      :data="articlesFromUserData"
      :default-sort-direction="articlesFromUserTable.defaultSortOrder"
      :default-sort="[articlesFromUserTable.sortField, articlesFromUserTable.sortOrder]"
      @sort="onSort"
      backend-sorting
    >
      <template slot-scope="props">
        <b-table-column field="title" label="Title" sortable>
          {{props.row.title}}
        </b-table-column>
        <b-table-column field="lastUpdated" label="Last Updated" sortable>
          {{props.row.lastUpdated}}
        </b-table-column>
        <template v-if="userCanEdit">
          <b-table-column field="isDraft" label="Draft" sortable>
            {{props.row.isDraft ? 'yes' : 'no'}}
          </b-table-column>
          <b-table-column field="onMainPage" label="On main page" sortable>
            {{props.row.onMainPage ? 'yes' : 'no'}}
          </b-table-column>
          <b-table-column field="excludeFromArticlesList"  label="Excluded" sortable>
            {{props.row.excludeFromArticlesList ? 'yes' : 'no'}}
          </b-table-column>
        </template>
        <b-table-column field="actions" label="Actions">
          <router-link
            :to="{name: 'blog.article', params: {id: props.row.id, slug: props.row.slug}}"
          >
            Open
          </router-link>
          <router-link
            v-if="userCanEdit"
            :to="{name: 'blog.article.update', params: {id: props.row.id}}"
          >
            Edit
          </router-link>
        </b-table-column>
      </template>
    </b-table>

    <g-pagination
      v-if="articlesFromUser"
      :meta="articlesFromUser._meta"
    ></g-pagination>

  </div>
</template>

<script>
  import {blog, user} from "../../api/endpoints"
  import {getRouteCopy} from "../../utils/url"

  export default {
    name: "Profile",
    title: 'Profile',
    data: () => ({
      articlesFromUserTable: {
        sortField: 'id',
        sortOrder: 'desc',
        defaultSortOrder: 'desc'
      }
    }),
    computed: {
      item () {
        return this.$store.getters.readUrlEndpoint(
          this.getEndpoint(this.$route)
        )
      },
      articlesFromUser () {
        return this.$store.getters.readUrlEndpoint(
          this.getArticlesFromUserEndpoint(this.$route)
        )
      },
      userCanEdit () {
        return this.$store.getters.isAdmin || (this.$store.getters.isGuest === false && this.$route.params.id === this.$store.getters.userData.id)
      },
      articlesFromUserData () {
        return this.articlesFromUser.data || []
      }
    },
    created () {
      this.setSortFromUrl()
    },
    methods: {
      setSortFromUrl () {
        if (this.$route.query.sort) {
          let sortData = this.$route.query.sort.split('-')
          this.articlesFromUserTable.sortOrder = sortData.length > 1 ? 'desc' : 'asc'
          this.articlesFromUserTable.sortField = sortData[1] || sortData[0]
        }
      },
      onSort (field, dir) {
        const route = getRouteCopy(this.$route)
        route.query.sort = `${dir === 'desc' ? '-' : ''}${field}`
        this.$router.push(route)
      },
      getEndpoint ({ params: { id } }) {
        return user.profile(id)
      },
      getArticlesFromUserEndpoint (route) {
        return blog.articlesFromUser(route.params.id, route)
      }
    },
    asyncData ({ store, route, fromRoute, methods }) {
      const endpoints = [
        methods.getEndpoint(route),
        methods.getArticlesFromUserEndpoint(route)
      ]
      return Promise.all(
        endpoints.map(
          endpoint => store.dispatch('updateUrlEndpoint', {
            endpoint
          })
        )
      )
    }
  }
</script>
