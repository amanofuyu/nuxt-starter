<script setup lang="ts">
import { computed, useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<template>
  <label
    :class="cn('type-control flex items-center gap-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', attrs.class)"
    v-bind="rootAttrs"
  >
    <slot />
  </label>
</template>
