<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

defineProps<{
  message?: string
}>()

const attrs = useAttrs()
</script>

<template>
  <p v-if="message" :class="cn('type-control text-destructive', attrs.class)">
    {{ message }}
  </p>
</template>
