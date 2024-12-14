import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import Math from './components/Math.vue'
import Multiply from './components/Multiply.vue'
import Substract from './components/Substract.vue'
import Sum from './components/Sum.vue'

const routes = [
  { path: '/', redirect: '/sumar' },
  { path: '/multiplicar', component: Multiply },
  { path: '/sumar', component: Sum },
  { path: '/restar', component: Substract },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router