<template>
  <div class="error"></div>
</template>

<script>
  export default {
    name: 'error',
    computed: {
      isAutorisationError () {
        return this.error && this.error.status === 401
      }
    },
    asyncData () {
      return Promise.resolve(true)
    }
  }
</script>
