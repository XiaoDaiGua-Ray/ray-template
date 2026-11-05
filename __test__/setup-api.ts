import { setupServer } from 'msw/node'
import { apiUrl } from '../apps/admin/src/api/admin/client'
import { createAdminDatabase } from '../apps/admin/src/mocks/database'
import { createAdminHandlers } from '../apps/admin/src/mocks/handlers'

if (typeof document !== 'undefined') {
  const server = setupServer(
    ...createAdminHandlers(createAdminDatabase(), apiUrl('')),
  )

  // 部分旧 Hook 用例在 describe 收集阶段启动应用，拦截必须先于该阶段就绪。
  server.listen({ onUnhandledRequest: 'bypass' })
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}
