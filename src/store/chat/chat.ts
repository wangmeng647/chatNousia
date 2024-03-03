import { defineStore } from 'pinia'
import { getLocalState } from './helper'

interface ChatMessage {
  text?: string
  dateTime?: string
  isUser?: boolean
}

export const useChatStore = defineStore('chat-store', {
  state: () => getLocalState(),
  actions: {

    chatUpdate(chatMessage: ChatMessage) {
      this.chatData.push(chatMessage)
      this.recordeState()
    },

    chatUpdateSubsequent(text: string, isDone: boolean) {
      if (isDone) {
        this.recordeState()
        return
      }
      this.chatData[this.chatData.length - 1].text += text
    },

    chatDelete(index: number) {
      this.chatData.splice(index, 1)
      this.recordeState()
    },

    recordeState() {
      // setLocalState(this.$state)
    },
  },
})
