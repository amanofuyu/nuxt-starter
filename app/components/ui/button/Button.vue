<script setup lang="ts">
import type { ButtonVariants } from '.'

import { computed, useAttrs } from 'vue'

import { cn } from '@/lib/utils'
import { buttonVariants } from '.'

const props = defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
}>()

const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<template>
  <button
    :class="cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class)"
    v-bind="rootAttrs"
  >
    <slot />
  </button>
</template>
