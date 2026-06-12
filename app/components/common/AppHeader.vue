<script setup lang="ts">
const navItems = [
  { href: '/', label: '首页' },
  { href: '/products/canvas-kit', label: '商品' },
  { href: '/profile', label: '资料' },
  { href: '/login', label: '登录' },
]
</script>

<template>
  <header class="stripe-nav sticky top-0 z-40">
    <PageContainer class="grid gap-3 py-3 md:flex md:h-16 md:items-center md:justify-between md:gap-4 md:py-0">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink class="type-card-title flex items-center gap-2" to="/">
          <span class="type-control grid size-8 place-items-center rounded-[var(--radius-control)] bg-foreground text-background">C</span>
          <span>Colorway Starter</span>
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
          :to="item.href"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <ThemeToggle />
        <AppButton class="hidden sm:inline-flex" size="sm" to="/products/canvas-kit">
          查看商品
        </AppButton>
      </div>

      <nav class="flex gap-1 overflow-x-auto md:hidden">
        <NuxtLink
          v-for="item in navItems"
          :key="item.href"
          class="type-control motion-control rounded-[var(--radius-pill)] px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          :to="item.href"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </PageContainer>
  </header>
</template>
