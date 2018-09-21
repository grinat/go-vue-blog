<template>
  <div class="user login">
    <div class="card">
      <g-form
        @submit="onSubmit"
        actionTitle="Login"
        ref="form"
      >
        <g-field
          :model="form"
          label="Email"
          name="email"
          validate="email|required"
        ></g-field>

        <g-field
          :model="form"
          label="Password"
          name="pass"
          type="password"
          validate="required"
        ></g-field>
      </g-form>
    </div>
  </div>
</template>

<script>
  import { user } from '../../api/endpoints'

  export default {
    name: 'login',
    title: 'Login',
    data: () => ({
      form: {
        email: '',
        pass: ''
      }
    }),
    computed: {
      currentUser () {
        return this.$store.getters.userData
      },
      error () {
        return this.$store.getters.getError
      }
    },
    watch: {
      'error': 'onError'
    },
    methods: {
      onError () {
        // if auotrization error, unset error for show login form
        if (this.error && this.error.status === 401) {
          this.$store.commit('mutateError', null)
        }
      },
      onSubmit () {
        this.$store.dispatch('createModel', {
          url: user.login(),
          data: this.form
        }).then(({ data }) => {
          this.$store.commit('userSetAuthData', data)
          this.$router.push(this.$store.getters.redirectUrl)
        }).catch(e => {
          this.$refs.form.handleServerError(e)
        })
      }
    },
    asyncData () {
      return Promise.resolve(true)
    }
  }
</script>
