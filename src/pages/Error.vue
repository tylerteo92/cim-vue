<template>
  <v-app dark class="text-center">
    <h1>
      {{ pageError }}
    </h1>
    <router-link class='!text-primary' to="/">Back to Home page</router-link>
  </v-app>
</template>

<script lang="ts">
export default {
  name: 'ErrorLayout',
  data() {
    return {
      pageError: 'Page Not Found',
    }
  },
  head() {
    const title = this.pageError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
