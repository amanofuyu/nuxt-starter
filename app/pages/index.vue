<script setup lang="ts">
import type { Product } from '#shared/types/product'

import { ArrowRight, CheckCircle2, Code2, Database, Layers3, ShieldCheck, Terminal } from '@lucide/vue'

const { data: productsData } = await useFetch<Product[]>('/api/products', {
  default: () => [],
})

const products = computed(() => productsData.value ?? [])
const accentClass: Record<Product['accent'], string> = {
  teal: 'stripe-product-cyan',
  coral: 'stripe-product-coral',
  violet: 'stripe-product-violet',
  lemon: 'stripe-product-amber',
}
const proofPoints = ['SSR 首屏优先', '不绑定后端供应商', 'clone 后快速替换']
const capabilityItems = [
  { icon: Layers3, title: 'Nuxt SSR 首屏优先', text: '页面默认保留 SSR 数据路径，首屏内容和 SEO 数据不被客户端状态绑架。' },
  { icon: Database, title: '数据入口集中', text: '页面通过 Nitro API 进入 server/queries，mock 只是可替换数据源。' },
  { icon: ShieldCheck, title: 'AI 边界检查', text: '客户端模块、服务端目录、环境变量和 API Route 都有固定审查入口。' },
  { icon: Terminal, title: '验证路径固定', text: 'verify、E2E、Docker smoke 形成 starter 的交付基线。' },
]
const stats = [
  { value: '0', label: '默认第三方服务' },
  { value: '4', label: '核心边界检查' },
  { value: '1', label: '统一验证命令' },
]

useSeoMeta({
  title: 'Colorway Starter',
  description: '一个面向 C 端应用的 Nuxt starter。',
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
            为 C 端产品准备的 Nuxt 前端底座
          </h1>
          <p class="type-body-muted mt-6 max-w-[38rem]">
            Colorway Starter 把 Nuxt、Nitro、Vue、shadcn-vue、测试和 Docker 收进一套清晰的工程界面。它像产品基础设施一样克制、可审查、可替换。
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppButton size="lg" to="/products/canvas-kit">
              查看示例商品
              <ArrowRight />
            </AppButton>
            <AppButton size="lg" to="/profile" variant="outline">
              打开用户门户
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
                  Starter workbench
                </p>
                <p class="type-caption text-slate-400">
                  页面数据来自 Nitro API 和 server/queries
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
              :to="`/products/${product.id}`"
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
              verify、E2E、Docker smoke 都有固定入口
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
              Flexible starter surfaces
            </p>
            <h2 class="type-page-title mt-3">
              从 landing 到轻量门户，边界先于功能堆叠
            </h2>
            <p class="type-body-muted mt-5">
              它不是后台模板市场，也不是隐式全栈框架。默认能力保持轻量，把后续认证、数据库、支付或分析接入留给显式 ADR。
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
            Reliable by default
          </p>
          <h2 class="type-page-title mt-3">
            把可验证性放进 starter 的第一天
          </h2>
          <p class="type-body-muted mt-5 max-w-2xl">
            每个入口都尽量短，每条边界都有文档和脚本托底。AI 修改时可以先读规则、再改局部、最后跑同一组验证。
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
