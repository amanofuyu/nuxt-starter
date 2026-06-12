<script setup lang="ts">
import type { UserProfile } from '#shared/types/user'

import { CalendarDays, Mail, ShieldCheck } from '@lucide/vue'

const { data: user } = await useFetch<UserProfile>('/api/profile')

const currentUser = computed(() => {
  if (!user.value) {
    throw createError({ statusCode: 500, statusMessage: '用户资料加载失败' })
  }

  return user.value
})

useSeoMeta({
  title: '资料 | Colorway Starter',
})
</script>

<template>
  <section class="diffuse-field min-h-[calc(100svh-4rem)] border-b">
    <PageContainer class="section-y-compact">
      <PageHeading
        description="这个页面展示看起来像登录后的用户资料，但 v1 不绑定真实 auth provider。用户私有数据默认动态读取。"
        title="用户资料示例"
      />

      <div class="mt-8 grid items-start gap-6 lg:grid-cols-[0.9fr_1fr]">
        <Card class="self-start">
          <CardHeader>
            <div class="flex items-center gap-4">
              <Avatar class="size-12">
                <AvatarFallback class="bg-primary text-primary-foreground">
                  林
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{{ currentUser.name }}</CardTitle>
                <p class="type-body-sm mt-1 text-muted-foreground">
                  {{ currentUser.plan }}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent class="type-body-sm grid gap-4">
            <div class="flex items-center gap-3">
              <Mail class="icon-control text-muted-foreground" />
              {{ currentUser.email }}
            </div>
            <div class="flex items-center gap-3">
              <CalendarDays class="icon-control text-muted-foreground" />
              加入时间：{{ currentUser.joinedAt }}
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="item in currentUser.preferences" :key="item" variant="secondary">
                {{ item }}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div class="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <ShieldCheck class="icon-control text-primary" />
                状态模式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                description="这里预留给真实项目的订单、收藏或通知数据。"
                title="暂无会员动态"
              />
            </CardContent>
          </Card>
          <RecommendationsPanel />
        </div>
      </div>
    </PageContainer>
  </section>
</template>
