import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// import { setupI18n } from './locales'
// import { setupStore } from './store'
// import { setupRouter } from './router'
import router from './router/index'

// import './style/tailwind.css'
import setupAssets from '@/plugins/styleInitiate'
import setupScrollbarStyle from '@/plugins/scrollbarSetup'
import type { Chat } from '@/tt'

function all(s: Chat.chat) {
  return s
}
const a = { id: 2 }
all(a)
async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  setupAssets()
  app.use(pinia)
  setupScrollbarStyle()
  app.use(router)
  app.mount('#app')
}
bootstrap()
