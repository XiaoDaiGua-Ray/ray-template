import type { ExtractPublicPropTypes } from 'vue'
import transitionComponentProps from './src/props'
import RTransitionComponent from './src/TransitionComponent.vue'
import type * as RTransitionComponentType from './src/types'

export type TransitionComponentProps = ExtractPublicPropTypes<
  typeof transitionComponentProps
>
export type { RTransitionComponentType }

export { RTransitionComponent, transitionComponentProps }
