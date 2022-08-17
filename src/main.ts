import { createApp } from 'vue'

import '@/styles/base.scss'

import 'amfe-flexible'

import App from './App'

import { setupRouter } from './router/index'
import { setupStore } from './store/index'
import { setupI18n } from './language/index'

const setupTemplate = () => {
  const app = createApp(App)

  setupRouter(app)

  setupStore(app)

  setupI18n(app)

  app.mount('#app')
}

setupTemplate()
