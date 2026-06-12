<script setup lang="ts">
import type { Product } from '#shared/types/product'

defineOptions({
  name: 'HomePage',
})

const { locale, t } = useI18n()
const { data: productsData } = await useFetch<Product[]>('/api/products', {
  default: () => [],
  query: {
    locale,
  },
})

const products = computed(() => productsData.value ?? [])

useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
})
</script>

<template>
  <HomeScreen :products="products" />
</template>
