<script setup lang="ts">
import { defineEmits, nextTick, ref } from 'vue'
import { NDropdown } from 'naive-ui'
import AvatarComponent from './avatar.vue'
import TextComponent from './text.vue'

interface Props {
  text: string
  dateTime: string
  isUser: boolean
}

interface Emit {
  (ev: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const textRef = ref()
const options = [
  {
    label: '复制',
    key: 'copy',
  },
  {
    label: '删除',
    key: 'delete',
  },
]

const xRef = ref(0)
const yRef = ref(0)
const showDropdownRef = ref(false)

function handleSelect(key: string | number) {
  switch (key) {
    case 'copy':
      copyText()
      return
    case 'delete':
      emit('delete')
  }
  showDropdownRef.value = false
}

function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = e.clientX
    yRef.value = e.clientY
  })
}

function onClickoutside() {
  showDropdownRef.value = false
}

function copyText() {
  navigator.clipboard.writeText(props.text)
  showDropdownRef.value = false
}
</script>

<template>
  <div class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': isUser }]">
    <div
      class="flex intems-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[isUser ? 'mr-4 ml-1' : 'ml-4 mr-1']"
    >
      <AvatarComponent :is-user="isUser" />
    </div>
    <div class="overflow-hidden text-md" :class="[isUser ? 'items-end' : 'items-start']">
      <p class="text-sm text-[#f3f6f4]" :class="[isUser ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        class="flex items-end gap-1 mt-2"
        :class="[isUser ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          ref="textRef"
          :text="text"
          :is-user="isUser"
          @contextmenu="handleContextMenu"
        />
      </div>
      <NDropdown
        placement="bottom-start"
        trigger="manual"
        :x="xRef"
        :y="yRef"
        :options="options"
        :show="showDropdownRef"
        :on-clickoutside="onClickoutside"
        @select="handleSelect"
      />
    </div>
  </div>
</template>
