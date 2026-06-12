<script setup lang="ts">
import type { ButtonVariants } from '@/components/ui/button'

import { computed, useAttrs } from 'vue'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps<{
  href?: string
  size?: ButtonVariants['size']
  to?: string
  variant?: ButtonVariants['variant']
}>()

const attrs = useAttrs()
const rootClass = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class))
const rootAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
</script>

<template>
  <NuxtLink v-if="to" :class="rootClass" :to="to" v-bind="rootAttrs">
    <slot />
  </NuxtLink>
  <a v-else-if="href" :class="rootClass" :href="href" v-bind="rootAttrs">
    <slot />
  </a>
  <button v-else :class="rootClass" v-bind="rootAttrs">
    <slot />
  </button>
</template>
