<template>
  <form
    class="g-form card-content"
    @submit.prevent="onSubmit"
  >
    <slot></slot>
    <slot name="actions">
      <div class="field is-grouped">
        <div class="control">
          <button type="submit" :disabled="formFreezed" class="button is-link">{{actionTitle}}</button>
        </div>
        <div
          class="control"
          v-if="showRemoveBtn"
        >
          <button @click.stop.prevent="onRemove" :disabled="formFreezed" class="button">Remove</button>
        </div>
      </div>
    </slot>
  </form>
</template>

<script>
  export default {
    name: 'g-form',
    props: {
      actionTitle: {
        type: String,
        default: 'Submit'
      },
      showRemoveBtn: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      formFreezed: false
    }),
    methods: {
      onRemove () {
        if (this.formFreezed) {
          return
        }
        this.freeze()
        this.$emit('remove')
      },
      onSubmit () {
        if (this.formFreezed) {
          return
        }
        this.freeze()
        this.$validator.validateAll().then((formValid) => {
          if (formValid) {
            this.$emit('submit')
          } else {
            this.unfreeze()
          }
        })
      },
      handleServerError (e) {
        this.unfreeze()
        this.$store.commit('snackMessage', e)
      },
      freeze () {
        this.formFreezed = true
      },
      unfreeze () {
        this.formFreezed = false
      }
    }
  }
</script>
