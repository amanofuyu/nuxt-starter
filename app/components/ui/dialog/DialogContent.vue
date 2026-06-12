<script setup lang="ts">
import { X } from '@lucide/vue'
import { DialogClose, DialogContent, DialogOverlay, DialogPortal } from 'reka-ui'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <DialogContent :class="cn('glass-panel fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 p-[var(--space-6)]', attrs.class)">
      <slot />
      <DialogClose class="motion-control absolute top-4 right-4 rounded-xs opacity-70 hover:opacity-100 focus:outline-hidden focus:ring-[3px] focus:ring-ring/50">
        <X class="icon-control" />
        <span class="sr-only">关闭</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
