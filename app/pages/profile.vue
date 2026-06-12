<script setup lang="ts">
import type { UserProfile } from '#shared/types/user'

defineOptions({
  name: 'ProfilePage',
})

const { locale, t } = useI18n()
const { data: user } = await useFetch<UserProfile>('/api/profile', {
  query: {
    locale,
  },
})

const currentUser = computed(() => {
  if (!user.value) {
    throw createError({ statusCode: 500, statusMessage: t('profile.loadError') })
  }

  return user.value
})

useSeoMeta({
  title: () => t('profile.seoTitle'),
})
</script>

<template>
  <ProfileScreen :user="currentUser" />
</template>
