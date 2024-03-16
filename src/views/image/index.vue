<script setup lang='ts'>
import { NButton, NInput, useMessage } from 'naive-ui'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import { Icon } from '@iconify/vue'
import { onBeforeRouteLeave } from 'vue-router'
import MessageComponent from './components/index.vue'
import { useImageStore } from '@/store/image/image'
import { SvgIcon } from '@/components'

const naiveMessage = useMessage()
const scrollRef = ref<ScrollElement>()
let controller = new AbortController()
const useStore = useImageStore()
const placeholder = '请输入英文  Shift + Enter = 换行'
const prompt = ref('')
const loading = ref(false)
type ScrollElement = HTMLDivElement | null

const buttonDisabled = computed(() => {
  return prompt.value.trim().length === 0 || loading.value
})

async function scrollToBottom() {
  await nextTick()
  if (scrollRef.value)
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
}

function promptMessageUpdate() {
  useStore.promptUpdate({
    text: prompt.value,
    dateTime: new Date().toLocaleString(),
    imageUrl: undefined,
  })
}

function imageUpdate(imageUrl: string) {
  useStore.imageUpdate(imageUrl)
}

function handleSubmit() {
  conversation()
}

async function conversation() {
  const message = prompt.value
  if (!message || message.trim() === '')
    return
  try {
    promptMessageUpdate()
  }
  finally {
    prompt.value = ''
    scrollToBottom()
    getImageByPost(message)
  }
}

function getImageByPost(prompt: string) {
  controller = new AbortController()
  loading.value = true
  const data = {
    prompt,
  }
  const head = 'data:image/png;base64,'
  const url = import.meta.env.VITE_URL_IMAGE
  axios
    .post(url, data, {
      responseType: 'arraybuffer',
      signal: controller.signal,
    })
    .then((response) => {
      const enc = new TextDecoder('utf-8')
      const imageUrl = head + enc.decode(response.data).slice(1, -1)
      imageUpdate(imageUrl)
      scrollToBottom()
    })
    .catch((error) => {
      if (error.name !== 'CanceledError')
        naiveMessage.info('工程师正在赶来的路上，请稍后再试')
    })
    .finally(() => {
      loading.value = false
    })
}

function handleEnter(event: KeyboardEvent) {
  if (true) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (loading.value)
        return

      handleSubmit()
    }
  }
}

function handleStopResponse() {
  if (loading.value)
    controller.abort()
}

function handleDelete(index: number) {
  if (loading.value)
    return
  useStore.chatDelete(index)
  console.log('index:', index)
}

onMounted(() => {
  scrollToBottom()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})

onBeforeRouteLeave(() => {
  if (loading.value) {
    naiveMessage.info('请完成生成后再进行切换')
    return false
  }
})
</script>

<template>
  <div class="flex flex-col w-full h-screen">
    <main class="flex-1 overflow-hidden">
      <div ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div class="bg-[#101014] w-full max-w-full m-auto">
          <template v-if="!useStore.imageData.length">
            <div class="flex justify-center mt-5 text-center text-[#f3f6f4] text-3xl">
              <span>Image</span>
            </div>
          </template>
          <template v-else>
            <div>
              <MessageComponent
                v-for="(item, index) of useStore.imageData" :key="index"
                :text="item.text"
                :date-time="item.dateTime"
                :image-url="item.imageUrl"
                @delete="handleDelete(index)"
              />
            </div>
          </template>
        </div>
      </div>
    </main>

    <footer class="p4">
      <div v-if="loading" class="sticky bottom-0 flex justify-center mb-2">
        <NButton type="warning" round @click="handleStopResponse">
          <Icon icon="ci:stop-sign" width="19" />生成中,约需30秒,点击取消生成
        </NButton>
      </div>
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-end justify-between space-x-2 mb-4">
          <NInput
            v-model:value="prompt"
            type="textarea"
            :placeholder="placeholder"
            :autosize="{ minRows: 1, maxRows: 12 }"
            @keypress="handleEnter"
          />
          <NButton
            type="primary"
            :disabled="buttonDisabled"
            @click="handleSubmit"
          >
            <template #icon>
              <span>
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>
