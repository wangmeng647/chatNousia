<script setup lang='ts'>
import { computed } from 'vue'
import { NLayoutSider } from 'naive-ui'
import isMobile from '@/utils/mobile_check/mobile_check'

// const collapsed = computed(() => appStore.siderCollapsed)
const wrapClass = computed(() => {
  return [
    'text-center',
    'gap-3',
    'px-3',
    'py-3',
    'border',
    'rounded-md',
    'border-neutral-800',
    'hover:bg-[#24272e]',
  ]
})
</script>

<template>
  <NLayoutSider
    :collapsed-width="0"
    :width="isMobile() ? 65 : 260"
    collapse-mode="transform"
    show-trigger="arrow-circle"
  >
    <div class="flex flex-col h-full">
      <main class="flex flex-col flex-1 min-h-0 gap-2">
        <RouterLink to="/chat" :disabled="true" :class="wrapClass" active-class="text-[#4b9e5f] bg-[#24272e] border-[#4b9e5f]">
          Chat
        </RouterLink>
        <RouterLink to="/image" :class="wrapClass" active-class="text-[#4b9e5f] bg-[#24272e] border-[#4b9e5f]">
          Image
        </RouterLink>
      </main>
    </div>
  </NLayoutSider>
</template>
