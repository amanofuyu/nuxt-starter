<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <p :class="cn('type-body-sm text-muted-foreground', attrs.class)">
    <slot />
  </p>
</template>
