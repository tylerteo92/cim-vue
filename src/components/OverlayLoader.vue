<template>
  <v-overlay :model-value="isLoading" class="align-center justify-center" persistent>
    <v-progress-circular
      class="!text-primary"
      indeterminate
      size="64"
      width="5"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  props: ['isLoading'],
}
</script>

