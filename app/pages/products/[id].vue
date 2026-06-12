<script setup lang="ts">
import type { Product } from '#shared/types/product'

defineOptions({
  name: 'ProductDetailPage',
})

const route = useRoute()
const { locale, t } = useI18n()
const id = computed(() => String(route.params.id))
const { data: product } = await useFetch<Product | null>(() => `/api/products/${id.value}`, {
  query: {
    locale,
  },
})

const currentProduct = computed(() => {
  if (!product.value) {
    throw createError({ statusCode: 404, statusMessage: t('product.notFound') })
  }

  return product.value
})

useSeoMeta({
  title: () => `${currentProduct.value.name} | Colorway Starter`,
  description: () => currentProduct.value.summary,
})
</script>

<template>
  <ProductDetailScreen :product="currentProduct" />
</template>
