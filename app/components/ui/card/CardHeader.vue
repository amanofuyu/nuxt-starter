<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div :class="cn('grid auto-rows-min grid-rows-[auto_auto] gap-2 p-[var(--space-6)]', attrs.class)">
    <slot />
  </div>
</template>
