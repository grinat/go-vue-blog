<template>
  <div class="g-error">
    <div class="card">
      <div
        class="card-content"
        v-if="isAutorisationError"
      >
        <div>You need re login</div>
      </div>
      <div
        class="card-content"
        v-else
      >
        <h1 class="title">{{error.title}}</h1>
        <div>
          <p v-if="error.message" v-html="error.message"></p>
          <p v-if="error.apiUrl">
            API URL: {{error.apiUrl}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'g-error',
    props: ['error'],
    computed: {
      isAutorisationError () {
        return this.error && this.error.status === 401
      }
    }
  }
</script>
