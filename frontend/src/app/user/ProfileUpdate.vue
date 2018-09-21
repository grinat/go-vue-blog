<template>
  <div class="user profile-update">
    <div class="card">
      <g-form
        class="card-content"
        @submit="onSubmit"
        ref="form"
      >

        <div class="columns">
          <div class="column avatar-col">
            <figure class="avatar image is-128x128">
              <img :src="form.avatarBig" :alt="form.name">
            </figure>
          </div>
          <div class="column">
            <div class="field">
              <label class="label">Avatar</label>
              <input
                @change="onChangeAvatar"
                type="file"
              >
            </div>

            <g-field
              :model="form"
              label="Name"
              name="name"
              validate="required|min:1"
            ></g-field>
          </div>
        </div>

      </g-form>
    </div>
  </div>
</template>

<script>
  import { user } from '../../api/endpoints'

  export default {
    name: 'profile-update',
    title: 'Edit profile',
    data: () => ({
      form: {
        name: ''
      }
    }),
    computed: {
      item () {
        return this.$store.getters.readUrlEndpoint(
          this.getEndpoint(this.$route)
        )
      }
    },
    created () {
      if (this.$route.params.id) {
        this.form = Object.assign({}, this.item)
      }
    },
    methods: {
      onChangeAvatar (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return false
        }
        this.file = files[0]
        this.toBase64(this.file).then(f64 => {
          this.form.avatarBig = f64
        }).catch(e => {
          this.$store.commit('snackMessage', { message: e })
        })
      },
      toBase64 (file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = (e) => reject(e)
        })
      },
      onSubmit: async function () {
        this.$bar.start()
        try {
          if (this.file) {
            const {data: { url, urlThumb }} = await this.$store.dispatch('uploadFile', { file: this.file })
            this.form.avatar = urlThumb
            this.form.avatarBig = url
          }
          const { data: { id } } = await this.$store.dispatch('updateModel', {
            url: user.profileUpdate(this.$route.params.id),
            data: this.form
          })
          this.$router.push({ name: 'user.profile', params: { id } })
        } catch (e) {
          this.$refs.form.handleServerError(e)
        }
        this.$bar.finish()
      },
      getEndpoint ({ params: { id } }) {
        return user.profile(id)
      }
    },
    asyncData ({ store, route, fromRoute, methods }) {
      const endpoint = methods.getEndpoint(route)
      return store.dispatch('updateUrlEndpoint', { endpoint })
    }
  }
</script>
