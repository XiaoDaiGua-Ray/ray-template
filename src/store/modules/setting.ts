export const useSetting = defineStore('setting', () => {
  const settingState = reactive({})

  const useUpdateLanguage = (key: string) => {
    // TODO: 修改语言
  }

  return {
    settingState,
    useUpdateLanguage,
  }
})
