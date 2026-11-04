import { useRuntimeActions } from '@/store'

export const useSpinning = () => {
  const { reloadContent: reload, setRuntimeState } = useRuntimeActions()

  const openSpin = () => setRuntimeState('layoutContentSpinning', true)
  const closeSpin = () => setRuntimeState('layoutContentSpinning', false)

  return { reload, openSpin, closeSpin }
}

export type UseSpinningReturnType = ReturnType<typeof useSpinning>
