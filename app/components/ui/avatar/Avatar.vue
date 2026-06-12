<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <span :class="cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', attrs.class)">
    <slot />
  </span>
</template>
