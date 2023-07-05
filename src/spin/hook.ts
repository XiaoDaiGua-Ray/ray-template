export const spinValue = ref(false)

/**
 *
 * @param bool has spin
 *
 * @remark 使用 spin 全屏加载效果工具函数
 */
export const setSpin = (bool: boolean) => (spinValue.value = bool)
