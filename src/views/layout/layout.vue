<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui'
import Sider from './sider/index.vue'
</script>

<template>
  <div class="h-full transition-all p4">
    <div class="h-full overflow-hidden">
      <NLayout class="z-40 transition" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>
