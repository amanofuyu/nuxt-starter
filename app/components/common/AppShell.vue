<template>
  <div class="flex min-h-svh flex-col bg-background">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
