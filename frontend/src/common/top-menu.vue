<template>
  <nav class="top-menu navbar is-white">
    <div
      class="container"
      @click="menuActive = false"
    >
      <div class="navbar-brand">
        <router-link
          :to="{name: 'blog.home'}"
          class="navbar-item brand-text"
        >
          My brand
        </router-link>
        <span
          class="navbar-burger burger"
          :class="{'is-active': menuActive}"
          data-target="navMenu"
          @click.stop.prevent="menuActive = !menuActive"
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
            class="navbar-item home-link"
            :to="{name: 'blog.home'}"
          >
            Home
          </router-link>
          <router-link
            class="navbar-item articles-link"
            :to="{name: 'blog.articles'}"
          >
            Articles
          </router-link>
          <router-link
            v-if="$store.getters.isGuest"
            class="navbar-item login-link"
            :to="{name: 'user.login'}"
          >
            Login
          </router-link>
          <router-link
            v-if="$store.getters.isGuest"
            class="navbar-item register-link"
            :to="{name: 'user.register'}"
          >
            Register
          </router-link>
          <router-link
            v-if="$store.getters.isAdmin"
            class="navbar-item create-article-link"
            :to="{name: 'blog.article.create'}"
          >
            Create Article
          </router-link>
          <router-link
            v-if="!$store.getters.isGuest"
            class="navbar-item my-profile-link"
            :to="{name: 'user.profile', params: { id: $store.getters.userData.id }}"
          >
            My profile
          </router-link>
          <a
            v-if="!$store.getters.isGuest"
            class="navbar-item logout-link"
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
