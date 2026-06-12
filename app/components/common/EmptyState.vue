<script setup lang="ts">
import { Inbox } from '@lucide/vue'

defineProps<{
  description: string
  title: string
}>()
</script>

<template>
  <div class="grid place-items-center rounded-[var(--radius-card)] border border-dashed p-[var(--space-8)] text-center">
    <Inbox class="icon-empty text-muted-foreground" />
    <h3 class="type-section-title mt-4">
      {{ title }}
    </h3>
    <p class="type-body-sm mt-2 max-w-md text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>
