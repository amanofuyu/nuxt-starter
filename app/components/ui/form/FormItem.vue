<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div :class="cn('grid gap-2', attrs.class)">
    <slot />
  </div>
</template>
