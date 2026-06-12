<script setup lang="ts">
defineProps<{
  description: string
  title: string
}>()
</script>

<template>
  <div class="rounded-[var(--radius-card)] border bg-error-soft p-[var(--space-6)] text-error-soft-foreground">
    <h2 class="type-section-title">
      {{ title }}
    </h2>
    <p class="type-body-sm mt-2">
      {{ description }}
    </p>
  </div>
</template>
