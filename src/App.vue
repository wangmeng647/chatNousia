<script setup lang="ts">
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'
import { ref } from 'vue'

const theme = ref<GlobalTheme | null>(darkTheme)
const themeOverrides: GlobalThemeOverrides = {
  common: {},
}
</script>

<template>
  <NConfigProvider
    :theme="theme"
    class="h-full"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <RouterView />
    </NMessageProvider>
  </NConfigProvider>
</template>
