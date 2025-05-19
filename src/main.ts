import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import router from './router/router'


import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'

// Инициализация Vuetify (без темы, если не требуется)
const vuetify = createVuetify({
  components,
  directives,
  // theme: { defaultTheme: 'light' } // Раскомментировать, если нужна тема
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(vuetify)
app.use(pinia)

app.mount('#app')