import { lsm } from '../utils/localStorage'

const STORAGE_NAME = 'chatStorage'

function defaultState() {
  return {
    chatData: [],
  }
}

export function getLocalState() {
  const localState = lsm.get(STORAGE_NAME)
  return localState ?? defaultState()
}

export function setLocalState(data: Array<object>) {
  lsm.set(STORAGE_NAME, data)
}
