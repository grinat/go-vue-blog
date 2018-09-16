<template>
  <div class="field g-field">
    <label
      v-if="type!='checkbox'"
      class="label"
    >{{label}}</label>
    <div class="control">
      <textarea
        v-if="type=='textarea'"
        v-model="model[name]"
        v-validate="validate"
        class="textarea"
        :name="name"
        :data-vv-as="label"
      ></textarea>
      <label
        v-else-if="type=='checkbox'"
        class="checkbox"
      >
        <input
          type="checkbox"
          v-model="model[name]"
          v-validate="validate"
          class="checkbox"
          :name="name"
          :data-vv-as="label"
        >
        {{label}}
      </label>
      <div v-else-if="type=='fullHtmlEditor'">
        <g-html-editor
          :name="name"
          :type="type"
          :model="model"
        ></g-html-editor>
        <!--create hidden field for validation reason-->
        <input
          v-model="model[name]"
          v-validate="validate"
          class="input is-hidden"
          :type="type"
          :name="name"
          :data-vv-as="label"
        >
      </div>
      <input
        v-else
        v-model="model[name]"
        v-validate="validate"
        class="input"
        :type="type"
        :name="name"
        :data-vv-as="label"
      >
    </div>
    <p
      v-show="errors.has(name)"
      class="help is-danger"
    >{{errors.first(name)}}</p>
  </div>
</template>

<script>
  export default {
    name: 'g-field',
    inject: ['$validator'],
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
        default: 'input'
      },
      // rules: https://baianat.github.io/vee-validate/guide/rules.html#after
      validate: {
        type: [String, Object]
      },
      label: {
        type: String
      }
    }
  }
</script>
