<template>
  <div class="error">
    <g-error :error="error"></g-error>
  </div>
</template>

<script>
  export default {
    name: 'error',
    computed: {
      error () {
        return this.$store.getters.getError
      }
    },
    asyncData () {
      return Promise.resolve(true)
    }
  }
</script>
