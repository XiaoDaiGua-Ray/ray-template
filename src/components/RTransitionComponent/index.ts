import RTransitionComponent from './src/index.vue'
import transitionComponentProps from './src/props'

import type * as RTransitionComponentType from './src/type'
import type { ExtractPublicPropTypes } from 'vue'

export type TransitionComponentProps = ExtractPublicPropTypes<
  typeof transitionComponentProps
>
export type { RTransitionComponentType }

export { RTransitionComponent, transitionComponentProps }
