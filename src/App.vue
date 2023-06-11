<template>
  <v-app>
    <component :is='route.meta.layout'>
      <router-view></router-view>
    </component>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
const route = useRoute();

</script>
