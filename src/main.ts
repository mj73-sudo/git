// main.ts
(window as any).global = window;

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// استایل‌ها و Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './main.css'
import './main.scss'
import vuetify from './plugins/vuetify'

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app')
