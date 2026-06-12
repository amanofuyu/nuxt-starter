<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal } from 'reka-ui'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent :class="cn('type-control z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-[var(--shadow-glass-sm)]', attrs.class)" :side-offset="4">
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
