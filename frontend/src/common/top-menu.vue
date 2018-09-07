<template>
  <nav class="navbar is-white">
    <div
      class="container"
      @click="menuActive = !menuActive"
    >
      <div class="navbar-brand">
        <router-link
          :to="{path: '/'}"
          class="navbar-item brand-text"
        >
          Brand
        </router-link>
        <span
          class="navbar-burger burger"
          :class="{'is-active': menuActive}"
          data-target="navMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div
        id="navMenu"
        class="navbar-menu"
        :class="{'is-active': menuActive}"
      >
        <div class="navbar-start">
          <router-link
            class="navbar-item"
            :to="{name: 'blog.home'}"
          >
            Home
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'top-menu',
    data: () => ({
      menuActive: false
    })
  }
</script>
