import { createRouter, createWebHistory } from 'vue-router'
import Summary from '../views/Summary.vue'
import Confirmed from '../views/Confirmed.vue'
import Recovered from '../views/Recovered.vue'
import Deaths from '../views/Deaths.vue'

const routes = [
  {
    path: '/',
    name: 'Summary',
    component: Summary
  },
  {
    path: '/confirmed',
    name: 'Confirmed',
    component: Confirmed
  },
  {
    path: '/recovered',
    name: 'Recovered',
    component: Recovered
  },
  {
    path: '/deaths',
    name: 'Deaths',
    component: Deaths
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
