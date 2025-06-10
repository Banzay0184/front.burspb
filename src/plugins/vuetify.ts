import { createVuetify } from 'vuetify'

// Безопасная конфигурация Vuetify для SSR
export default createVuetify({
  ssr: true,
  theme: {
    defaultTheme: 'light'
  },
  // Минимальная конфигурация без проблемных CSS импортов
  defaults: {
    VBtn: {
      style: 'text-transform: none;'
    }
  }
}) 