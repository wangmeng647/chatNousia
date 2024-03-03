<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  isUser?: boolean
}
defineProps<Props>()
</script>

<template>
  <template v-if="isUser">
    <!-- <NAvatar round :style="{backgroundColor: 'Cyan'}" /> -->
    <span>
      <Icon icon="icon-park-outline:people" color="white" width="30" />
    </span>
  </template>
  <template v-else>
    <span>
      <Icon icon="arcticons:ai-chat-open-assistant-chatbot" color="#ffffff" width="30" />
    </span>
  </template>
</template>
