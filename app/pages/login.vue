<script setup lang="ts">
defineOptions({
  name: 'LoginPage',
})

const { t } = useI18n()

useSeoMeta({
  title: () => t('login.seoTitle'),
})
</script>

<template>
  <LoginScreen />
</template>
