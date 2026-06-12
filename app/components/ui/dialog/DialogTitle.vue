<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <DialogTitle :class="cn('type-section-title', attrs.class)">
    <slot />
  </DialogTitle>
</template>
