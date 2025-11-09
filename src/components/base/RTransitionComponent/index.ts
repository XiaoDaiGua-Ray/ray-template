import RTransitionComponent from './src/TransitionComponent.vue'
import transitionComponentProps from './src/props'

import type * as RTransitionComponentType from './src/types'
import type { ExtractPublicPropTypes } from 'vue'

export type TransitionComponentProps = ExtractPublicPropTypes<
  typeof transitionComponentProps
>
export type { RTransitionComponentType }

export { RTransitionComponent, transitionComponentProps }
