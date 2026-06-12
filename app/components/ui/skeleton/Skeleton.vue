<script setup lang="ts">
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <div :class="cn('animate-pulse rounded-[var(--radius-control)] bg-muted', attrs.class)" />
</template>
