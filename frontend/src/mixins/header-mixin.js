function getHeaderOptions (vm) {
  const { title } = vm.$options
  const header = {}
  if (title) {
    header.title = typeof title === 'function'
      ? title.call(vm)
      : title
  }
  return Object.keys(header).length > 0
    ? header
    : null
}

const client = {
  created () {
    this.updateTitle()
  },
  watch: {
    '$route' () {
      this.updateTitle()
    }
  },
  methods: {
    updateTitle () {
      const h = getHeaderOptions(this)
      if (h) {
        if (h.title) {
          document.title = `${h.title}`
        }
        this.$store.commit('updateHeader', h)
      }
    }
  }
}

const server = {
  created () {
    const h = getHeaderOptions(this)
    if (h) {
      if (h.title) {
        this.$ssrContext.title = h.title
      }
      this.$store.commit('updateHeader', h)
    }
  }
}

export default typeof window === "undefined" ? server : client
