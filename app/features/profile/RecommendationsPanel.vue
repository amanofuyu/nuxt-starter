<script setup lang="ts">
import { RefreshCcw, Sparkles } from '@lucide/vue'
import { useQuery } from '@tanstack/vue-query'

import { recommendationsResponseSchema } from '#shared/api/schemas'

async function fetchRecommendations() {
  const payload = await $fetch('/api/recommendations')
  return recommendationsResponseSchema.parse(payload)
}

const { data, isFetching, refetch } = useQuery({
  queryKey: ['recommendations'],
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
          客户端推荐面板
        </CardTitle>
        <p class="type-body-sm mt-2 text-muted-foreground">
          用户触发后再请求，展示 Vue Query 的边界。
        </p>
      </div>
      <AppButton :disabled="isFetching" size="sm" type="button" variant="outline" @click="refetch()">
        <RefreshCcw :class="isFetching ? 'animate-spin' : undefined" />
        刷新推荐
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
          点击按钮后加载局部数据，首屏资料仍由服务端渲染。
        </p>
      </div>
    </CardContent>
  </Card>
</template>
