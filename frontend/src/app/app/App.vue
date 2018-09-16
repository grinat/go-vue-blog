<template>
  <router-view></router-view>
</template>

<script>
  import { getRouteCopy } from "../../utils/url"

  export default {
    name: 'app',
    computed: {
      needReLogin () {
        return this.$store.getters.needReLogin
      }
    },
    watch: {
      'needReLogin': 'onNeedReLogin'
    },
    mounted () {
      this.updateUserData()
    },
    methods: {
      updateUserData () {
        if (typeof window !== 'undefined') {
          this.$store.dispatch('updateUserData')
        }
      },
      onNeedReLogin (needReLogin) {
        if (needReLogin && needReLogin.value === true) {
          this.$store.commit('userSetRedirectUrl', getRouteCopy(this.$route))
          this.$store.commit('needReLogin', false)
          this.$store.commit('userDelAuthData')
          this.$router.push({ name: 'user.login' })
        }
      }
    }
  }
</script>
