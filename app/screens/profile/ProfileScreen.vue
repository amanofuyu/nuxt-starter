<script setup lang="ts">
import type { UserProfile } from '#shared/types/user'

import { CalendarDays, Mail, ShieldCheck } from '@lucide/vue'

defineProps<{
  user: UserProfile
}>()

const { t } = useI18n()
const profileText = computed(() => ({
  description: t('profile.description'),
  emptyDescription: t('profile.emptyDescription'),
  emptyTitle: t('profile.emptyTitle'),
  statusMode: t('profile.statusMode'),
  title: t('profile.title'),
}))
function formatJoinedAt(date: string) {
  return t('profile.joinedAt', { date })
}
</script>

<template>
  <section class="diffuse-field min-h-[calc(100svh-4rem)] border-b">
    <PageContainer class="section-y-compact">
      <PageHeading
        :description="profileText.description"
        :title="profileText.title"
      />

      <div class="mt-8 grid items-start gap-6 lg:grid-cols-[0.9fr_1fr]">
        <Card class="self-start">
          <CardHeader>
            <div class="flex items-center gap-4">
              <Avatar class="size-12">
                <AvatarFallback class="bg-primary text-primary-foreground">
                  {{ user.name.slice(0, 1) }}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{{ user.name }}</CardTitle>
                <p class="type-body-sm mt-1 text-muted-foreground">
                  {{ user.plan }}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent class="type-body-sm grid gap-4">
            <div class="flex items-center gap-3">
              <Mail class="icon-control text-muted-foreground" />
              {{ user.email }}
            </div>
            <div class="flex items-center gap-3">
              <CalendarDays class="icon-control text-muted-foreground" />
              {{ formatJoinedAt(user.joinedAt) }}
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="item in user.preferences" :key="item" variant="secondary">
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
                {{ profileText.statusMode }}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                :description="profileText.emptyDescription"
                :title="profileText.emptyTitle"
              />
            </CardContent>
          </Card>
          <RecommendationsPanel />
        </div>
      </div>
    </PageContainer>
  </section>
</template>
