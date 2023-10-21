import type { BaseTransitionProps } from 'vue'

export interface TransitionProps {
  transitionPropName?: string
  transitionMode?: BaseTransitionProps['mode']
  transitionAppear?: boolean
}
