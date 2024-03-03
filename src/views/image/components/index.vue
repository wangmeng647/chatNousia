<script setup lang="ts">
import { defineEmits, nextTick, ref } from 'vue'
import { NDropdown } from 'naive-ui'
import AvatarComponent from './avatar.vue'
import TextComponent from './text.vue'

interface Props {
  text: string
  dateTime: string
  imageUrl: string | undefined
}

interface Emit {
  (ev: 'delete'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const options = [
  {
    label: '复制',
    key: 'copy',
  },
  // {
  //   label: '删除',
  //   key: 'delete',
  // },
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
  <div class="flex w-full mb-3 mt-3 overflow-hidden">
    <div
      class="flex intems-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8 ml-4 mr-1"
    >
      <AvatarComponent />
    </div>
    <div class="overflow-hidden text-md items-start">
      <p class="text-sm text-[#f3f6f4] text-left">
        {{ dateTime }}
      </p>
      <div class="flex items-end gap-1 mt-2 flex-row">
        <TextComponent
          :text="text"
          @contextmenu="handleContextMenu"
        />
      </div>
      <div v-if="imageUrl !== undefined">
        <img width="256" height="256" alt="服务器错误" :src="imageUrl">
        <!-- <img width="256" height="256" alt="clik 'getImage' to get"  src="./test_turbo.png"/> -->
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
