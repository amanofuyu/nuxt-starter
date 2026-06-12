<script setup lang="ts">
import type { BadgeVariants } from '.'

import { useAttrs } from 'vue'

import { cn } from '@/lib/utils'
import { badgeVariants } from '.'

const props = defineProps<{
  variant?: BadgeVariants['variant']
}>()

const attrs = useAttrs()
</script>

<template>
  <span :class="cn(badgeVariants({ variant: props.variant }), attrs.class)">
    <slot />
  </span>
</template>
