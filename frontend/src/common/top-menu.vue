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
          My brand
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
          <router-link
            class="navbar-item articles"
            :to="{name: 'blog.articles'}"
          >
            Articles
          </router-link>
          <router-link
            v-if="$store.getters.isGuest"
            class="navbar-item"
            :to="{name: 'user.login'}"
          >
            Login
          </router-link>
          <router-link
            v-if="$store.getters.isGuest"
            class="navbar-item"
            :to="{name: 'user.register'}"
          >
            Register
          </router-link>
          <router-link
            v-if="$store.getters.isAdmin"
            class="navbar-item create-article"
            :to="{name: 'blog.article.create'}"
          >
            Create Article
          </router-link>
          <router-link
            v-if="!$store.getters.isGuest"
            class="navbar-item create-article"
            :to="{name: 'user.profile', params: { id: $store.getters.userData.id }}"
          >
            My profile
          </router-link>
          <a
            v-if="!$store.getters.isGuest"
            class="navbar-item"
            @click.prevent="onLogout()"
          >
            Logout
          </a>
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
    }),
    methods: {
      onLogout () {
        this.$router.push({ name: 'blog.home' })
        this.$store.commit('userDelAuthData')
      }
    }
  }
</script>
