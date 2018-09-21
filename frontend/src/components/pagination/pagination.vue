<template>
  <div
    class="pagination g-pagination is-centered"
    role="navigation"
    aria-label="pagination"
    v-if="hidePaginate===false"
  >
    <div class="columns">
      <div class="column">
        <router-link
          v-if="prevPage > 0"
          :to="prevRoute"
          class="pagination-previous"
        >Previous</router-link>
      </div>
      <div class="column is-two-thirds">
        <ul class="pagination-list">
          <li v-for="page in pageRange">
            <router-link
              v-if="page !== '...'"
              class="pagination-link"
              :class="{'is-current': currentPage === page}"
              :to="getRouteForPage(page)"
            >{{page}}</router-link>
            <span
              v-else
              class="pagination-ellipsis"
            >&hellip;</span>
          </li>
        </ul>
      </div>
      <div class="column">
        <router-link
          v-if="nextPage > 0 && nextPage <= pageCount"
          :to="nextRoute"
          class="pagination-next"
        >Next page</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { getRouteCopy } from "../../utils/url"

  export default {
    name: 'g-pagination',
    props: {
      meta: {
        type: Object
      },
      maxLinksCount: {
        type: Number,
        default: 7
      },
      hideOnOnePage: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      currentPage: 1
    }),
    watch: {
      $route () {
        this.currentPage = +this.$route.query.page || 1
      }
    },
    computed: {
      hidePaginate () {
        return this.hideOnOnePage === true && this.pageCount <= 1
      },
      nextPage () {
        let page = 0
        if (this.meta) {
          page = 2
        }
        if (this.$route.query.page) {
          page = +this.$route.query.page + 1
        }
        return page
      },
      nextRoute () {
        let { name, params, query } = getRouteCopy(this.$route)
        query.page = this.nextPage
        return { name, params, query }
      },
      prevPage () {
        let page = 0
        if (this.meta && this.$route.query.page) {
          page = +this.$route.query.page - 1
        }
        return page
      },
      prevRoute () {
        let { name, params, query } = getRouteCopy(this.$route)
        query.page = this.prevPage
        return { name, params, query }
      },
      pageCount () {
        if (this.meta && this.meta.pageCount) {
          return +this.meta.pageCount
        }
        return 1
      },
      pageRange () {
        let pages = []
        let startPage = 1
        let endPage = this.pageCount
        let isMaxSized = this.maxLinksCount < this.pageCount
        if (this.pageCount < 2) {
          return [1]
        }

        if (isMaxSized) {
          startPage = Math.max(this.currentPage - Math.floor(this.maxLinksCount / 2), 1)
          endPage = startPage + this.maxLinksCount - 1
          if (endPage > this.pageCount) {
            endPage = this.pageCount
            startPage = endPage - this.maxLinksCount + 1
          }
        }
        for (let num = startPage; num <= endPage; num++) {
          pages.push(num)
        }
        const j = pages.length
        if (j < this.pageCount) {
          if (this.currentPage < (this.pageCount - 2)) {
            pages[j - 2] = (this.currentPage + 3 === this.pageCount) ? this.currentPage + 3 : '...'
            pages[j - 1] = this.pageCount
          }
          if (this.currentPage > (pages[0] + 2)) {
            pages[0] = 1
            pages[1] = (this.currentPage === 4) ? 2 : '...'
          }
        }
        if (pages[pages.length - 1] === pages[pages.length - 2]) {
          pages[pages.length - 2] = '...'
        }
        return pages
      }
    },
    methods: {
      getRouteForPage (page) {
        let { name, params, query } = getRouteCopy(this.$route)
        query.page = page
        return { name, params, query }
      }
    }
  }
</script>
