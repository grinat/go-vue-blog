<template>
  <div class="g-snack">
    <transition name="fade">
      <div
        class="notification container"
        :class="`is-${type}`"
        v-if="showed"
      >
        <button
          @click.stop.prevent="hide()"
          class="delete"
        ></button>
        {{message}}
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'g-snack',
    data: () => ({
      showed: false,
      type: '',
      message: ''
    }),
    watch: {
      '$store.state.snackMessage': 'onSnackMessage'
    },
    created () {
      this.onSnackMessage()
    },
    methods: {
      onSnackMessage () {
        if (this.$store.state.snackMessage) {
          this.show(this.$store.state.snackMessage)
        }
      },
      show ({ message, type = 'danger', duration = 5000 }) {
        this.type = type
        if (message && message.message) {
          // error
          this.message = message
        } else if (message && message.data) {
          // http response
          this.message = message.data.toString()
        } else {
          // string
          this.message = message
        }
        this.open(duration)
      },
      open (duration) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.showed = true
        this.timer = setTimeout(() => {
          this.hide()
        }, duration)
      },
      hide () {
        this.showed = false
      }
    }
  }
</script>

<style lang="scss">
  .g-snack{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
