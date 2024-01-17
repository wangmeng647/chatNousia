<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text?: string
  isUser?: boolean
}

const props = defineProps<Props>()

const wrapClass = computed(() => {
  return [
    'text-base',
    'px-3',
    'py-2',
    'text-black',
    'text-wrap',
    'min-w-[20px]',
    'rounded-md',
    props.isUser ? 'bg-[#a9e69c]' : 'bg-[#1e1e20]',
    props.isUser ? 'message-request' : 'message-reply',
    props.isUser ? 'hover:bg-[#8ae675]' : 'hover:bg-[#434347]',
    props.isUser ? 'ml-14' : 'mr-14',
  ]
})
</script>

<template>
  <div :class="wrapClass">
    <div class="leading-relaxed break-words">
      <div v-if="!isUser">
        <div class="text-[#f3f6f4] whitespace-pre-wrap" v-text="text" />
      </div>
      <div v-else>
        <div class="whitespace-pre-wrap" v-text="text" />
      </div>
    </div>
  </div>
</template>
