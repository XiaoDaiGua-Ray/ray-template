import type { RouteConfig } from '@/router/config/schema'
import { routeConfigSchema } from '@ray-template/routing/schema'
import * as v from 'valibot'
import { adminRequest } from './client'
import {
  changedSchema,
  loginResultSchema,
  sessionSchema,
  userListSchema,
  userOptionsSchema,
  userSchema,
} from './contracts'
import type { UserInput, UserListParams, UserStatus } from './contracts'

export const loginAdmin = (username: string, password: string) =>
  adminRequest('auth/login', loginResultSchema, {
    method: 'post',
    data: { username, password },
  })
export const getAdminSession = () =>
  adminRequest('auth/session', sessionSchema, { method: 'get' })
export const logoutAdmin = () =>
  adminRequest('auth/logout', v.null(), { method: 'post' })
export const getAdminRoutes = (view?: 'editor') =>
  adminRequest('route-config', routeConfigSchema, {
    method: 'get',
    params: view ? { view } : void 0,
  })
export const updateAdminRoutes = (config: RouteConfig) =>
  adminRequest('route-config', routeConfigSchema, {
    method: 'put',
    data: config,
  })
export const getUserOptions = (signal?: AbortSignal) =>
  adminRequest('users/options', userOptionsSchema, { method: 'get', signal })
export const getUsers = async (
  params: UserListParams,
  signal?: AbortSignal,
) => {
  const { items, total } = await adminRequest('users', userListSchema, {
    method: 'get',
    params,
    signal,
  })

  return { data: items, total }
}
export const getUser = (id: string, signal?: AbortSignal) =>
  adminRequest(`users/${encodeURIComponent(id)}`, userSchema, {
    method: 'get',
    signal,
  })
export const createUser = (data: UserInput) =>
  adminRequest('users', userSchema, { method: 'post', data })
export const updateUser = (id: string, data: UserInput) =>
  adminRequest(`users/${encodeURIComponent(id)}`, userSchema, {
    method: 'put',
    data,
  })
export const deleteUsers = (ids: string[]) =>
  adminRequest('users/batch-delete', changedSchema, {
    method: 'post',
    data: { ids },
  })
export const updateUserStatus = (ids: string[], status: UserStatus) =>
  adminRequest('users/status', changedSchema, {
    method: 'patch',
    data: { ids, status },
  })
export const resetDemoUsers = () =>
  adminRequest('users/reset', changedSchema, { method: 'post' })
