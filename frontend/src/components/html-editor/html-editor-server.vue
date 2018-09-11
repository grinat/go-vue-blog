<template>
  <div class="g-html-editor">
    <textarea
      v-model="model[name]"
      class="textarea"
    ></textarea>
  </div>
</template>

<script>
  export default {
    name: 'g-html-editor',
    props: {
      model: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }
  }
</script>
