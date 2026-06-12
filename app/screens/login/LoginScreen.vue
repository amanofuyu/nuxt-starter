<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const loginText = computed(() => ({
  backHome: t('login.backHome'),
  cardTitle: t('login.cardTitle'),
  description: t('login.description'),
  title: t('login.title'),
}))
</script>

<template>
  <section class="diffuse-field min-h-[calc(100svh-4rem)] border-b">
    <PageContainer class="section-y-compact grid min-h-[calc(100svh-8rem)] items-center">
      <div class="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-[0.9fr_1fr]">
        <div class="glass-float p-[var(--space-8)]">
          <h1 class="type-page-title">
            {{ loginText.title }}
          </h1>
          <p class="type-body-muted mt-4">
            {{ loginText.description }}
          </p>
          <NuxtLink class="type-control mt-6 inline-block text-primary hover:underline" :to="localePath('/')">
            {{ loginText.backHome }}
          </NuxtLink>
        </div>
        <Card class="bg-card">
          <CardHeader>
            <CardTitle>{{ loginText.cardTitle }}</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  </section>
</template>
