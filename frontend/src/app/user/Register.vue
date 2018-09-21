<template>
  <div class="user register">
    <div class="card">
      <g-form
        class="card-content"
        @submit="onSubmit"
        ref="form"
      >
        <g-field
          :model="form"
          label="Email"
          name="email"
          validate="email|required|min:7"
        ></g-field>

        <g-field
          :model="form"
          label="Name"
          name="name"
          validate="required|min:1"
        ></g-field>

        <g-field
          :model="form"
          label="Password"
          name="pass"
          type="password"
          validate="required|min:6"
        ></g-field>

        <g-field
          :model="form"
          label="Password repeat"
          type="password"
          name="passRepeat"
          :validate="{required: true, min: 6, is: form.pass}"
        ></g-field>

      </g-form>
    </div>
  </div>
</template>

<script>
  import { user } from '../../api/endpoints'

  export default {
    name: 'register',
    title: 'Register',
    data: () => ({
      form: {
        email: '',
        pass: '',
        passRepeat: ''
      }
    }),
    methods: {
      onSubmit () {
        this.$store.dispatch('createModel', {
          url: user.register(),
          data: this.form
        }).then(({ data }) => {
          this.$store.commit('userSetAuthData', data)
          this.$router.push({ name: 'blog.home' })
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
