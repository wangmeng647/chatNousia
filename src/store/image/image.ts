import { defineStore } from 'pinia'
import { getLocalState } from './helper'
import type { imageMessage } from './helper'

export const useImageStore = defineStore('image-store', {
  state: () => getLocalState(),
  actions: {
    imageUpdate(imageUrl: string) {
      this.imageData[this.imageData.length - 1].imageUrl = imageUrl
      this.recordeState()
    },

    promptUpdate(data: imageMessage) {
      this.imageData.push(data)
      this.recordeState()
    },

    imageDelete(index: number) {
      this.imageData.splice(index, 1)
      this.recordeState()
    },

    promptDelete(index: number) {
      this.imageData.splice(index, 1)
      this.recordeState()
    },

    recordeState() {
      // setLocalState(this.$state)
    },
  },
})
