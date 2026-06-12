<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const navItems = computed(() => [
  { href: '/', label: t('common.home') },
  { href: '/products/canvas-kit', label: t('common.product') },
  { href: '/profile', label: t('common.profile') },
  { href: '/login', label: t('common.login') },
])
const languageLinks = computed(() => [
  {
    code: 'zh',
    href: switchLocalePath('zh'),
    label: t('common.chinese'),
  },
  {
    code: 'en',
    href: switchLocalePath('en'),
    label: t('common.english'),
  },
])
const headerText = computed(() => ({
  brand: t('common.brand'),
  viewProduct: t('nav.viewProduct'),
}))
</script>

<template>
  <header class="stripe-nav sticky top-0 z-40">
    <PageContainer class="grid gap-3 py-3 md:flex md:h-16 md:items-center md:justify-between md:gap-4 md:py-0">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink class="type-card-title flex items-center gap-2" :to="localePath('/')">
          <span class="type-control grid size-8 place-items-center rounded-[var(--radius-control)] bg-foreground text-background">C</span>
          <span>{{ headerText.brand }}</span>
        </NuxtLink>
        <div class="flex items-center gap-2 md:hidden">
          <ThemeToggle />
        </div>
      </div>

      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          class="type-control motion-control rounded-[var(--radius-pill)] px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          :to="localePath(item.href)"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <NuxtLink
          v-for="item in languageLinks"
          :key="item.code"
          class="type-control motion-control rounded-[var(--radius-pill)] px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          :aria-current="locale === item.code ? 'page' : undefined"
          :to="item.href"
        >
          {{ item.label }}
        </NuxtLink>
        <ThemeToggle />
        <AppButton class="hidden sm:inline-flex" size="sm" :to="localePath('/products/canvas-kit')">
          {{ headerText.viewProduct }}
        </AppButton>
      </div>

      <nav class="flex gap-1 overflow-x-auto md:hidden">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          class="type-control motion-control rounded-[var(--radius-pill)] px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          :to="localePath(item.href)"
        >
          {{ item.label }}
        </NuxtLink>
        <NuxtLink
          v-for="item in languageLinks"
          :key="item.code"
          class="type-control motion-control rounded-[var(--radius-pill)] px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          :aria-current="locale === item.code ? 'page' : undefined"
          :to="item.href"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </PageContainer>
  </header>
</template>
