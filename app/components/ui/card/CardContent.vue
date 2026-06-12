<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div :class="cn('p-[var(--space-6)] pt-0', attrs.class)">
    <slot />
  </div>
</template>
