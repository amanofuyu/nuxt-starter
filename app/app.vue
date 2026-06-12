<script setup lang="ts">
useHead({
  script: [
    {
      innerHTML: 'try{document.documentElement.classList.toggle("dark",localStorage.getItem("colorway-theme")==="dark")}catch{}',
      tagPosition: 'head',
    },
  ],
})
</script>

<template>
  <Html lang="zh-CN">
    <Body>
      <AppShell>
        <NuxtPage />
      </AppShell>
      <Sonner />
    </Body>
  </Html>
</template>
