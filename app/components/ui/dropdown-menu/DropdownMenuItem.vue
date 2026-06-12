<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <DropdownMenuItem :class="cn('motion-control relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', attrs.class)">
    <slot />
  </DropdownMenuItem>
</template>
