<script setup lang="ts">
const { t } = useI18n()
const footerText = computed(() => ({
  brand: t('common.brand'),
  template: t('footer.template'),
}))
</script>

<template>
  <footer class="border-t bg-background">
    <PageContainer class="type-caption flex h-14 items-center justify-between text-muted-foreground">
      <span>{{ footerText.brand }}</span>
      <span>{{ footerText.template }}</span>
    </PageContainer>
  </footer>
</template>
