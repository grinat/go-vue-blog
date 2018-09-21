<template>
  <div class="g-html-editor">
    <div
      v-if="showToggleHTMLEditorBtn"
      class="switcher"
    >
      <b-switch
        v-model="model.disableHTMLEditor"
      >
        Disable WYSIWYG
      </b-switch>
    </div>
    <textarea
      v-if="showToggleHTMLEditorBtn && model.disableHTMLEditor"
      class="textarea"
      v-model="model[name]"
    ></textarea>
    <vue-editor
      v-else
      :useCustomImageHandler="true"
      :editorToolbar="toolbar"
      :id="editorId"
      @imageAdded="onImageAdded"
      v-model="model[name]"
    ></vue-editor>
  </div>
</template>

<script>
  import { VueEditor } from "vue2-editor"
  import uuid from '../../utils/uuid'

  const TYPE_FULL = 'fullHtmlEditor'
  const TYPE_SHORT = 'shortHtmlEditor'

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
      },
      type: {
        type: String,
        default: TYPE_SHORT
      }
    },
    computed: {
      showToggleHTMLEditorBtn () {
        return this.type === TYPE_FULL
      },
      toolbar () {
        let toolbar = []
        switch (this.type) {
          case TYPE_FULL:
            // source: https://github.com/davidroyer/vue2-editor/blob/master/src/helpers/default-toolbar.js
            toolbar = [
              [{ header: [false, 1, 2, 3, 4, 5, 6] }],
              ["bold", "italic", "underline", "strike"], // toggled buttons
              [
                { align: "" },
                { align: "center" },
                { align: "right" },
                { align: "justify" }
              ],
              ["blockquote", "code-block"],
              [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              ["link", "image", "video"],
              ["clean"] // remove formatting button,
            ]
            break
          case TYPE_SHORT:
            toolbar = [
              ["bold", "italic", "underline", "strike"],
              ["blockquote", "code-block"],
              ["link", "image", "video"],
              ["clean"]
            ]
            break
        }
        return toolbar
      },
      editorId () {
        return `${this.name}_${uuid.generate()}`
      }
    },
    methods: {
      onImageAdded (file, Editor, cursorLocation, resetUploader) {
        this.$store.dispatch('uploadFile', {
          file
        }).then(({ data: { url } }) => {
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        }).catch(e => {
          this.$store.commit('snackMessage', { message: e })
          resetUploader()
        })
      }
    }
  }
</script>
