<script setup lang='ts'>
import { NButton, NInput, useMessage } from 'naive-ui'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { onBeforeRouteLeave } from 'vue-router'
import MessageComponent from './components/index.vue'
import { useChatStore } from '@/store/chat/chat'
import { SvgIcon } from '@/components'

const naiveMessage = useMessage()
const scrollRef = ref<ScrollElement>()
let controller = new AbortController()
const useStore = useChatStore()
const placeholder = 'Shift + Enter = 换行'
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

function userMessageUpdate() {
  useStore.chatUpdate({
    text: prompt.value,
    isUser: true,
    dateTime: new Date().toLocaleString(),
  })
}

function aiMessageUpdate(aiResponse: string, isSubsquent: boolean, isDone = false) {
  if (isSubsquent) {
    useStore.chatUpdateSubsequent(aiResponse, isDone)
  }
  else {
    useStore.chatUpdate({
      text: aiResponse,
      isUser: false,
      dateTime: new Date().toLocaleString(),
    })
  }
}

function handleSubmit() {
  conversation()
}

function fetchApi(message: string) {
  // const data = {
  //   'prompt': message,
  //   "max_length": 1000,
  //   "top_p": 10,
  //   "temperature": 0.2,
  //   "options": {},
  //   "memory": 1,
  //   "is_knowledge": false
  // }`
  const data = {
    prompt: message,
  }
  const getData = async () => {
    try {
      controller = new AbortController()
      loading.value = true
      const urlchat = import.meta.env.VITE_URL_CHAT
      const response = await fetch(urlchat, {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify(data),
        headers: {
          'Accept': 'text/event-stream',
          'Content-type': 'application/json',
        },
      })
      if (response.status !== 200) {
        naiveMessage.info('服务器错误，请稍后再试')
        loading.value = false
        scrollToBottom()
        return
      }
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let isSubsquent = false
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          loading.value = false
          aiMessageUpdate('', isSubsquent, done)
          break
        }
        const decodedChunk = decoder.decode(value, { stream: true })
        aiMessageUpdate(decodedChunk, isSubsquent)
        if (!isSubsquent)
          scrollToBottom()

        isSubsquent = true
      }
      scrollToBottom()
    }
    catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        aiMessageUpdate('', true, true)
      }
      else {
        naiveMessage.info('工程师正在赶来的路上，请稍后再试')
        loading.value = false
        scrollToBottom()
      }
      loading.value = false
    }
  }
  getData()
}

async function conversation() {
  const message = prompt.value
  if (!message || message.trim() === '')
    return
  userMessageUpdate()
  prompt.value = ''
  scrollToBottom()
  fetchApi(message)
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
          <template v-if="!useStore.chatData.length">
            <div class="flex justify-center mt-5 text-center text-[#f3f6f4] text-3xl">
              <span>Chat</span>
            </div>
          </template>
          <template v-else>
            <div>
              <MessageComponent
                v-for="(item, index) of useStore.chatData" :key="index"
                :text="item.text"
                :date-time="item.dateTime"
                :is-user="item.isUser"
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
          <Icon icon="ci:stop-sign" width="19" />停止回复
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
