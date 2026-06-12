<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <section class="diffuse-field grid min-h-svh place-items-center px-4">
    <div class="glass-panel max-w-lg p-[var(--space-8)] text-center">
      <h1 class="type-page-title">
        {{ error.statusCode === 404 ? '页面不存在' : '页面出错了' }}
      </h1>
      <p class="type-body-muted mt-4">
        {{ error.statusMessage || '请稍后重试。' }}
      </p>
      <AppButton class="mt-6" type="button" @click="handleError">
        返回首页
      </AppButton>
    </div>
  </section>
</template>
