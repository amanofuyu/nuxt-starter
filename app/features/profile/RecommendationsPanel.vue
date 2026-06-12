<script setup lang="ts">
import { RefreshCcw, Sparkles } from '@lucide/vue'
import { useQuery } from '@tanstack/vue-query'

import { recommendationsResponseSchema } from '#shared/api/schemas'

const { locale, t } = useI18n()
const panelText = computed(() => ({
  description: t('recommendations.description'),
  empty: t('recommendations.empty'),
  refresh: t('recommendations.refresh'),
  title: t('recommendations.title'),
}))

async function fetchRecommendations() {
  const payload = await $fetch('/api/recommendations', {
    query: {
      locale: locale.value,
    },
  })
  return recommendationsResponseSchema.parse(payload)
}

const { data, isFetching, refetch } = useQuery({
  queryKey: computed(() => ['recommendations', locale.value]),
  queryFn: fetchRecommendations,
  enabled: false,
})
</script>

<template>
  <Card class="overflow-hidden">
    <CardHeader class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <CardTitle class="flex items-center gap-2">
          <Sparkles class="icon-control text-primary" />
          {{ panelText.title }}
        </CardTitle>
        <p class="type-body-sm mt-2 text-muted-foreground">
          {{ panelText.description }}
        </p>
      </div>
      <AppButton :disabled="isFetching" size="sm" type="button" variant="outline" @click="refetch()">
        <RefreshCcw :class="isFetching ? 'animate-spin' : undefined" />
        {{ panelText.refresh }}
      </AppButton>
    </CardHeader>
    <CardContent>
      <div class="grid gap-3">
        <TransitionGroup name="recommendation">
          <div
            v-for="(item, index) in data?.items ?? []"
            :key="item.id"
            class="rounded-[var(--radius-control)] border bg-background p-[var(--space-3)]"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            <div class="type-card-title">
              {{ item.title }}
            </div>
            <p class="type-body-sm mt-1 text-muted-foreground">
              {{ item.reason }}
            </p>
          </div>
        </TransitionGroup>
        <p v-if="!data" class="type-body-sm text-muted-foreground">
          {{ panelText.empty }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
