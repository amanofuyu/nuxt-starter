<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <DialogDescription :class="cn('type-body-sm text-muted-foreground', attrs.class)">
    <slot />
  </DialogDescription>
</template>
