import { createApp } from 'vue'

import '@/styles/base.scss'

import 'virtual:svg-icons-register' // 注册 vite-plugin-svg-icons 脚本

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
