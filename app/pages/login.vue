<script setup lang="ts">
useSeoMeta({
  title: '登录 | Colorway Starter',
})
</script>

<template>
  <section class="diffuse-field min-h-[calc(100svh-4rem)] border-b">
    <PageContainer class="section-y-compact grid min-h-[calc(100svh-8rem)] items-center">
      <div class="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-[0.9fr_1fr]">
        <div class="glass-float p-[var(--space-8)]">
          <h1 class="type-page-title">
            登录页入口
          </h1>
          <p class="type-body-muted mt-4">
            这里只演示 vee-validate + Zod 的客户端边界，不接入真实认证。clone 后请先选择认证方案，再把提交逻辑移到服务端安全边界。
          </p>
          <NuxtLink class="type-control mt-6 inline-block text-primary hover:underline" to="/">
            返回首页
          </NuxtLink>
        </div>
        <Card class="bg-card">
          <CardHeader>
            <CardTitle>模拟登录</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  </section>
</template>
