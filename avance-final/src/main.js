import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Inicio.vue'
import Menu from './views/Carta.vue'
import Dish from './views/Detalle.vue'
import Booking from './views/Reserva.vue'
import Experience from './views/Experiencia.vue'
import './heritage.css'
import './app.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home, meta: { title: 'Inicio' } },
    { path: '/carta', component: Menu, meta: { title: 'La carta' } },
    { path: '/carta/:id', component: Dish, props: true, meta: { title: 'Detalle del plato' } },
    { path: '/reserva', component: Booking, meta: { title: 'Reservar mesa' } },
    { path: '/experiencia', component: Experience, meta: { title: 'La experiencia' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, saved) { return saved || (to.hash ? { el: to.hash } : { top: 0 }) }
})
router.afterEach(to => { document.title = to.meta.title + ' · Cecilia Restaurante' })
createApp(App).use(router).mount('#app')
