<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal',
})

const attrs = useAttrs()
</script>

<template>
  <div
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      attrs.class,
    )"
  />
</template>
