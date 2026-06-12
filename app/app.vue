<script setup lang="ts">
const localeHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
})

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs ?? {},
  link: localeHead.value.link ?? [],
  meta: localeHead.value.meta ?? [],
  script: [
    {
      innerHTML: 'try{document.documentElement.classList.toggle("dark",localStorage.getItem("colorway-theme")==="dark")}catch{}',
      tagPosition: 'head',
    },
  ],
}))
</script>

<template>
  <Html>
    <Body>
      <AppShell>
        <NuxtPage />
      </AppShell>
      <Sonner />
    </Body>
  </Html>
</template>
