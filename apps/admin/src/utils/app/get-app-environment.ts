/**
 *
 * @returns Vite 注入的公开环境配置；VITE_ 前缀的值会进入浏览器产物。
 */
export const getAppEnvironment = () => import.meta.env
