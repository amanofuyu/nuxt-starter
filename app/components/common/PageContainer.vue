<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div :class="cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', attrs.class)">
    <slot />
  </div>
</template>
