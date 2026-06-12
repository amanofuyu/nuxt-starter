<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const errorText = computed(() => ({
  backHome: t('error.backHome'),
  generic: t('error.generic'),
  notFound: t('error.notFound'),
  retryLater: t('error.retryLater'),
}))

function handleError() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <section class="diffuse-field grid min-h-svh place-items-center px-4">
    <div class="glass-panel max-w-lg p-[var(--space-8)] text-center">
      <h1 class="type-page-title">
        {{ error.statusCode === 404 ? errorText.notFound : errorText.generic }}
      </h1>
      <p class="type-body-muted mt-4">
        {{ error.statusMessage || errorText.retryLater }}
      </p>
      <AppButton class="mt-6" type="button" @click="handleError">
        {{ errorText.backHome }}
      </AppButton>
    </div>
  </section>
</template>
