<template>
  <div class="main-layout is-fullheight">
    <top-menu></top-menu>
    <section class="container">
      <g-error
        v-if="error"
        :error="error"
      ></g-error>
      <router-view
        v-else
      ></router-view>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'main-layout',
    computed: {
      error() {
        return this.$store.getters.getError
      }
    }
  }
</script>
