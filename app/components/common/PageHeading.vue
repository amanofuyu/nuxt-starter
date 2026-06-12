<script setup lang="ts">
defineProps<{
  description?: string
  title: string
}>()
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="type-page-title">
      {{ title }}
    </h1>
    <p v-if="description" class="type-body-muted mt-4">
      {{ description }}
    </p>
  </div>
</template>
