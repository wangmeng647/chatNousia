<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text?: string
}

defineProps<Props>()

const wrapClass = computed(() => {
  return [
    'text-base',
    'px-3',
    'py-2',
    'text-black',
    'text-wrap',
    'min-w-[20px]',
    'rounded-md',
    'bg-[#1e1e20]',
    'message-reply',
    'hover:bg-[#434347]',
    'mr-14',
    'mb-2',
  ]
})
</script>

<template>
  <div :class="wrapClass">
    <div class="leading-relaxed break-words">
      <div>
        <div class="text-[#f3f6f4] whitespace-pre-wrap" v-text="text" />
      </div>
      <!-- <div v-else>
        <div class="whitespace-pre-wrap" v-text="text" />?
      </div> -->
    </div>
  </div>
</template>
