import { lsm } from '../utils/localStorage'

const STORAGE_NAME = 'imageStorage'

export interface imageMessage {
  text?: string
  dateTime?: string
  imageUrl?: string | undefined
}

function defaultState() {
  const data: Array<imageMessage> = []
  return {
    imageData: data,
  }
}

export function getLocalState() {
  const localState = lsm.get(STORAGE_NAME)
  return localState ?? defaultState()
}

export function setLocalState(data: Array<object>) {
  lsm.set(STORAGE_NAME, data)
}
