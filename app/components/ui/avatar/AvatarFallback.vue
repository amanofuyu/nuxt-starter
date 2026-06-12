<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <span :class="cn('flex size-full items-center justify-center rounded-full bg-muted', attrs.class)">
    <slot />
  </span>
</template>
