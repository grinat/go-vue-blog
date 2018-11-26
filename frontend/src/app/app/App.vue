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
          this.$store.commit('needReLogin', false)
          this.$store.commit('userDelAuthData')
          if (this.$route.name !== 'user.login') {
            this.$store.commit(
              'userSetRedirectUrl',
              this.$router.history.pending
                ? getRouteCopy(this.$router.history.pending)
                : getRouteCopy(this.$route)
            )
            this.$router.push({name: 'user.login'}, () => {
              this.$store.commit('mutateError', null)
            })
          } else {
            this.$store.commit('mutateError', null)
          }
        }
      }
    }
  }
</script>
