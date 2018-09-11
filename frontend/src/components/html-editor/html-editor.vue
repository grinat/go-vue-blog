<template>
  <div class="g-html-editor">
    <vue-editor
      v-model="model[name]"
    ></vue-editor>
  </div>
</template>

<script>
  import { VueEditor } from "vue2-editor"

  export default {
    name: 'g-html-editor',
    components: {
      VueEditor
    },
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
