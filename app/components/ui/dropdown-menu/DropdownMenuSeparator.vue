<script setup lang="ts">
import { DropdownMenuSeparator } from 'reka-ui'
import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'

const attrs = useAttrs()
</script>

<template>
  <DropdownMenuSeparator :class="cn('-mx-1 my-1 h-px bg-border', attrs.class)" />
</template>
