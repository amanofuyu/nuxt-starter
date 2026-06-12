<script setup lang="ts">
import type { Product } from '#shared/types/product'

import { ArrowRight, CheckCircle2, Code2, Database, Layers3, ShieldCheck, Terminal } from '@lucide/vue'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { data: productsData } = await useFetch<Product[]>('/api/products', {
  default: () => [],
  query: {
    locale,
  },
})

const products = computed(() => productsData.value ?? [])
const accentClass: Record<Product['accent'], string> = {
  teal: 'stripe-product-cyan',
  coral: 'stripe-product-coral',
  violet: 'stripe-product-violet',
  lemon: 'stripe-product-amber',
}
const homeText = computed(() => ({
  capabilitiesDescription: t('home.capabilities.description'),
  capabilitiesEyebrow: t('home.capabilities.eyebrow'),
  capabilitiesTitle: t('home.capabilities.title'),
  heroDescription: t('home.hero.description'),
  heroTitle: t('home.hero.title'),
  openPortal: t('home.hero.openPortal'),
  proofDescription: t('home.proof.description'),
  proofEyebrow: t('home.proof.eyebrow'),
  proofTitle: t('home.proof.title'),
  verifyLine: t('home.hero.verifyLine'),
  viewSampleProduct: t('home.hero.viewSampleProduct'),
  workbench: t('home.hero.workbench'),
  workbenchDescription: t('home.hero.workbenchDescription'),
}))
const proofPoints = computed(() => [
  t('home.hero.proofPoints.ssr'),
  t('home.hero.proofPoints.backend'),
  t('home.hero.proofPoints.replace'),
])
const capabilityItems = computed(() => [
  { icon: Layers3, title: t('home.capabilities.items.ssr.title'), text: t('home.capabilities.items.ssr.text') },
  { icon: Database, title: t('home.capabilities.items.data.title'), text: t('home.capabilities.items.data.text') },
  { icon: ShieldCheck, title: t('home.capabilities.items.boundary.title'), text: t('home.capabilities.items.boundary.text') },
  { icon: Terminal, title: t('home.capabilities.items.verify.title'), text: t('home.capabilities.items.verify.text') },
])
const stats = computed(() => [
  { value: '0', label: t('home.proof.stats.services') },
  { value: '4', label: t('home.proof.stats.boundaries') },
  { value: '1', label: t('home.proof.stats.verify') },
])

useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
})
</script>

<template>
  <div class="overflow-hidden bg-background">
    <section class="stripe-hero relative">
      <div class="stripe-hero-gradient" />
      <div class="stripe-hero-grid" />
      <PageContainer class="grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 sm:py-[4.5rem] lg:grid-cols-[1fr_0.92fr] lg:py-24">
        <div class="relative z-10 max-w-2xl pt-3">
          <h1 class="type-display">
            {{ homeText.heroTitle }}
          </h1>
          <p class="type-body-muted mt-6 max-w-[38rem]">
            {{ homeText.heroDescription }}
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppButton size="lg" :to="localePath('/products/canvas-kit')">
              {{ homeText.viewSampleProduct }}
              <ArrowRight />
            </AppButton>
            <AppButton size="lg" :to="localePath('/profile')" variant="outline">
              {{ homeText.openPortal }}
            </AppButton>
          </div>
          <div class="type-body-sm mt-9 grid gap-3 text-muted-foreground sm:grid-cols-3">
            <div v-for="item in proofPoints" :key="item" class="flex items-center gap-2">
              <CheckCircle2 class="icon-control text-primary" />
              <span>{{ item }}</span>
            </div>
          </div>
        </div>

        <div class="relative z-10">
          <div class="stripe-workbench relative grid gap-4 p-[var(--space-5)]">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p class="type-card-title text-white">
                  {{ homeText.workbench }}
                </p>
                <p class="type-caption text-slate-400">
                  {{ homeText.workbenchDescription }}
                </p>
              </div>
              <Badge class="border-white/10 bg-white/10 text-white hover:bg-white/10">
                SSR
              </Badge>
            </div>
            <div class="stripe-code-line">
              <Code2 class="icon-control text-cyan-300" />
              <span>await $fetch('/api/products')</span>
            </div>
            <NuxtLink
              v-for="product in products"
              :key="product.id"
              :class="`motion-surface stripe-product-row ${accentClass[product.accent]}`"
              :to="localePath(`/products/${product.id}`)"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="type-card-title text-white">
                    {{ product.name }}
                  </h2>
                  <p class="type-body-sm mt-1 text-slate-400">
                    {{ product.summary }}
                  </p>
                </div>
                <span class="type-card-title text-white">{{ product.price }}</span>
              </div>
            </NuxtLink>
            <div class="type-caption flex items-center gap-2 rounded-[var(--radius-control)] bg-white/[0.06] p-3 text-slate-300">
              <CheckCircle2 class="icon-control text-emerald-300" />
              {{ homeText.verifyLine }}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>

    <section class="section-y border-y bg-background">
      <PageContainer>
        <div class="grid gap-10 lg:grid-cols-[0.7fr_1fr]">
          <div class="max-w-xl">
            <p class="type-control text-primary">
              {{ homeText.capabilitiesEyebrow }}
            </p>
            <h2 class="type-page-title mt-3">
              {{ homeText.capabilitiesTitle }}
            </h2>
            <p class="type-body-muted mt-5">
              {{ homeText.capabilitiesDescription }}
            </p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="item in capabilityItems" :key="item.title" class="stripe-capability motion-surface">
              <div class="grid size-10 place-items-center rounded-[var(--radius-control)] bg-primary-soft text-primary-soft-foreground">
                <component :is="item.icon" class="icon-section" />
              </div>
              <h3 class="type-section-title mt-5">
                {{ item.title }}
              </h3>
              <p class="type-body-sm mt-3 text-muted-foreground">
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>

    <section class="stripe-proof section-y">
      <PageContainer class="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <div>
          <p class="type-control text-info">
            {{ homeText.proofEyebrow }}
          </p>
          <h2 class="type-page-title mt-3">
            {{ homeText.proofTitle }}
          </h2>
          <p class="type-body-muted mt-5 max-w-2xl">
            {{ homeText.proofDescription }}
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <div v-for="item in stats" :key="item.label" class="stripe-stat">
              <p class="text-[2rem] font-[var(--weight-title)] leading-none text-foreground">
                {{ item.value }}
              </p>
              <p class="type-caption mt-2 text-muted-foreground">
                {{ item.label }}
              </p>
            </div>
          </div>
        </div>
        <div class="stripe-terminal">
          <div class="mb-5 flex items-center gap-2 text-slate-400">
            <span class="terminal-dot-red size-2.5 rounded-full" />
            <span class="terminal-dot-yellow size-2.5 rounded-full" />
            <span class="terminal-dot-green size-2.5 rounded-full" />
          </div>
          <pre class="type-body-sm overflow-x-auto text-slate-200"><code>corepack pnpm@11.6.0 verify
  check:boundaries  passed
  lint              passed
  typecheck         passed
  test              passed
  build             passed</code></pre>
        </div>
      </PageContainer>
    </section>
  </div>
</template>
