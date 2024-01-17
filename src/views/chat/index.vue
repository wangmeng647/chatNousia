<script setup lang='ts'>
import { NAutoComplete, NButton, NCard, NInput } from 'naive-ui'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import axios from 'axios'
import { Icon } from '@iconify/vue'
import MessageComponent from './components/index.vue'
import { useChatStore } from '@/store/chat/chat'
import { SvgIcon } from '@/components'

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
    dataTime: new Date().toLocaleString(),
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
      dataTime: new Date().toLocaleString(),
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
      const urlchat = 'http://www.nousia.cn:8080'
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
        aiMessageUpdate('服务器错误请稍后再试', false)
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
        scrollToBottom()
        isSubsquent = true
      }
    }
    catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        aiMessageUpdate('', true, true)
      }
      else {
        aiMessageUpdate('服务器错误请稍后再试', false)
        loading.value = false
        scrollToBottom()
      }
      loading.value = false
    }
  }
  getData()
  // const res = axios.post('http://127.0.0.1:3002/chat-process', data)
  // res.then(r => {
  //           console.log('success:', r.data)
  //           console.log(typeof(r.data))
  //           let responseText = r.data
  //           responseText = removeDataPrefix(responseText)
  //           const lastIndex = responseText.lastIndexOf('data: ')
  //           let chunk = responseText
  //           if (lastIndex !== -1){
  //             chunk = responseText.substring(lastIndex)
  //           }
  //           chunk = removeDataPrefix(chunk)
  //           const response = JSON.parse(chunk)
  //           aiMessageUpdate(response.text)
  //           scrollToBottom()
  //         },
  //         e => {
  //           aiMessageUpdate('服务器错误请稍后再试')
  //           scrollToBottom()
  //         }
  //       )
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
</script>

<template>
  <div class="flex flex-col w-full h-screen">
    <main class="flex-1 overflow-hidden">
      <div ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div class="bg-[#101014] w-full max-w-full m-auto">
          <template v-if="!useStore.chatData.length">
            <div class="flex justify-center mt-5 text-center text-[#f3f6f4] text-3xl">
              <span>Chat-GLM</span>
            </div>
          </template>
          <template v-else>
            <div>
              <MessageComponent
                v-for="(item, index) of useStore.chatData" :key="index"
                :text="item.text"
                :date-time="item.dataTime"
                :is-user="item.isUser"
                @delete="handleDelete(index)"
              />
            </div>
            <!-- <div v-if="loading" class="sticky bottom-0 flex justify-center">
                <NButton type="warning" round @click="handleStopResponse"><Icon icon="ci:stop-sign" width="19" />停止回复</NButton>
            </div> -->
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
        <div class="flex items-center justify-between space-x-2 mb-4">
          <NInput
            v-model:value="prompt"
            type="textarea"
            :placeholder="placeholder"
            :autosize="{ minRows: 1, maxRows: 2 }"
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

<!-- <template>
  <div>
    <NCard>
      <NButton @click="changeTalk">button</NButton>
      {{ useStore.chatData[0]}}
      <NAutoComplete v-model:value="prompt">
      <template #default="{ handleInput, handleBlur, handleFocus }">
        <NInput
          v-model:value="prompt" type="textarea" placeholder="placeholder"
          :autosize="{ minRows: 1, maxRows: 2 }" @input="handleInput" @focus="handleFocus" @blur="handleBlur" @keypress="handleEnter"
        />
      </template>
    </NAutoComplete>
    <hr>
    <NInput
        v-model:value="prompt" type="textarea" placeholder="placeholder" @keypress="handleEnter"
        :autosize="{ minRows: 1, maxRows: 2 }"
      />
    </NCard>
    <h1 ref="t">h1</h1>
    <h2>h2</h2>
    <input type="textarea" name="11" id="qwe" placeholder="inin">
    <button @click="cc">dayinid</button>
    <div class="flex w-full h-full">
      <div class="bg-[#F59E0B] flex-1">1</div>
      <div class="bg-[#059669] flex-1">2</div>
      <div class="bg-[#ef4444] flex-1">3</div>
    </div>
    <div class="bg-[#0bf542] h-7 overflow-hidden overflow-y-auto">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
  </div>
</template> -->
../../store/chat/chat
