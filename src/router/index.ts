import { createRouter, createWebHashHistory } from 'vue-router'
import Chat from '@/views/chat/index.vue'
import Image from '@/views/image/index.vue'
import Layout from '@/views/layout/layout.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/chat',
      children: [
        {
          path: '/chat',
          name: 'chat',
          component: Chat,
        },
        {
          path: '/image',
          name: 'image',
          component: Image,
        },
      ],
    },
  ],
})

// router.beforeEach((to, from) => {
//   if (to.name === 'image'){
//     console.log(2)
//     return false
//   }
// })

export default router
