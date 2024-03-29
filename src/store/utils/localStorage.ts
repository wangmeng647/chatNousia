function localStorageManager() {
  function get(key: string) {
    const local_store = JSON.parse(localStorage.getItem(key) as string)
    return local_store
  }

  function set(key: string, data: Array<object>) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  return { get, set }
}

export const lsm = localStorageManager()
