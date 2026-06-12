<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

const { resolvedTheme, setTheme } = useTheme()
const { t } = useI18n()
const nextTheme = computed(() => resolvedTheme.value === 'dark' ? 'light' : 'dark')
const ariaLabel = computed(() => t('nav.toggleTheme'))
</script>

<template>
  <button
    class="type-control motion-control inline-flex size-10 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] whitespace-nowrap hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
    onclick="const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark'; document.documentElement.classList.toggle('dark', next === 'dark'); localStorage.setItem('colorway-theme', next)"
    type="button"
    :aria-label="ariaLabel"
    @click="setTheme(nextTheme)"
  >
    <Sun class="icon-control motion-control scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
    <Moon class="icon-control motion-control absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
  </button>
</template>
