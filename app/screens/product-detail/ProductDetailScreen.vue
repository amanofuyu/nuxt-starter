<script setup lang="ts">
import type { Product } from '#shared/types/product'

import { ArrowLeft, CheckCircle2 } from '@lucide/vue'

defineProps<{
  product: Product
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const productText = computed(() => ({
  addToTemplate: t('product.addToTemplate'),
  backHome: t('product.backHome'),
  publicData: t('product.publicData'),
  viewGuide: t('product.viewGuide'),
}))
</script>

<template>
  <section class="diffuse-field min-h-[calc(100svh-4rem)] border-b">
    <PageContainer class="section-y-compact">
      <AppButton size="sm" :to="localePath('/')" variant="ghost">
        <ArrowLeft />
        {{ productText.backHome }}
      </AppButton>

      <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_0.72fr]">
        <div class="surface-panel accent-rail p-[var(--space-8)] pl-[calc(var(--space-8)+0.75rem)]">
          <Badge variant="secondary">
            {{ productText.publicData }}
          </Badge>
          <h1 class="type-page-title mt-5">
            {{ product.name }}
          </h1>
          <p class="type-body-muted mt-5 max-w-2xl">
            {{ product.description }}
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppButton>{{ productText.addToTemplate }}</AppButton>
            <AppButton variant="outline">
              {{ productText.viewGuide }}
            </AppButton>
          </div>
        </div>

        <Card class="self-start">
          <CardHeader>
            <CardTitle class="flex items-center justify-between">
              <span>{{ product.name }}</span>
              <span>{{ product.price }}</span>
            </CardTitle>
          </CardHeader>
          <CardContent class="grid gap-0">
            <div
              v-for="feature in product.features"
              :key="feature"
              class="type-body-sm feature-row flex items-start gap-3 first:border-t-0 first:pt-0"
            >
              <CheckCircle2 class="icon-control mt-0.5 text-primary" />
              {{ feature }}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  </section>
</template>
