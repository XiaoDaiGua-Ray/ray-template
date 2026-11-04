import type { TransitionProps } from './transition-types'

const props: TransitionProps = {
  transitionPropName: 'fade',
  transitionMode: 'out-in',
  transitionAppear: true,
} as const

export default props
