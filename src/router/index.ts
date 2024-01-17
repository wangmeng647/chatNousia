import { createRouter, createWebHashHistory } from 'vue-router'
import Chat from '@/views/chat/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
    },
    {
      path: '/',
      redirect: '/chat',
    },
  ],
})

export default router
